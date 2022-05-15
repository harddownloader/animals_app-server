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
