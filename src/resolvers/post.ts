import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
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

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[]
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(
    @Root() root: Post
  ) {
    return root.text.slice(0, 2);
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const hardLimit = Math.min(50, limit);
    const hardLimitPlusOne = hardLimit + 1;
    const queryBuilder = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(hardLimitPlusOne);

    // number of posts determined by limit. posts are retrieved beginning one after the cursor (we want all posts older than the cursor post)
    if (cursor) {
      queryBuilder.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) })
    }

    const posts = await queryBuilder.getMany()

    // if we're able to retrieve the number of posts requested PLUS ONE, then we know that there are more posts to fetch 
    return { posts: posts.slice(0, hardLimit), hasMore: posts.length === hardLimitPlusOne }
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