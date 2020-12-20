import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

// @field exposes field to our graphql schema (makes it queryable)

@ObjectType()
@Entity()
export class Upvote extends BaseEntity {
  @Field()
  @Column()
  userId: number;

  @Field()
  @ManyToOne(() => User, user => user.upvotes)
  user: User;

  @Field()
  @Column()
  postId: number;

  @Field()
  @ManyToOne(() => Post, post => post.upvotes)
  post: Post;
}