"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const ownerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    adress: String,
    phones: mongoose.Schema.Types.Mixed,
    photoOwnerImage: String,
    photoPasportImage: String,
    car: String,
    history: String,
    whoGave: String,
    ktoDalTel: String,
    jivoder: Boolean,
    dateCreated: String,
    dateUpdated: String,
});
exports.default = mongoose.model("Owner", ownerSchema);
