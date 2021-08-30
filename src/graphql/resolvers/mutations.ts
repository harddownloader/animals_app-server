import { getCurrentDate } from "../../utils/getCurrentDate";
import { PubSub } from "graphql-subscriptions";
const pubsub = new PubSub();
import mongoose from "mongoose";
import Owner from "../../models/owner";
import User from "../../models/user";
import { queries } from "./queries";

export const mutations = {
  // OWNERS
  // add owner
  createOwner: (parent, { input }) => {
    const currentDate = getCurrentDate();

    const owner = new Owner({
      _id: new mongoose.Types.ObjectId(),
      name: input.name,
      adress: input.adress,
      phones: input.phones,
      photoOwnerImage: input.photoOwnerImage,
      photoPasportImage: input.photoPasportImage,
      car: input.car,
      history: input.history,
      whoGave: input.whoGave,
      ktoDalTel: input.ktoDalTel,
      jivoder: input.jivoder,
      dateCreated: currentDate,
      dateUpdated: currentDate,
    });

    return owner
      .save()
      .then(async (result) => {
        console.log("result = ", result);
        console.log(result._id);

        // берем новый список владельцев
        const allOwners = await queries.getAllOwners();
        await pubsub.publish("OWNERS_UPDATED", {
          newOwnersList: allOwners,
        });

        return result;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  // update owner fields
  updateOwner: (parent, { input }) => {
    // return input
    const updateOps = {};
    const currentDate = getCurrentDate();
    for (const ops of Object.keys(input)) {
      updateOps[ops] = input[ops];
    }
    // set update date
    updateOps["dateUpdated"] = currentDate;
    console.log("updateOps", updateOps);
    // return false
    return Owner.updateOne(
      { _id: input.id },
      {
        $set: updateOps,
      }
    )
      .exec()
      .then(async (doc) => {
        console.log("From database", doc);
        if (doc) {
          // берем новый список владельцев
          const allOwners = await queries.getAllOwners();
          await pubsub.publish("OWNERS_UPDATED", {
            newOwnersList: allOwners,
          });

          return {
            id: input.id,
            ...doc,
          };
        } else {
          return { message: "No valid entry found for provided ID" };
        }
      })
      .catch((err) => {
        console.log(err);
        return { error: err };
      });
  },
  // delete owner
  deleteOwner: (parent, { id }) => {
    return Owner.deleteOne({ _id: id })
      .exec()
      .then(async (doc) => {
        console.log("From database", doc);
        if (doc) {
          // берем новый список владельцев
          const allOwners = await queries.getAllOwners();
          await pubsub.publish("OWNERS_UPDATED", {
            newOwnersList: allOwners,
          });

          return doc;
        } else {
          return { message: "No valid entry found for provided ID" };
        }
      })
      .catch((err) => {
        console.log(err);
        return { error: err };
      });
  },

  // USERS
  // add ownerId to user
  addOwnerIdToUser: async (parent, { ownerId, userId }) => {
    const user = await queries.getUser(userId);
    if (user.hasOwnProperty("error")) {
      return { error: "Something is wrong" };
    } else if (user.hasOwnProperty("message")) {
      return { message: "No valid entry found for provided ID" };
    }
    user.idAddedOwnersHim.push(ownerId);
    return User.updateOne(
      { _id: userId },
      {
        $set: user,
      }
    )
      .exec()
      .then(async (doc) => {
        console.log("From database", doc);
        if (doc) {
          return doc;
        } else {
          return { message: "No valid entry found for provided ID" };
        }
      })
      .catch((err) => {
        console.log(err);
        return { error: err };
      });
  },
};
