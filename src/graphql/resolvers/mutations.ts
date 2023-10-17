import { getCurrentDate } from '../../utils/getCurrentDate';
import { pubsub } from './subscriptions'
import mongoose from 'mongoose';
import Owner from '../../models/owner';
import User from '../../models/user';
import { queries } from './queries';
import bcrypt from 'bcryptjs';
import { tokenService } from './token/index';
import { AUTHENTICATION_ERROR } from '../../errors/appErrors';

export const mutations = {
  login: async (parent, { input }) => {
    const userEntity = await User.findOne({ email: input.email });
    if (!userEntity) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(input.password, userEntity.password);
    if (!isEqual) {
      throw new AUTHENTICATION_ERROR('Password is incorrect!');
    }

    const tokens = await tokenService.getTokens(userEntity._id);
    return { ...tokens, userId: userEntity.id, tokenExpiration: 1 };
  },
  // OWNERS
  // add owner
  createOwner: (parent, { input }) => {
    const currentDate = getCurrentDate();

    const owner = new Owner({
      _id: new mongoose.Types.ObjectId(),
      name: input.name,
      adress: input.adress,
      phones: input.phones,
      photos: input.photos,
      audios: input.audios,
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
        console.log('result = ', result);
        console.log(result._id);

        // send event that owners list has been updated
        const allOwners = await queries.getAllOwners();
        await pubsub.publish('OWNERS_UPDATED', {
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
    const updateOps = {};
    const currentDate = getCurrentDate();
    for (const ops of Object.keys(input)) {
      updateOps[ops] = input[ops];
    }

    // set update date
    updateOps['dateUpdated'] = currentDate;
    return Owner.updateOne(
      { _id: input.id },
      {
        $set: updateOps,
      }
    )
      .exec()
      .then(async (doc) => {
        console.log('From database', doc);
        if (doc) {
          // send event that owners list has been updated
          const allOwners = await queries.getAllOwners();
          await pubsub.publish('OWNERS_UPDATED', {
            newOwnersList: allOwners,
          });

          return {
            id: input.id,
            ...doc,
          };
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
  deleteOwner: (parent, { id }) => {
    return Owner.deleteOne({ _id: id })
      .exec()
      .then(async (doc) => {
        console.log('From database', doc);
        if (doc) {
          // берем новый список владельцев
          const allOwners = await queries.getAllOwners();
          await pubsub.publish('OWNERS_UPDATED', {
            newOwnersList: allOwners,
          });

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

  // USERS
  createUser: async (parent, { input }) => {
    try {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(input.password, 12);

      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: input.email,
        fio: input.fio,
        phone: input.phone,
        idAddedOwnersHim: [],
        password: hashedPassword,
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  // add ownerId to user
  addOwnerIdToUser: async (parent, { ownerId, userId }) => {
    const user = await queries.getUser(userId);
    if (user.hasOwnProperty('error')) {
      return { error: 'Something is wrong' };
    } else if (user.hasOwnProperty('message')) {
      return { message: 'No valid entry found for provided ID' };
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
