"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
const getCurrentDate_1 = require("../../utils/getCurrentDate");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub = new graphql_subscriptions_1.PubSub();
const mongoose_1 = __importDefault(require("mongoose"));
const owner_1 = __importDefault(require("../../models/owner"));
const user_1 = __importDefault(require("../../models/user"));
const queries_1 = require("./queries");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import jwt from 'jsonwebtoken';
const index_1 = require("./token/index");
const appErrors_1 = require("../../errors/appErrors");
exports.mutations = {
    login: (parent, { input }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('login', input);
        // return { userId: 'efefefefe', token: 'token', tokenExpiration: 1 };
        const userEntity = yield user_1.default.findOne({ email: input.email });
        if (!userEntity) {
            throw new Error('User does not exist!');
        }
        const isEqual = yield bcryptjs_1.default.compare(input.password, userEntity.password);
        if (!isEqual) {
            // throw new Error('Password is incorrect!');
            throw new appErrors_1.AUTHENTICATION_ERROR();
        }
        // const token = jwt.sign(
        //   { userId: user.id, email: user.email },
        //   process.env.JWT_SECRET_KEY,
        //   {
        //     expiresIn: '1h',
        //   }
        // );
        const tokens = yield index_1.tokenService.getTokens(userEntity._id);
        return Object.assign(Object.assign({}, tokens), { userId: userEntity.id, tokenExpiration: 1 });
    }),
    // OWNERS
    // add owner
    createOwner: (parent, { input }) => {
        const currentDate = (0, getCurrentDate_1.getCurrentDate)();
        const owner = new owner_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
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
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('result = ', result);
            console.log(result._id);
            // берем новый список владельцев
            const allOwners = yield queries_1.queries.getAllOwners();
            yield pubsub.publish('OWNERS_UPDATED', {
                newOwnersList: allOwners,
            });
            return result;
        }))
            .catch((err) => {
            console.log(err);
            throw err;
        });
    },
    // update owner fields
    updateOwner: (parent, { input }) => {
        // return input
        const updateOps = {};
        const currentDate = (0, getCurrentDate_1.getCurrentDate)();
        for (const ops of Object.keys(input)) {
            updateOps[ops] = input[ops];
        }
        // set update date
        updateOps['dateUpdated'] = currentDate;
        console.log('updateOps', updateOps);
        // return false
        return owner_1.default.updateOne({ _id: input.id }, {
            $set: updateOps,
        })
            .exec()
            .then((doc) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('From database', doc);
            if (doc) {
                // берем новый список владельцев
                const allOwners = yield queries_1.queries.getAllOwners();
                yield pubsub.publish('OWNERS_UPDATED', {
                    newOwnersList: allOwners,
                });
                return Object.assign({ id: input.id }, doc);
            }
            else {
                return { message: 'No valid entry found for provided ID' };
            }
        }))
            .catch((err) => {
            console.log(err);
            return { error: err };
        });
    },
    // delete owner
    deleteOwner: (parent, { id }) => {
        return owner_1.default.deleteOne({ _id: id })
            .exec()
            .then((doc) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('From database', doc);
            if (doc) {
                // берем новый список владельцев
                const allOwners = yield queries_1.queries.getAllOwners();
                yield pubsub.publish('OWNERS_UPDATED', {
                    newOwnersList: allOwners,
                });
                return doc;
            }
            else {
                return { message: 'No valid entry found for provided ID' };
            }
        }))
            .catch((err) => {
            console.log(err);
            return { error: err };
        });
    },
    // USERS
    createUser: (parent, { input }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const existingUser = yield user_1.default.findOne({ email: input.email });
            if (existingUser) {
                throw new Error('User exists already.');
            }
            const hashedPassword = yield bcryptjs_1.default.hash(input.password, 12);
            const user = new user_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                email: input.email,
                fio: input.fio,
                phone: input.phone,
                idAddedOwnersHim: [],
                password: hashedPassword,
            });
            const result = yield user.save();
            return Object.assign(Object.assign({}, result._doc), { password: null, _id: result.id });
        }
        catch (err) {
            throw err;
        }
    }),
    // add ownerId to user
    addOwnerIdToUser: (parent, { ownerId, userId }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield queries_1.queries.getUser(userId);
        if (user.hasOwnProperty('error')) {
            return { error: 'Something is wrong' };
        }
        else if (user.hasOwnProperty('message')) {
            return { message: 'No valid entry found for provided ID' };
        }
        user.idAddedOwnersHim.push(ownerId);
        return user_1.default.updateOne({ _id: userId }, {
            $set: user,
        })
            .exec()
            .then((doc) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('From database', doc);
            if (doc) {
                return doc;
            }
            else {
                return { message: 'No valid entry found for provided ID' };
            }
        }))
            .catch((err) => {
            console.log(err);
            return { error: err };
        });
    }),
};
