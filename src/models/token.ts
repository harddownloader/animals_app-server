import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Token = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    tokenId: { type: String, required: true },
    expire: { type: Number, required: true },
  },
  { collection: 'tokens' }
);

Token.index({ userId: 1 }, { unique: true });

export default mongoose.model('tokens', Token);
