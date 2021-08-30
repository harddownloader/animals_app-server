const root = {
  // USERS
  // get all users
  getAllUsers: () => {
    return User.find()
      .exec()
      .then((docs) => {
        console.log('getAllUsers', docs);
        return docs;
      })
      .catch((err) => {
        console.log('getAllUsers error: ', err);
        return { error: err };
      });
  },
  // get user by id
  getUser: ({ id }) => {
    return User.findById(id)
      .exec()
      .then((doc) => {
        console.log('From database', doc);
        if (doc) {
          return doc;
        } else {
          return { message: 'No valid entry found for provided ID' };
        }
      })
      .catch((err) => {
        console.log(err);
        return { error: err };
      });
  },
  addOwnerToUsersOwnersList({ userId, ownerId }) {
    // get user information
    // check ownerId in list
    // если нету, то пушим и слхраняем

    return;
  },
  deleteOwnerToUsersOwnersList({ userId, ownerId }) {
    // берем юзера
    // проверяем есть ли в его списке владелец с таким индификатором
    // если есть, то удаляем и сохраняем
    return;
  },

  // OWNERS
  // get all owners
  getAllOwners: () => {
    return Owner.find()
      .exec()
      .then((docs) => {
        console.log('getAllOwners', docs);
        return docs;
      })
      .catch((err) => {
        console.log('getAllOwners error: ', err);
        return { error: err };
      });
  },
  // get owner by id
  getOwner: ({ id }) => {
    return Owner.findById(id)
      .exec()
      .then((doc) => {
        console.log('From database', doc);
        if (doc) {
          return doc;
        } else {
          return { message: 'No valid entry found for provided ID' };
        }
      })
      .catch((err) => {
        console.log(err);
        return { error: err };
      });
  },
  // upload owners from backup file
  upOwnersByBackup: () => {
    for (let i = 0; i < ownersFromBackup.length; i++) {
      const item = ownersFromBackup[i];
      // if(i > 0) return 'first return'
      const owner = new Owner({
        _id: new mongoose.Types.ObjectId(),
        name: item.name,
        adress: item.adress,
        phones: item.phone,
        photoOwnerImage: item.photoOwnerImage,
        photoPasportImage: item.photoPasportImage,
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

    return {
      status: 'loading owners from backup complete!',
    };
  },
  // add owner
  createOwner: ({ input }) => {
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
      .then((result) => {
        console.log('result = ', result);
        console.log(result._id);
        // return { ...result._doc };
        return result;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  // update owner fields
  updateOwner: ({ input }) => {
    const updateOps = {};
    for (const ops of Object.keys(input)) {
      updateOps[ops] = input[ops];
    }
    console.log('updateOps', updateOps);
    // return false
    return Owner.updateOne(
      { _id: input.id },
      {
        $set: updateOps,
      }
    )
      .exec()
      .then((doc) => {
        console.log('From database', doc);
        if (doc) {
          return doc;
        } else {
          return { message: 'No valid entry found for provided ID' };
        }
      })
      .catch((err) => {
        console.log(err);
        return { error: err };
      });
  },
  // delete owner
  deleteOwner: ({ id }) => {
    return Owner.remove({ _id: id })
      .exec()
      .then((doc) => {
        console.log('From database', doc);
        if (doc) {
          return doc;
        } else {
          return { message: 'No valid entry found for provided ID' };
        }
      })
      .catch((err) => {
        console.log(err);
        return { error: err };
      });
  },
};
