import { getCurrentDate } from "../../utils/getCurrentDate";
import ownersFromBackup from "../../ownersBackUp.json";
import mongoose from "mongoose";
import Owner from "../../models/owner";
import User from "../../models/user";

export const queries = {
  // upload owners from backup file
  upOwnersByBackup() {
    const currentDate = getCurrentDate();

    for (let i = 0; i < ownersFromBackup.length; i++) {
      const item = ownersFromBackup[i];
      // if(i > 0) return 'first return'
      const owner = new Owner({
        _id: new mongoose.Types.ObjectId(),
        name: item.name,
        adress: item.adress,
        phones: item.phone,
        photoOwnerImage: item.photo,
        photoPasportImage: item.pasportPhoto,
        car: item.car,
        history: item.history,
        whoGave: item.whoGave,
        ktoDalTel: item.ktoDalTel,
        jivoder: item.warn,
        dateCreated: currentDate,
        dateUpdated: currentDate,
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
    return (
      Owner.find()
        // сортируем список по созданным, т.е. самые новые
        .sort({ _id: -1 })
        .exec()
        .then((docs) => {
          console.log("getAllOwners is ok!");
          return docs;
        })
        .catch((err) => {
          console.log("getAllOwners error: ", err);
          return { error: err };
        })
    );
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
};
