import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";

const main = async () => {
  // connect to db
  const orm = await MikroORM.init(microConfig);
  // run migrations
  await orm.getMigrator().up();
  // create server
  const app = express();
  app.get("/", (_, res) => {
    res.send("hello der");
  })

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  })
}

main().catch(err => {
  console.error(err);
});