import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
export const AUTH_MODE = process.env.AUTH_MODE === 'true';
export const MAX_SYMBOLS_PER_OBJECT = 10000;
export const MAX_OPTIONAL_PROPERTIES = 100;
export const MIN_PASSWORD_LENGTH = 8;
export const LOGS_DIR = path.join(__dirname, '../../logs');
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_EXPIRE_TIME = '4h';
export const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
export const JWT_REFRESH_EXPIRE_TIME = 4.5 * 60 * 60;

// export default {
//   PORT: process.env.PORT,
//   NODE_ENV: process.env.NODE_ENV,
//   MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
//   AUTH_MODE: process.env.AUTH_MODE === 'true',
//   MAX_SYMBOLS_PER_OBJECT: 10000,
//   MAX_OPTIONAL_PROPERTIES: 100,
//   MIN_PASSWORD_LENGTH: 8,
//   LOGS_DIR: path.join(__dirname, '../../logs'),
//   JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
//   JWT_EXPIRE_TIME: '4h',
//   JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
//   JWT_REFRESH_EXPIRE_TIME: 4.5 * 60 * 60,
// };
