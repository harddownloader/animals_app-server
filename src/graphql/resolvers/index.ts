import { queries } from "./queries";
import { mutations } from "./mutations";
import { subscriptions } from "./subscriptions";

export const resolvers = {
  Query: queries,
  Mutation: mutations,
  Subscription: subscriptions,
};
