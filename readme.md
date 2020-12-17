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
   5. 