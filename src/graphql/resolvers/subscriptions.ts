import { PubSub } from 'graphql-subscriptions';
export const pubsub = new PubSub();

export const subscriptions = {
  // сокеты для отправки нового списка владельцев
  newOwnersList: {
    subscribe: () => pubsub.asyncIterator(['OWNERS_UPDATED']),
  },
};
