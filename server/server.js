const express = require("express");
const path = require("path");
//import apollo server
const { ApolloServer } = require("apollo-server-express");
// import typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
//connect to db
const db = require("./config/connection");

//const routes = require('./routes');

//express server
const app = express();
const PORT = process.env.PORT || 3001;

//apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

//apollo server with express

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

//app.use(routes);

//get all
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

//server.start().then((res) => {
//  server.applyMiddleware({ app });

//  db.once("open", () => {
//   app.listen(PORT, () => {
//
//   });
//  });
//});

const startApollo = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  // Serve up static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startApollo(typeDefs, resolvers);
