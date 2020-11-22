import CatboxMemory from '@hapi/catbox-memory';
import Hapi from '@hapi/hapi';
import Joi, { func } from 'joi';

import '@services/mongo';
import { API_SERVER_PORT, API_SERVER_HOST, NODE_ENV } from '@constants';

const server = Hapi.server({
  port: API_SERVER_PORT,
  host: API_SERVER_HOST,
  cache: {
    engine: new CatboxMemory(),
    name: 'memory',
  },
  routes: {
    cors: true,
  },
});

async function configure() {
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

  // Auth plugin
  await server.register(require('./plugins/auth').default);

  // Register routes
  await server.register(require('./routes').default);
}

/**
 * Initilizes the server
 */
export async function init() {
  await configure();
  await server.initialize();
}

/**
 * Starts the and a srver instance
 */
export async function start() {
  // Start
  await server.start();
  return server;
}
