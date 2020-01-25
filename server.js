const { gql, ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.error(err));

const typeDefs = gql`

type Todo {
  task: String
  completed: Boolean
}

type Query {
  getTodos: [Todo]
}

`;

const server = new ApolloServer({
  typeDefs
});

server.listen(8080).then(({ url }) => {
  console.log("Server listening on ${url}");
});
