// import express from 'express';
// import bodyParser from 'body-parser';
// import { ApolloServer, gql }  from 'apollo-server-express';
// import { createServer } from 'http';
// import { execute, subscribe } from 'graphql';
// import { PubSub } from 'graphql-subscriptions';
// import { SubscriptionServer } from 'subscriptions-transport-ws';
// import { myGraphQLSchema } from './my-schema';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlExpress,
  graphiqlExpress, }  = require('apollo-server-express');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { schema } = require('./graphql/schema');

const PORT = 3000;
const server = express();

server.use('*', cors({ origin: `http://localhost:${PORT}` }));

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
}));

// Wrap the Express server
const ws = createServer(server);
ws.listen(PORT, () => {
  console.log(`Apollo Server is now running on http://localhost:${PORT}`);
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});