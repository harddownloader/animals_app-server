// src/resolvers.js
import { PubSub } from 'graphql-subscriptions';
// ...
const pubsub = new PubSub(); //create a PubSub instance
const CHANNEL_ADDED_TOPIC = 'newChannel';
export const resolvers = {
// ...
Mutation: {
    addChannel: (root, args) => {  //Create a mutation to add a new channel.
      const newChannel = { id: String(nextId++), messages: [], name: args.name };
      channels.push(newChannel);
      pubsub.publish(CHANNEL_ADDED_TOPIC, { channelAdded: newChannel });  // publish to a topic
      return newChannel;
    }
  },
  Subscription: {
    channelAdded: {  // create a channelAdded subscription resolver function.
      subscribe: () => pubsub.asyncIterator(CHANNEL_ADDED_TOPIC)  // subscribe to changes in a topic
    }
  }
}