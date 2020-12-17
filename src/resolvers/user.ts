import { User } from "src/entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";

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
    @Arg('options') options: RegisterInput ,
    @Ctx() ctx: MyContext
  ): Promise<User> {
    const user = await ctx.em.create(User, { username: options.username})
    await ctx.em.persistAndFlush(user);
    return user;
  }
}