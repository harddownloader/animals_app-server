"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptions = void 0;
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub = new graphql_subscriptions_1.PubSub();
exports.subscriptions = {
    // сокеты для отправки нового списка владельцев
    newOwnersList: {
        subscribe: () => pubsub.asyncIterator(['OWNERS_UPDATED']),
    },
};
