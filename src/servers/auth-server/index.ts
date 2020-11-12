import CatboxMemory from '@hapi/catbox-memory';
import Hapi from '@hapi/hapi';
import Joi from 'joi';

import '../../config';
import '@services/mongo';
import { AUTH_SERVER_PORT, AUTH_SERVER_HOST } from '@constants';

(async () => {
  const authServer = await new Hapi.Server({
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

  // Joi
  await authServer.validator(Joi);

  // Rate-limit
  await authServer.register({
    plugin: require('hapi-rate-limit'),
    options: {
      userLimit: 60,
    },
  });

  // Routes
  await authServer.register(require('./routes').default);

  // Start
  await authServer.start();

  console.log(`[hapi] Auth Server deployed at ${authServer.info.uri}`);
  console.log(`[hapi] Use localhost:${authServer.info.port} for Nginx`);

  process.on('unhandledRejection', err => {
    console.error(err);
    process.exit(1);
  });
})();
