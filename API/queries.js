const { GraphQLObjectType, GraphQLList, GraphQLInt } = require("graphql");

// Import Object Models
const { AuthorType, BookType } = require("./objects");

// Provide access to controllers for queries
const { authors, books } = require("../models/db");

// GraphQL Query Object
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  //   Think of the following section as an API Routes list
  fields: () => ({
    //   Query for a single book
    book: {
      type: BookType,
      description: "A Single Book",
      //   Acceptable arguments (to be used in resolver below)
      args: {
        id: { type: GraphQLInt }
      },
      // To resolve here, we will use parent and args (allowed args desc. above). args.id from user should equal book id
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    //   Query for all books
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      // This is where you retrieve the details from database
      resolve: () => books
    },
    // Query for single author
    author: {
      type: AuthorType,
      description: "A Single Author",
      //   Acceptable arguments (to be used in resolver below)
      args: {
        id: { type: GraphQLInt }
      },
      // To resolve here, we will use parent and args (allowed args desc. above). args.id from user should equal author id
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    },

    // Query for all authors
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      // This is where you retrieve the details from database
      resolve: () => authors
    }
  })
});

module.exports = RootQueryType;
