import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { v4 } from "uuid";

import { User } from "../entities/User";
import { MyContext } from "src/types";
import { COOKIE_NAME, FORGET_PW_PREFIX } from "../constants";
import { AuthInput } from "./AuthInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
// import { EntityManager } from "@mikro-orm/postgresql"

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

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(@Ctx() ctx: MyContext): Promise<User[]> {
    const users = await ctx.em.find(User, {});
    return users;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    // check for a userId in the session. if it doesn't exist that means the requester is not logged in because the login resolver sets the sessionId
    if (!ctx.req.session.userId) {
      return null;
    }
    const user = await ctx.em.findOne(User, { id: ctx.req.session.userId });
    return user;
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

    const findUser = await ctx.em.findOne(User, { username: options.username })
    if (findUser) {
      return {
        errors: [{ field: "username", message: "User already exists" }]
      }
    }

    const user = await ctx.em.create(User, { username: options.username, email: options.email, password: hashedPassword })
    await ctx.em.persistAndFlush(user);
    // let user;
    // try {
    // await ctx.em.persistAndFlush(user);
    //   const result = await (ctx.em as EntityManager).createQueryBuilder(User).getKnexQuery().insert(
    //     {
    //       username: options.username,
    //       password: hashedPassword,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     }
    //   ).returning("*");
    //   user = result[0]
    // } catch(err) {
    //   console.log(err);
    //   if(err.detail.includes("already exists")) {
    //     return {
    //       errors: [{ field: "username", message: "User already exists."}]
    //     }
    //   }
    // }

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
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, usernameOrEmail.includes("@") ? { email: usernameOrEmail } : { username: usernameOrEmail });
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
    const user = await ctx.em.findOne(User, { email })
    if (!user) {
      return true
    }
    const token = v4();
    await ctx.redis.set(`${FORGET_PW_PREFIX}${token}`, user.id, 'ex', 1000 * 60 * 60 * 24)

    const link = `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
    sendEmail(email, "Reset Password",link)

    return true
  }
}