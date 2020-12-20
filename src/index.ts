import "reflect-metadata";
import {createConnection} from "typeorm";
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
require('dotenv').config();

const main = async () => {

  const conn = await createConnection({
    type: 'postgres',
    database: 'lireddit',
    username: 'postgres',
    password: process.env.PSQL_PW,
    logging: true,
    synchronize: true,
    entities: [Post, User, Upvote]
  })
  
  // create server
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  // cors applies to all routes now (globally)
  app.use(cors({
    origin: "http://localhost:3000",
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
        secure: __prod__ // cookie only works in https. usually only set true in production
      },
      secret: process.env.SESSION_SECRET!,
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
    context: ({ req, res }): MyContext => ({ req, res, redis }) // access session in resolvers by passing in req/res
  })
  // create graphql endpoint on express
  apolloServer.applyMiddleware({ app, cors: false });

  // listen for connections to port 4000
  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  })
}

main().catch(err => {
  console.error(err);
});