import dotenv from 'dotenv';
import path from 'path';

// this construction needed for correct work prod version
dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const DB_HOST = process.env.DB_HOST || '';
export const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
export const AUTH_MODE = process.env.AUTH_MODE === 'true';
export const MAX_SYMBOLS_PER_OBJECT = 10000;
export const MAX_OPTIONAL_PROPERTIES = 100;
export const MIN_PASSWORD_LENGTH = 8;
export const LOGS_DIR = path.join(__dirname, '../../logs');
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '';
export const JWT_EXPIRE_TIME = '4h';
export const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || '';
export const JWT_REFRESH_EXPIRE_TIME = 4.5 * 60 * 60;

export const GRAPHQL_PATH = '/graphql';
