import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
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
  @Mutation(() => UserResponse)
  async register(
    // typeGraphQL infers the type so we don't have to add () => RegisterInput
    @Arg('options') options: RegisterInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(options.password);

    const findUser = await ctx.em.findOne(User, { username: options.username });
    if (findUser) {
      return {
        errors: [{ field: "username", message: "Username already exists." }]
      }
    }
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
    await ctx.em.persistAndFlush(user);
    
    return {
      user
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: RegisterInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const user = await ctx.em.findOne(User, { username: options.username });
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

    return {
      user
    }
  }
}