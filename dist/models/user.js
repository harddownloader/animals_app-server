"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fio: String,
    email: String,
    phone: String,
    password: String,
    idAddedOwnersHim: mongoose.Schema.Types.Mixed,
});
exports.default = mongoose.model('User', userSchema);
