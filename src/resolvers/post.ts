import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { Upvote } from "../entities/Upvote";
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
    return `${root.text.slice(0, 15)}...`;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() ctx: MyContext
  ): Promise<PaginatedPosts> {
    const hardLimit = Math.min(50, limit);
    const hardLimitPlusOne = hardLimit + 1;

    const replacements: any[] = [hardLimitPlusOne];

    let cursorIndex = 3;

    if (ctx.req.session.userId) {
      replacements.push(ctx.req.session.userId);
    }

    // number of posts determined by limit. posts are retrieved beginning one after the cursor (we want all posts older than the cursor post)
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
      cursorIndex = replacements.length;
    }

    const posts = await getConnection().query(`
    SELECT p.*, 
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'createdAt', u."createdAt",
      'updatedAt', u."updatedAt"
      ) author,
    ${ctx.req.session.userId
        ? '(SELECT value FROM upvote WHERE "userId" = $2 AND "postId" = p.id) "voteStatus" '
        : 'null as "voteStatus"'
      }
    FROM post p
    INNER JOIN public.user u ON u.id = p."authorId"
    ${cursor ? `WHERE p."createdAt" < $${cursorIndex}` : ""}
    ORDER BY p."createdAt" DESC
    LIMIT $1
    `, replacements)

    // const queryBuilder = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect(
    //     "p.author",
    //     "u",
    //     'u.id = p."creatorId"'
    //   )
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(hardLimitPlusOne);

    // if (cursor) {
    //   queryBuilder.where('p."createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) })
    // }

    // const posts = await queryBuilder.getMany()

    // if we're able to retrieve the number of posts requested PLUS ONE, then we know that there are more posts to fetch 
    return { posts: posts.slice(0, hardLimit), hasMore: posts.length === hardLimitPlusOne }
  }

  @Query(() => Post, { nullable: true }) // for graphQL we're going to return a post or null
  post(
    @Arg('id', () => Int) id: number
  ): Promise<Post | undefined> { // <Post | null> union in Typescript says this will return a Post or null
    return Post.findOne(id, { relations: ["author"] })
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  createPost(
    @Arg("input") input: PostInput,
    @Ctx() ctx: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, authorId: ctx.req.session.userId }).save();
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() ctx: MyContext
  ) {
    const isUpvote = value !== -1;
    const upvoteValue = isUpvote ? 1 : -1;
    const { userId } = ctx.req.session;

    const upvote = await Upvote.findOne({ where: { postId, userId } })

    // just writing sql to update table
    if (upvote && upvote.value !== upvoteValue) {
      // if the user has already voted on this post but wants to change their vote
      await getConnection().transaction(async (txnMgr) => {
        await txnMgr.query(`
          UPDATE upvote
          SET value = $1
          WHERE "postId" = $2 AND "userId" = $3
        `, [upvoteValue, postId, userId])
        await txnMgr.query(`
          UPDATE post
          SET points = points + $1
          WHERE id = $2
        `, [2 * upvoteValue, postId])
      })
    } else if (!upvote) {
      // if user has noever voted on this post
      await getConnection().transaction(async (txnMgr) => {
        await txnMgr.query(`
          INSERT INTO upvote ("userId", "postId", "value")
          VALUES ($1, $2, $3)
        `, [userId, postId, upvoteValue])

        await txnMgr.query(`
          UPDATE post
          SET points = points + $1
          WHERE id = $2
        `, [upvoteValue, postId])
      })
    }
    // await Upvote.insert({
    //   userId,
    //   postId,
    //   value: upvoteValue,
    // })

    return true
  }
}