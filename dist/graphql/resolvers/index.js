"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const queries_1 = require("./queries");
const mutations_1 = require("./mutations");
const subscriptions_1 = require("./subscriptions");
exports.resolvers = {
    Query: queries_1.queries,
    Mutation: mutations_1.mutations,
    Subscription: subscriptions_1.subscriptions,
};
