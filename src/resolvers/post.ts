import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";

@InputType()
class PostInput {
  @Field()
  title: string
  @Field()
  text: string
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Arg("limit") limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[]> {
    const hardLimit = Math.min(50, limit);
    const queryBuilder = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(hardLimit);

      // number of posts determined by limit. posts are retrieved beginning one after the cursor (we want all posts older than the cursor post)
    if (cursor) {
      queryBuilder.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) })
    }

    return queryBuilder.getMany()
  }

  @Query(() => Post, { nullable: true }) // for graphQL we're going to return a post or null
  post(
    @Arg('id', () => Int) id: number
  ): Promise<Post | undefined> { // <Post | null> union in Typescript says this will return a Post or null
    return Post.findOne(id)
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  createPost(
    @Arg("input") input: PostInput,
    @Ctx() ctx: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, creatorId: ctx.req.session.userId }).save();
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