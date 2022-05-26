// @ts-check
import express from 'express';
require('dotenv').config();
import mongoose from 'mongoose';
import { createServer } from 'http';
// graphql + apollo
import { execute, subscribe } from 'graphql';
import { ApolloServer } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './graphql/schema/index';
import { resolvers } from './graphql/resolvers/index';
import isAuth from './middleware/is-auth';
// config
import { PORT } from './common/config';
import morgan from 'morgan';
import { stream } from './common/logging';

// session
// const uuid = require('uuid/v4')
import session from 'express-session';
// const cookieParser = require("cookie-parser");
// const csrf = require("csurf");

// add & configure middleware
// app.use(session({
//   genid: (req) => {
//     console.log('Inside the session middleware')
//     console.log(req.sessionID)
//     return uuid() // use UUIDs for session IDs
//   },
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true
// }))

// mongoose
mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

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
  const httpServer = createServer(app);

  app.get('/rest', function (req, res) {
    return res.json({ data: 'rest' });
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
})();
