const { gql, ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });
const User = require('./models/User');
const Post = require('./models/Post');

const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require('./resolvers');

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => console.log("DB Connected"))
  .catch(err => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Post
  }
});

server.listen(4000).then(({ url }) => {
  console.log("Server listening on ${url}");
});
