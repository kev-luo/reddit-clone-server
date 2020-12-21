import { Request, Response } from "express";
import { Redis } from "ioredis"
import { createUserLoader } from "./utils/createUserLoader";

export type MyContext = {
  req: Request;
  redis: Redis
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>
}