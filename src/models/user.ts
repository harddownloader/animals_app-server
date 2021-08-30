const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fio: String,
  email: String,
  idAddedOwnersHim: mongoose.Schema.Types.Mixed,
});

export default mongoose.model('User', userSchema);
