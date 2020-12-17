import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";

// input types for args
@InputType()
class RegisterInput {
  // () => String can be used to override or explicity set the type however, if we don't include it, the type will be implicitly inferred
  @Field()
  username: string
  @Field()
  password: string
}

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
  users(@Ctx() ctx: MyContext): Promise<User[]> {
    return ctx.em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    // check for a userId in the session. if it doesn't exist that means the requester is not logged in because the login resolver sets the sessionId
    if(!ctx.req.session.userId) {
      return null;
    }
    const user = await ctx.em.findOne(User, { id: ctx.req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    // typeGraphQL infers the type so we don't have to add () => RegisterInput
    @Arg('options') options: RegisterInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(options.password);

    if(options.username.length <=2) {
      return {
        errors: [{ field: "username", message: "Username must be greater than 2 characters."}]
      }
    }
    if(options.password.length <=3) {
      return {
        errors: [{ field: "password", message: "Password must be greater than 3 characters."}]
      }
    }

    const user = await ctx.em.create(User, { username: options.username, password: hashedPassword })
    try {
      await ctx.em.persistAndFlush(user);
    } catch(err) {
      //  alternatively we could say: err.detail.includes("already exists")
      if(err.code === "23505") {
        return {
          errors: [{ field: "username", message: "User already exists."}]
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
    @Arg('options') options: RegisterInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [{ field: "username", message: "User does not exist." }]
      }
    }

    const validatePw = await argon2.verify(user.password, options.password);
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
}