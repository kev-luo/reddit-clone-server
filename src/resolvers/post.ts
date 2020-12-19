import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, { nullable: true }) // for graphQL we're going to return a post or null
  post(
    @Arg('id', () => Int) id: number
  ): Promise<Post | undefined> { // <Post | null> union in Typescript says this will return a Post or null
    return Post.findOne(id)
  }

  @Mutation(() => Post)
  createPost(
    @Arg("title") title: string
  ): Promise<Post> {
    return Post.create({ title }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    // whenever we make something nullable, we have to explicitly state the type for typegraphql
    @Arg("title", () => String, { nullable: true }) title: string): Promise<Post | null> {
    const post = await Post.findOne(id)
    if (!post) {
      return null
    }
    if (post.title !== 'undefined') {
      await Post.update({ id }, { title })
    }
    return post
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number): Promise<Boolean> {
    try {
      await Post.delete(id);
    } catch (err) {
      return false
    }
    return true
  }
}