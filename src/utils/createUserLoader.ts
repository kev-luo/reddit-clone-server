import DataLoader from "dataloader";
import { User } from "../entities/User";

// the keys we pass in are numbers, and the return value is of User type
export const createUserLoader = () => new DataLoader<number, User>( async userIds => {
  // find all user objects (typeORM)
  const users = await User.findByIds(userIds as number[]);
  // instantiate variable as object
  const userIdToUser: Record<number, User> = {};
  // for each user set their id as a key in the userIdToUser variable and set the value equal to the entire user object
  users.forEach(user => {
    userIdToUser[user.id] = user;
  })

  // map over all userIds, and for each one of them find the user object associated with the given user ID, inside the userIdToUser object, and return the found user object. this returns an array of user objects
  return userIds.map((userId) => userIdToUser[userId])
});