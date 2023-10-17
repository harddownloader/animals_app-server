import express from 'express';
require('dotenv').config();
import mongoose, { ConnectOptions } from 'mongoose';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from "helmet";

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './graphql/schema/index';
import { resolvers } from './graphql/resolvers/index';
import isAuth from './middleware/is-auth';

// config
import {
  DB_HOST,
  GRAPHQL_PATH,
  NODE_ENV,
  PORT
} from './common/config';
import morgan from 'morgan';
import { stream } from './common/logging';


// mongoose
mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // poolSize: parseInt(process.env.POOL_SIZE!),
  } as ConnectOptions)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('mongoose.connect error: ', err));

(async () => {
  const app = express();
  app.use(isAuth);
  app.use(
    morgan(
      ':method :status :url :userId size req :req[content-length] res :res[content-length] - :response-time ms',
      {
        stream: stream,
      }
    )
  );
  app.use(helmet());

  const httpServer = createServer(app);

  app.get('/', function (req, res) {
    return res.json({ text: 'api is running' });
  });

  const schema = makeExecutableSchema({
    typeDefs, resolvers
  });

  const wsServer = new WebSocketServer({
      server: httpServer,
      path: GRAPHQL_PATH,
  });

  useServer({
    schema,
    onConnect: async (ctx) => {
      if (NODE_ENV !== "production") console.info('Client connected');
    },
    onDisconnect: () => {
      if (NODE_ENV !== "production") console.info('Client disconnected');
    },
  }, wsServer);
    // console.log({server})

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await apolloServer.start();

  app.use(
    cors(),
    bodyParser.json(),
  );

  app.use(
    GRAPHQL_PATH,
    expressMiddleware(apolloServer, {
      // context: async ({ req }) => {
      //   const context: IContext = {
      //     ...req.context,
      //   };
      //
      //   const graphqlContext: IGraphQLContext = {
      //     ...context,
      //     loaders: initLoaders({ ...context }),
      //   };
      //
      //   return graphqlContext;
      // },
    }),
  );

  httpServer.listen(PORT, () => {
    console.log({wsServer})
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${GRAPHQL_PATH}`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}${wsServer.options.path}`
    );
  });
})();
