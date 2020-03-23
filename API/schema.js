// Import GraphQL Schema and object type to build schema
const { GraphQLSchema } = require("graphql");

// Import GraphQL Queries
const RootQueryType = require("./queries");

// Import GraphQL Mutations
const RootMutationType = require("./mutations");

// Create schema
const schema = new GraphQLSchema({
  // Set Query object
  query: RootQueryType,
  //   Set Mutation object
  mutation: RootMutationType
});

module.exports = schema;
