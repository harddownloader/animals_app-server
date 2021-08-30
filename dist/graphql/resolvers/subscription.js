const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const subscriptions = {
    // сокеты для отправки нового списка владельцев
    newOwnersList: {
        subscribe: () => pubsub.asyncIterator(["OWNERS_UPDATED"]),
    },
};
export subscriptions;
