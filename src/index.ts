import "reflect-metadata";
import "dotenv-safe/config";
import { createConnection } from "typeorm";
import express from "express";
import { COOKIE_NAME, __prod__ } from "./constants";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from "cors";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { Upvote } from "./entities/Upvote";
import path from "path";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpvoteLoader } from "./utils/createUpvoteLoader";

const main = async () => {

  const conn = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    // set synchronize to true only in development
    // synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Upvote]
  })
  await conn.runMigrations();
  // await Upvote.delete({});
  // await Post.delete({});
  // await User.delete({});

  // create server
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  // to work withi sessions and cookies in production set the following:
  // app.set("proxy", 1);

  // cors applies to all routes now (globally)
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }))

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTTL: true, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true, // you can't access cookie from frontend js code
        sameSite: 'lax', // csrf protection
        secure: __prod__, // cookie only works in https. usually only set true in production
        // NOTE: setup custom domain for cookies in production
      },
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  )

  // setup apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redis, userLoader: createUserLoader(), upvoteLoader: createUpvoteLoader() }) // access session in resolvers by passing in req/res
  })
  // create graphql endpoint on express
  apolloServer.applyMiddleware({ app, cors: false });

  // listen for connections to port 4000
  app.listen(process.env.PORT, () => {
    console.log(`server started on localhost:${process.env.PORT}`);
  })
}

main().catch(err => {
  console.error(err);
});