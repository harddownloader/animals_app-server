import { PubSub } from 'graphql-subscriptions';
export const pubsub = new PubSub();

export const subscriptions = {
  // wss to send updated list of owners
  newOwnersList: {
    subscribe: () => pubsub.asyncIterator(['OWNERS_UPDATED']),
  },
};
