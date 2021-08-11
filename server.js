// @ts-check
const { createServer } = require("http");
const express = require("express");
const { execute, subscribe } = require("graphql");
const { ApolloServer, gql } = require("apollo-server-express");
const { PubSub } = require("graphql-subscriptions");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const typeDefs = require("./graphql/schema.js");
const resolvers = require("./graphql/resolvers.js");
require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/user");

// mongoose
mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

(async () => {
  const PORT = 3033;
  const pubsub = new PubSub();
  const app = express();
  const httpServer = createServer(app);

  // Schema definition
  // const typeDefs = gql`
  //   type Query {
  //     currentNumber: Int
  //   }

  //   type Subscription {
  //     numberIncremented: Int
  //   }
  // `;

  // Resolver map
  // const resolvers = {
  //   // Query: {
  //   //   currentNumber() {
  //   //     return currentNumber;
  //   //   },
  //   // },
  //   Subscription: {
  //     numberIncremented: {
  //       subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"]),
  //     },
  //   },
  // };

  app.get("/rest", function (req, res) {
    return res.json({ data: "rest" });
    // return User.find()
    //   .exec()
    //   .then((docs) => {
    //     console.log("getAllUsers", docs);
    //     // return docs;
    //     res.json({ data: docs });
    //   })
    //   .catch((err) => {
    //     console.log("getAllUsers error: ", err);
    //     // return { error: err };
    //     res.json({ data: "error" });
    //   });
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
  });
  await server.start();
  server.applyMiddleware({ app });

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });

  let currentNumber = 0;
  function incrementNumber() {
    currentNumber++;
    pubsub.publish("NUMBER_INCREMENTED", { numberIncremented: currentNumber });
    setTimeout(incrementNumber, 1000);
  }
  // Start incrementing
  incrementNumber();
})();
