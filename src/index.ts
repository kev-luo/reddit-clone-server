import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  // connect to db
  const orm = await MikroORM.init(microConfig);
  // run migrations
  await orm.getMigrator().up();
  // create server
  const app = express();
  // setup apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
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