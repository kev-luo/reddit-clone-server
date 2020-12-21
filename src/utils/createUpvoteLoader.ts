import DataLoader from "dataloader";
import { Upvote } from "../entities/Upvote";

// the keys we pass in are objects containing the post and user ids, and the return value is either a number or null
export const createUpvoteLoader = () => new DataLoader<{postId: number, userId: number}, Upvote | null>( async ids => {

  const upvotes = await Upvote.findByIds(ids as any);

  const postToUser: Record<string, Upvote> = {};
  upvotes.forEach(upvote => {
    postToUser[`${upvote.userId}|${upvote.postId}`] = upvote 
  })

  return ids.map((idSet) => postToUser[`${idSet.userId}|${idSet.postId}`])
});