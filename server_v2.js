const express = require('express');
const { execute, subscribe }  = require('graphql');
const { ApolloServer, gql } = require('apollo-server-express');
const http = require("http");
const { PubSub, withFilter } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
// const { myGraphQLSchema } = require('./graphql_old/schema');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
  type Comment {
    id: String
    content: String
  }

  type Subscription {
    commentAdded(repoFullName: String!): Comment
  }

  schema {
    query: Query
    # mutation: Mutation
    subscription: Subscription
  }
`;



// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
  // Mutation: () => {

  // },
  Subscription: {
    commentAdded: {
      subscribe: () => pubsub.asyncIterator('commentAdded')
    }
  },
};


const app = express();

async function startServer() {
  apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}
startServer();

const pubsub = new PubSub();
const httpserver = http.createServer(app);


// code pushing event handlers

const sleep = (t = 1000) => new Promise((res) => setTimeout(res, t));

const payload = {
  commentAdded: {
      id: '1',
      content: 'Hello!',
  }
};

sleep(pubsub.publish('commentAdded', payload));

// /code pushind event

app.get("/rest", function (req, res) {
  res.json({ data: "api working" });
});

app.listen(3033, function () {
  new SubscriptionServer({
    execute,
    subscribe,
    schema: typeDefs,
  }, {
    server: httpserver,
    path: '/subscriptions',
  });
    console.log(`server running on port 4000`);
    // console.log(`gql path is ${apolloServer.graphqlPath}`);
    console.log(`gql path is`);
});