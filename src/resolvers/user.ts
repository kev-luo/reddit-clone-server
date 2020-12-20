import argon2 from "argon2";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root } from "type-graphql";
import { getConnection } from "typeorm";
import { v4 } from "uuid";
import { COOKIE_NAME, FORGET_PW_PREFIX } from "../constants";
import { User } from "../entities/User";
import { sendEmail } from "../utils/sendEmail";
import { validateRegister } from "../utils/validateRegister";
import { AuthInput } from "./AuthInput";

@ObjectType()
class FieldError {
  // this indicates which field the error occurred with (eg username, password)
  @Field()
  field: string;
  // explanation of error
  @Field()
  message: string;
}

// question marks means the fields are optional
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  // return error if no user is found
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  // return user if user exists
  user?: User
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() ctx: MyContext) {
    // this is the current user and it's ok to show them their own email
    if(ctx.req.session.userId === user.id) {
      return user.email;
    }
    // current user wants to see someone else's email
    return "";
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() ctx: MyContext) {
    // check for a userId in the session. if it doesn't exist that means the requester is not logged in because the login resolver sets the sessionId
    if (!ctx.req.session.userId) {
      return null;
    }
    return User.findOne(ctx.req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    // typeGraphQL infers the type so we don't have to add () => RegisterInput
    @Arg('options') options: AuthInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);

    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);

    let user;
    try {
      const result = await getConnection().createQueryBuilder().insert().into(User).values({
        username: options.username,
        email: options.email,
        password: hashedPassword,
      }).returning("*").execute();
      user = result.raw[0]
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "User already exists."
            }
          ]
        }
      }
    }

    // store user id session, set cookie that keeps registered user logged in
    ctx.req.session.userId = user.id;

    return {
      user
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(usernameOrEmail.includes("@") ? { where: { email: usernameOrEmail } } : { where: { username: usernameOrEmail } });
    if (!user) {
      return {
        errors: [{ field: "usernameOrEmail", message: "User does not exist." }]
      }
    }

    const validatePw = await argon2.verify(user.password, password);
    if (!validatePw) {
      return {
        errors: [{ field: "password", message: "Password is incorrect" }]
      }
    }

    // we can store anything inside session variable. here we're storing the user.id inside a newly created property called userId
    req.session.userId = user.id

    return {
      user
    }
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() ctx: MyContext
  ) {
    return new Promise((res) =>
      ctx.req.session.destroy((err) => {
        ctx.res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          res(false);
          return
        }
        res(true);
      })
    )
  }

  @Mutation(() => Boolean)
  async forgotPw(
    @Arg("email") email: string,
    @Ctx() ctx: MyContext
  ) {
    // we have to specify where if we're looking up based on column that isn't primary key
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return true
    }
    const token = v4();
    await ctx.redis.set(`${FORGET_PW_PREFIX}${token}`, user.id, 'ex', 1000 * 60 * 60 * 24)

    const link = `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
    sendEmail(email, "Reset Password", link)

    return true
  }

  @Mutation(() => UserResponse)
  async changePw(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 3) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Password must be greater than 3 characters"
          }
        ]
      }
    }

    const key = `${FORGET_PW_PREFIX}${token}`
    // check if token matches token stored in redis
    const userId = await ctx.redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "Token expired."
          }
        ]
      }
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          }
        ]
      }
    }

    await User.update({ id: userIdNum }, { password: await argon2.hash(newPassword) })

    // delete redis token so they can't change the password using the same key multiple times
    await ctx.redis.del(key);

    // login user after changing password
    ctx.req.session.userId = user.id;

    return { user }
  }
}