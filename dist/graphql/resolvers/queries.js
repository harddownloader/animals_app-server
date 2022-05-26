"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
const getCurrentDate_1 = require("../../utils/getCurrentDate");
const ownersBackUp_json_1 = __importDefault(require("../../ownersBackUp.json"));
const mongoose_1 = __importDefault(require("mongoose"));
const owner_1 = __importDefault(require("../../models/owner"));
const user_1 = __importDefault(require("../../models/user"));
const index_1 = require("./token/index");
exports.queries = Object.assign(Object.assign({}, index_1.tokenService), { 
    // upload owners from backup file
    upOwnersByBackup() {
        const currentDate = (0, getCurrentDate_1.getCurrentDate)();
        for (let i = 0; i < ownersBackUp_json_1.default.length; i++) {
            const item = ownersBackUp_json_1.default[i];
            // if(i > 0) return 'first return'
            const owner = new owner_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                name: item.name,
                adress: item.adress,
                phones: item.phones,
                // photos: [item.photoOwnerImage, item.photoPasportImage],
                photos: item.photos
                // photoPasportImage: item.pasportPhoto,
                // car: item.car,
                ,
                // photoPasportImage: item.pasportPhoto,
                // car: item.car,
                audios: [],
                // history: `${item.history} ${item.car}`,
                history: item.history,
                whoGave: item.whoGave,
                ktoDalTel: item.ktoDalTel,
                jivoder: item.jivoder,
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
        return 'loading owners from backup complete!';
    }, 
    // USERS
    // get all users
    getAllUsers: () => {
        // return [{id: 'privet omlet'}]
        return user_1.default.find()
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
        return user_1.default.findById(id)
            .exec()
            .then((doc) => {
            console.log('From database', doc);
            if (doc) {
                return doc;
            }
            else {
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
        console.log('getAllOwners');
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
        return (owner_1.default.find()
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
        }));
    }, 
    // get owner by id
    getOwner: ({ id }) => {
        return owner_1.default.findById(id)
            .exec()
            .then((doc) => {
            console.log('From database', doc);
            if (doc) {
                return doc;
            }
            else {
                return { message: 'No valid entry found for provided ID' };
            }
        })
            .catch((err) => {
            console.log(err);
            return { error: err };
        });
    } });
