const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fio: String,
  email: String,
  idAddedOwnersHim: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('User', userSchema);