import { Field, InputType } from "type-graphql";

// input types for args
@InputType()
export class AuthInput {
  // () => String can be used to override or explicity set the type however, if we don't include it, the type will be implicitly inferred
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
