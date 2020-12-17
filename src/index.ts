import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(microConfig);

  // create instance of post
  const post = orm.em.create(Post, { title: "my first post" })
  // save to database
  await orm.em.persistAndFlush(post);

  console.log("----------------sql2---------------------")

  // alternatively we can combine the two commands above by doing:
  await orm.em.nativeInsert(Post, { title: "my second post" })
}

main().catch(err => {
  console.error(err);
});