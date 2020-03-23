const { gql, ApolloServer, AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
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

const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new AuthenticationError('Your session has ended. Please sign in again.');
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => ({
     name: error.name,
     message: error.message
  }),
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return { User, Post, currentUser: await getUser(token) };
  }
});

server.listen(4000).then(({ url }) => {
  console.log("Server listening on ${url}");
});
