import Owner from '../../models/owner';
import User from '../../models/user';

import { tokenService } from './token/index';

export const queries = {
  ...tokenService,
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

  // OWNERS
  // get all owners
  getAllOwners: () => {
    console.log('getAllOwners')
    // queries.upOwnersByBackup()
    // return fire.db.collection('owners')
    //   .get()
    //   .then((querySnapshot: { docs: any[] }) => {
    //     const owners_list = querySnapshot.docs.map((owner: {
    //       data: () => any
    //       id: any
    //     }) => {
    //       // добавляем к объекту его id в firebase
    //       const ownerDataWithId = owner.data()
    //       ownerDataWithId.id = owner.id
    //       // вращаем объект владельца с его id firebase
    //       console.log({ownerDataWithId})
    //       const photos = []
    //       if (ownerDataWithId.pasportPhoto) photos.push(ownerDataWithId.pasportPhoto)
    //       if (ownerDataWithId.photo) photos.push(ownerDataWithId.photo)

    //       return {
    //         id: ownerDataWithId.id,
    //         name: ownerDataWithId.name,
    //         adress: ownerDataWithId.adress,
    //         phones: ownerDataWithId.phone,
    //         photos: photos,
    //         history: `${ownerDataWithId.history} ${ownerDataWithId.car}`,
    //         whoGave: ownerDataWithId.whoGave,
    //         ktoDalTel: ownerDataWithId.ktoDalTel,
    //         jivoder: ownerDataWithId.jivoder,
    //         dateCreated: ownerDataWithId.dateCreated,
    //         dateUpdated: ownerDataWithId.dateUpdated
    //       }
    //     })
    //     // do something with documents
    //     return owners_list
    //   })
    //   .catch((error: any) => {
    //     console.log(error)
    //     return { error: error };
    //   })
    return (
      Owner.find()
        // сортируем список по созданным, т.е. самые новые
        .sort({ _id: -1 })
        .exec()
        .then((docs) => {
          console.log('getAllOwners is ok!');
          return docs;
        })
        .catch((err) => {
          console.log('getAllOwners error: ', err);
          return { error: err };
        })
    );
  },
    // getAllOwnersByRange: () => {
    //     const allPlayers = [];
    //
    //     const cursor = Owner.find({}).lean().cursor();
    //     cursor.on('data', function(player) { allPlayers.push(player); });
    //     cursor.on('end', function() { console.log('All players are loaded here'); });
    // },
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
};
