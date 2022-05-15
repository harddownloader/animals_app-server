import Token from '../../../models/token';
import { AUTHENTICATION_ERROR } from '../../../errors/appErrors';

const get = async (userId, tokenId) => {
  const token = await Token.findOne({ userId, tokenId });
  if (!token) {
    throw new AUTHENTICATION_ERROR('Token is not found!');
  }

  return token;
};

const upsert = async (token) =>
  Token.findOneAndUpdate(
    { userId: token.userId },
    { $set: token },
    { upsert: true, new: true }
  );

export default { get, upsert };
