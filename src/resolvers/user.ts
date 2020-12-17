import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
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

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    // typeGraphQL infers the type so we don't have to add () => RegisterInput
    @Arg('options') options: RegisterInput,
    @Ctx() ctx: MyContext
  ): Promise<User> {
    const hashedPassword = await argon2.hash(options.password);
    const user = await ctx.em.create(User, { username: options.username, password: hashedPassword })
    await ctx.em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => User, { nullable: true})
  async login(
    @Arg('options') options: RegisterInput,
    @Ctx() ctx: MyContext
  ) : Promise<User | null> {
    const user = await ctx.em.findOne(User, { username: options.username });
    if(!user) {
      return null
    }
    return user;
  }
}