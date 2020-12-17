import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
require('dotenv').config();

const main = async () => {
  // connect to db
  const orm = await MikroORM.init(microConfig);
  // run migrations
  await orm.getMigrator().up();
  // create server
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ client: redisClient, disableTTL: true, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true, // you can't access cookie from frontend js code
        sameSite: 'lax', // csrf protection
        secure: __prod__ // cookie only works in https. usually only set true in production
      },
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  )

  // setup apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em })
  })
  // create graphql endpoint on express
  apolloServer.applyMiddleware({ app });

  // listen for connections to port 4000
  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  })
}

main().catch(err => {
  console.error(err);
});