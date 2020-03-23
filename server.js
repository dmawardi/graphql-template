const express = require("express");
// Import GraphQL
const expressGraphQL = require("express-graphql");
// Import GraphQL Schema and object type to build schema
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} = require("graphql");

// Dummy Data
const authors = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" }
];

const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 }
];

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

// Create Root Mutation Type
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  // Mutation API Routes
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a Book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        //   Create a book object using args values and create an id that is the length of current dummy DB
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId
        };
        books.push(book);
        return book;
      }
    },
    addAuthor: {
      type: AuthorType,
      description: "Add an Author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        //   Create a book object using args values and create an id that is the length of current dummy DB
        const author = {
          id: authors.length + 1,
          name: args.name
        };
        authors.push(author);
        return author;
      }
    }
  })
});

// Create schema
const schema = new GraphQLSchema({
  // Set Query object
  query: RootQueryType,
  //   Set Mutation object
  mutation: RootMutationType
});

// Init Server and port variable
const app = express();
const PORT = 5000;

// Add GraphQL Route
app.use(
  "/graphql",
  expressGraphQL({
    //   Create with schema
    schema: schema,
    // Set graphical interface to true
    graphiql: true
  })
);

// Listen to Port
app.listen(PORT, () => {
  console.log("Running on " + PORT);
});
