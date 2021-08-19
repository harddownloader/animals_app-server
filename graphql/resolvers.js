// src/resolvers.js
const { PubSub, withFilter } = require("graphql-subscriptions");
const Owner = require("../models/owner");
const User = require("../models/user");
const mongoose = require("mongoose");
const ownersFromBackup = require("../ownersBackUp.json");

const pubsub = new PubSub(); //create a PubSub instance
// const CHANNEL_ADDED_TOPIC = "newChannel";
const resolvers = {
  Query: {
    currentNumber() {
      return currentNumber;
    },
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

      return "loading owners from backup complete!"
    },
    async createOwnerQuery() {
      const newUser = {
        id: 'idshnik',
        name: 'idshnik',
        adress: 'idshnik',
        photoOwnerImage: '',
        photoPasportImage: '',
        phones: [],
        car: 'car',
        history: 'history',
        whoGave: 'whoGave',
        ktoDalTel: 'ktoDalTel',
        jivoder: false
      }
      const allOwners = await this.getAllOwners()
      const newOwnersList = allOwners.concat(newUser)
      await pubsub.publish('OWNERS_UPDATED', {
        newOwnersList
      });
      
      return newUser
      
    },
    addOwnerEvent() {
      // const payload = {
      //   commentAdded: {
      //     id: 'addedID', 
      //     name: 'new name' ,
      //     adress: 'adress',
      //     photoOwnerImage: '',
      //     photoPasportImage: '',
      //     phones: [],
      //     car: 'car',
      //     history: 'history',
      //     whoGave: 'whoGave',
      //     ktoDalTel: 'ktoDalTel',
      //     jivoder: false
      //   }
      // }
      // pubsub.publish("commentAdded", payload);

      pubsub.publish('POST_CREATED', {
        postCreated: {
          name: 'Ali Baba',
          adress: 'Open sesame'
        }
      });
      
      return {
        name: 'Ali Baba',
        adress: 'Open sesame'
      }
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
          console.log("getAllOwners is ok!")
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
    
    // add owner
    createOwner: (parent, {input}) => {
      // console.log('createOwner', input)
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
      });

      return owner
        .save()
        .then( async(result) => {
          console.log("result = ", result);
          console.log(result._id);

          // берем новый список владельцев
          const allOwners = await resolvers.Query.getAllOwners()
          await pubsub.publish('OWNERS_UPDATED', {
            newOwnersList: allOwners
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
      for (const ops of Object.keys(input)) {
        updateOps[ops] = input[ops];
      }
      console.log("updateOps", updateOps);
      // return false
      return Owner.updateOne(
        { _id: input.id },
        {
          $set: updateOps,
        }
      )
        .exec()
        .then( async(doc) => {
          console.log("From database", doc);
          if (doc) {

            // берем новый список владельцев
            const allOwners = await resolvers.Query.getAllOwners()
            await pubsub.publish('OWNERS_UPDATED', {
              newOwnersList: allOwners
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
        .then( async(doc) => {
          console.log("From database", doc);
          if (doc) {

            // берем новый список владельцев
            const allOwners = await resolvers.Query.getAllOwners()
            await pubsub.publish('OWNERS_UPDATED', {
              newOwnersList: allOwners
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
  },
  Subscription: {
    numberIncremented: {
      subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"]),
    },
    postCreated: {
      subscribe: () => {
        console.log('commentAdded before');
        return pubsub.asyncIterator(["POST_CREATED"])
      },
    //   subscribe: withFilter(() => pubsub.asyncIterator('commentAdded'), (payload, variables) => {
    //     return payload.commentAdded.repository_name === variables.repoFullName;
    //  }),
    },
    newOwnersList: {
      subscribe: () => pubsub.asyncIterator(["OWNERS_UPDATED"])
    }
  },
};

let currentNumber = 0;
  function incrementNumber() {
    currentNumber++;
    pubsub.publish("NUMBER_INCREMENTED", { numberIncremented: currentNumber });
    setTimeout(incrementNumber, 1000);
  }
  // Start incrementing
  incrementNumber();

module.exports = resolvers