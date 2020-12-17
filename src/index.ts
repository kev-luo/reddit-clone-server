import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";

const main = async() => {
  const orm = MikroORM.init({
    entities: [], // db tables
    dbName: 'redditclone',
    type: 'postgresql',
    debug: !__prod__,
  });
}

main();