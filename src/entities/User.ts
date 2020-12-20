import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";

// @field exposes field to our graphql schema (makes it queryable)

@ObjectType()
@Entity()
export class User extends BaseEntity{
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  // leaving out @Field means we can't query for the password
  @Column()
  password!: string;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  // @OneToMany(() => Upvote, upvote => upvote.user)
  // upvotes: Upvote[];

}