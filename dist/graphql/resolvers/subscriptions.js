"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptions = exports.pubsub = void 0;
const graphql_subscriptions_1 = require("graphql-subscriptions");
exports.pubsub = new graphql_subscriptions_1.PubSub();
exports.subscriptions = {
    // сокеты для отправки нового списка владельцев
    newOwnersList: {
        subscribe: () => exports.pubsub.asyncIterator(['OWNERS_UPDATED']),
    },
};
