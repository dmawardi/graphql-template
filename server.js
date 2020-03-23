const express = require("express");
// Import GraphQL
const expressGraphQL = require("express-graphql");
// Import GraphQL Schema
const schema = require("./API/schema");

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
