# Reddit Clone - Server

```
Technologies Used
- typescript            - apollo-server           - uuid
- redis                 - graphql                 - dataloader
- mikroORM              - nodemailer
- argon2                - postgreSQL
```  
   
1. setup typescript. 
   1. @types/node - gives us access to node type information. 
2. setup mikroORM config and first entity
   1. A few mikroOrm commands:
      // create instance of post
      // const post = orm.em.create(Post, { title: "my first post" })
      // save to database
      // await orm.em.persistAndFlush(post);

      // const posts = await orm.em.find(Post, {});
      // console.log(posts);
3. give resolvers access to orm.em object through context
4. create CRUD operation resolvers with MikroORM for basic entity
   1. single post query
   2. all posts query
   3. create post mutation
   4. update post mutation
   5. delete post mutation
5. set up authentication
   1. set up user entity
   2. create user table in DB through a migration (set up a script so we don't have to remember the migration command for MikroORM)
   3. create register mutation
      1. use node-argon2 to hash password to save to DB
      2. validate registration info
   4. create login mutation
      1. handle errors with UserResponse and FieldError objectTypes
      2. validate password with argon2.verify
6. store cookie in user's browser with sessions for authentication
   1. set up redis store
   2. once a cookie is saved to our browser, whenever we make followup requests, that cookie will be sent to the server along with the request. The server identifies me based on the cookie
      1. req.session.userId = user.id 
         1. stores data into session. In this case the user.id is sent to redis
         2. redis is a key/value store. the value is our session object, in this case {userId: user.id}
         3. express session middleware sets a cookie on the browser. The cookie value is a signed version of the redis key
         4. when a user makes a request, the cookie is sent to the server
         5. the server decrypts the cookie using the secret we defined in our session options (process.env.SESSION_SECRET)
         6. the server then makes a request to redis, and redis takes the decrypted cookie(which is supposed to match a key in the redis store) and retrieves the associated value (the object containing our userId in step 2)
         7. the retrieved value is stored in req.session
7.  set up forgot password utility with NodeMailer
8.  add email property to User entity, run migration to add column to DB table
9.  add forget password and change password mutations
10. transition from MikroORM to TypeORM
11. add relationships between user and post entities
12. auth middleware to check if user is logged in when making post
13. add pagination to posts resolver
14. add paginatedPosts objectType to inform client whether or not there are more posts to be fetched
15. replace queryBuilder in posts resolver with raw SQL for better syntax
16. add field resolver in User resolver to only show email for posts of the logged in user
17. add upvote entity
18. add vote resolver using raw sql and transactions to update Upvote table as well as the Post table containing each post's total points
19. add vote status to post entity to indicate whether we've voted on the post or not
21. update post resolver
22. create field resolver to fetch author for all post queries
23. batch fetch all field resolvers into one db query using dataloader
    1.  [1,2,3,4,5]
    2.  [{ id: 1, username: 'kevin' }, { id: 2, username: 'dylan' }, ...]
24. batch fetch vote statuses for all users for each post