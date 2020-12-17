require("dotenv").config();
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, './migrations'), // returns absolute path to the folder with migrations. 
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
  entities: [Post], // db tables
  dbName: 'redditclone',
  user: 'postgres',
  password: process.env.PSQL_PW,
  type: 'postgresql',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];

// casting to type that MikroORM.init expects for its first parameter in index.ts