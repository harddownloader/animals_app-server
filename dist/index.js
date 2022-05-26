"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-check
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
// graphql + apollo
const graphql_1 = require("graphql");
const apollo_server_express_1 = require("apollo-server-express");
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const schema_1 = require("@graphql-tools/schema");
const index_1 = require("./graphql/schema/index");
const index_2 = require("./graphql/resolvers/index");
const is_auth_1 = __importDefault(require("./middleware/is-auth"));
// config
const config_1 = require("./common/config");
const morgan_1 = __importDefault(require("morgan"));
const logging_1 = require("./common/logging");
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
mongoose_1.default
    .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use(is_auth_1.default);
    app.use((0, morgan_1.default)(':method :status :url :userId size req :req[content-length] res :res[content-length] - :response-time ms', {
        stream: logging_1.stream,
    }));
    const httpServer = (0, http_1.createServer)(app);
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
    const schema = (0, schema_1.makeExecutableSchema)({ typeDefs: index_1.typeDefs, resolvers: index_2.resolvers });
    const server = new apollo_server_express_1.ApolloServer({
        schema,
    });
    yield server.start();
    server.applyMiddleware({ app });
    subscriptions_transport_ws_1.SubscriptionServer.create({ schema, execute: graphql_1.execute, subscribe: graphql_1.subscribe }, { server: httpServer, path: server.graphqlPath });
    httpServer.listen(config_1.PORT, () => {
        console.log(`🚀 Query endpoint ready at http://localhost:${config_1.PORT}${server.graphqlPath}`);
        console.log(`🚀 Subscription endpoint ready at ws://localhost:${config_1.PORT}${server.graphqlPath}`);
    });
}))();
