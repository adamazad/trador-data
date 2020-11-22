import CatboxMemory from '@hapi/catbox-memory';
import Hapi from '@hapi/hapi';
import Joi from 'joi';

import { AUTH_SERVER_PORT, AUTH_SERVER_HOST, NODE_ENV } from '@constants';

const server = new Hapi.Server({
  port: AUTH_SERVER_PORT,
  host: AUTH_SERVER_HOST,
  cache: {
    engine: new CatboxMemory(),
    name: 'memory',
  },
  routes: {
    auth: false,
    cors: {
      origin: ['*'],
    },
  },
});

async function configure() {
  // Joi
  server.validator(Joi);

  // Rate-limit in production
  if (NODE_ENV === 'production') {
    await server.register({
      plugin: require('hapi-rate-limit').default,
      options: {
        userLimit: 60,
      },
    });
  }

  // Routes
  await server.register(require('./routes').default);
}

export async function init() {
  await configure();
  await server.initialize();
  return server;
}

export async function start() {
  await configure();
  await server.start();
  return server;
}
