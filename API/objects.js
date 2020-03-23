const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} = require("graphql");

// Provide access to controllers for relationships
const { authors, books } = require("../models/db");

// Create the Book Data object within GraphQL
const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  //   Below are functions because there are a lot of referenced objects that tend to be created at a later stage
  fields: () => ({
    //   Id and Name fields are encased in Non Null as they are non-nullable
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    // Adding an associated value using foreign key
    author: {
      type: AuthorType,
      // Resolve using function that takes input book values from parent property
      resolve: book => {
        // Return values in authors data object that have same id value as current book's author id using filter
        return authors.find(author => author.id === book.authorId);
      }
    }
  })
});

// Create the Author Data object within GraphQL
const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents an author of a book",
  fields: () => ({
    //   Id and Name fields are encased in Non Null as they are non-nullable
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    // Multiple books per author
    books: {
      type: GraphQLList(BookType),
      resolve: author => {
        // Return values in books data object that have same id value as current book's author id using filter
        return books.filter(book => book.authorId === author.id);
      }
    }
  })
});

module.exports = {
  AuthorType: AuthorType,
  BookType: BookType
};
