import { config, DotenvConfigOptions } from 'dotenv';

// Envrionement
export const NODE_ENV = process.env.NODE_ENV || 'development';

const options: DotenvConfigOptions = {};

if (NODE_ENV === 'test') {
  options.path = './.env.test';
}

config(options);

/**
 * App
 */
export const APP_URL = process.env.APP_URL || 'http://localhost:3000';
export const APP_HOST = process.env.APP_HOST || 'localhost';

/**
 * Auth Server
 */
export const AUTH_SERVER_PROTOCOL = process.env.AUTH_SERVER_PROTOCOL || 'http';
export const AUTH_SERVER_HOST = process.env.AUTH_SERVER_HOST || 'localhost';
export const AUTH_SERVER_PORT = process.env.AUTH_SERVER_PORT || 4001;
export const AUTH_SERVER_URL = `${AUTH_SERVER_PROTOCOL}://${AUTH_SERVER_PORT}:${AUTH_SERVER_HOST}`;

/**
 * API Server
 */
export const API_SERVER_PROTOCOL = process.env.API_SERVER_PROTOCOL || 'http';
export const API_SERVER_HOST = process.env.API_SERVER_HOST || 'localhost';
export const API_SERVER_PORT = process.env.API_SERVER_PORT || 4002;
export const API_SERVER_URL = `${API_SERVER_PROTOCOL}://${API_SERVER_PORT}:${API_SERVER_HOST}`;

if ([NODE_ENV, APP_URL, APP_HOST].some(entry => entry == undefined)) {
  throw new Error('Missing APP_* environment variables. Check .env file');
}

/**
 * JWT
 */
export const JWT_TYPE = process.env.JWT_TYPE || 'bearer';
export const JWT_AUD = process.env.JWT_AUD || 'default';
export const JWT_SECRET = process.env.JWT_SECRET || undefined;
export const JWT_EXPIRES_IN: number =
  parseInt(process.env.JWT_EXPIRES_IN as string) || 2.102e7; // expires in 24 hours

if ([JWT_TYPE, JWT_AUD, JWT_SECRET, JWT_EXPIRES_IN].includes(undefined)) {
  throw new Error(
    'Missing one or more JWT_* envrionment variables. Check .env file'
  );
}

/**
 * Mongo
 */
export const MONGO_URI = process.env.MONGO_URI || undefined;

if ([MONGO_URI].includes(undefined)) {
  throw new Error(
    'Missing MongoDB host environment variable (MONGO_URI). Check .env file'
  );
}

if (NODE_ENV !== 'test') {
  console.log({
    NODE_ENV,
    JWT_TYPE,
    JWT_AUD,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    MONGO_URI,
  });
}
