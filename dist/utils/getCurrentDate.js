"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDate = void 0;
const getCurrentDate = () => {
    const today = new Date();
    const date = today.getFullYear() +
        '-' +
        ('0' + (today.getMonth() + 1)).slice(-2) +
        '-' +
        today.getDate();
    const time = today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
    return date + '-' + time;
};
exports.getCurrentDate = getCurrentDate;
