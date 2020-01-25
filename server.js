const { gql, ApolloServer } = require('apollo-server');

const todos = [
  { task: 'Wash car', completed: false} ,
  { task: 'Clean room', completed: true} ,
  { task: 'Potato potato', completed: true} ,
];

const typeDefs = gql`

type Todo {
  task: String
  completed: Boolean
}

type Query {
  getTodos: [Todo]
}

type Mutation {
  addTodo(task: String, completed: Boolean): Todo
}

`;

const resolvers = {
  Query: {
    getTodos: function() {
      return todos;
    }
  },
  Mutation: {
    addTodo: (parent, { task, completed }) => {
      const todo = { task, completed };
      todos.push(todo);
      return todo;
    }
  }
}

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers
});

server.listen(8080).then(({ url }) => {
  console.log("Server listening on ${url}");
});
