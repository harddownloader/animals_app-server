const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  adress: String,
  phones: mongoose.Schema.Types.Mixed,
  photos: mongoose.Schema.Types.Mixed,
  audios: mongoose.Schema.Types.Mixed,
  history: String,
  whoGave: String,
  ktoDalTel: String,
  jivoder: Boolean,
  dateCreated: String,
  dateUpdated: String,
});

export default mongoose.model('Owner', ownerSchema);
