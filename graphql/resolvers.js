const { PubSub, withFilter } = require("graphql-subscriptions");
const Owner = require("../models/owner");
const User = require("../models/user");
const mongoose = require("mongoose");
const getCurrentDate = require("../utils/getCurrentDate");
const ownersFromBackup = require("../ownersBackUp.json");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    // upload owners from backup file
    upOwnersByBackup() {
      for (let i = 0; i < ownersFromBackup.length; i++) {
        const item = ownersFromBackup[i];
        // if(i > 0) return 'first return'
        const owner = new Owner({
          _id: new mongoose.Types.ObjectId(),
          name: item.name,
          adress: item.adress,
          phones: item.phone,
          pasportPhoto: item.pasportPhoto,
          photo: item.photo,
          car: item.car,
          history: item.history,
          whoGave: item.whoGave,
          ktoDalTel: item.ktoDalTel,
          jivoder: item.jivoder,
        });
        owner
          .save()
          .then((result) => {
            console.log(result);
            return result;
          })
          .catch((err) => {
            console.log(err);
            // throw err;
          });
      }

      return "loading owners from backup complete!";
    },
    // USERS
    // get all users
    getAllUsers: () => {
      // return [{id: 'privet omlet'}]
      return User.find()
        .exec()
        .then((docs) => {
          console.log("getAllUsers", docs);
          return docs;
        })
        .catch((err) => {
          console.log("getAllUsers error: ", err);
          return { error: err };
        });
    },
    // get user by id
    getUser: ({ id }) => {
      return User.findById(id)
        .exec()
        .then((doc) => {
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

    // OWNERS
    // get all owners
    getAllOwners: () => {
      return Owner.find()
        .exec()
        .then((docs) => {
          // console.log("getAllOwners", docs);
          console.log("getAllOwners is ok!");
          return docs;
        })
        .catch((err) => {
          console.log("getAllOwners error: ", err);
          return { error: err };
        });
    },
    // get owner by id
    getOwner: ({ id }) => {
      return Owner.findById(id)
        .exec()
        .then((doc) => {
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
  },
  Mutation: {
    // OWNERS
    // add owner
    createOwner: (parent, { input }) => {
      // console.log('createOwner', input)
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
          const allOwners = await resolvers.Query.getAllOwners();
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
      // console.log('updateOwner', input)
      // return input
      const updateOps = {};
      // console.log('input', input)
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
            const allOwners = await resolvers.Query.getAllOwners();
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
    // delete owner
    deleteOwner: (parent, { id }) => {
      return Owner.deleteOne({ _id: id })
        .exec()
        .then(async (doc) => {
          console.log("From database", doc);
          if (doc) {
            // берем новый список владельцев
            const allOwners = await resolvers.Query.getAllOwners();
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
      const user = await resolvers.Query.getUser(userId);
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
  },
  Subscription: {
    // сокеты для отправки нового списка владельцев
    newOwnersList: {
      subscribe: () => pubsub.asyncIterator(["OWNERS_UPDATED"]),
    },
  },
};

module.exports = resolvers;
