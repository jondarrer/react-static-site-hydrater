const { ApolloClient, InMemoryCache, gql } = require('@apollo/client');

const typeDefs = gql`
  schema {
    query: Query
  }

  type Query {
    sayHello(name: String!): String!
  }
`;

const resolvers = {
  Query: {
    sayHello: (_, { name }, _context) => `Hello ${name}!`,
  },
};

const client = new ApolloClient({
  uri: null,
  cache: new InMemoryCache(),
  typeDefs,
  resolvers,
});

module.exports = client;
