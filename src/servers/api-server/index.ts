import CatboxMemory from '@hapi/catbox-memory';
import Hapi from '@hapi/hapi';
import Joi from 'joi';

import '../../config';
import '@services/mongo';
import { API_SERVER_PORT, API_SERVER_HOST } from '@constants';

(async () => {
  const apiServer = await Hapi.server({
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

  apiServer.validator(Joi);

  // Rate-limit
  await apiServer.register({
    plugin: require('hapi-rate-limit'),
    options: {
      userLimit: 600,
    },
  });

  // Auth plugin
  await apiServer.register(require('./plugins/auth').default);

  // Register routes
  await apiServer.register(require('./routes').default);

  // Start
  await apiServer.start();

  console.log(`[hapi] API Server deployed at ${apiServer.info.uri}`);
  console.log(
    `[hapi] Use localhost:${apiServer.info.port} as proxy URL for Apache or Nginx`
  );

  process.on('unhandledRejection', err => {
    console.error(err);
    process.exit(1);
  });
})();
