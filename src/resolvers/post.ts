import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    const posts = await ctx.em.find(Post, {});
    return posts
  }

  @Query(() => Post, { nullable: true }) // for graphQL we're going to return a post or null
  async post(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> { // <Post | null> union in Typescript says this will return a Post or null
    const post = await ctx.em.findOne(Post, { id })
    return post
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post> {
    const post = ctx.em.create(Post, { title })
    await ctx.em.persistAndFlush(post)
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    // whenever we make something nullable, we have to explicitly state the type for typegraphql
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const post = await ctx.em.findOne(Post, { id })
    if (!post) {
      return null
    }
    if (post.title !== 'undefined') {
      post.title = title;
      await ctx.em.persistAndFlush(post);
    }
    return post
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    try {
      await ctx.em.nativeDelete(Post, { id });
    } catch (err) {
      return false
    }
    return true
  }
}