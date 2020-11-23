import '@constants';
import { init } from '@services/mongo';
import { start } from './server';

(async () => {
  // Connect to Mongo
  await init();
  // Start server
  const server = await start();

  console.log(`[hapi] API Server deployed at ${server.info.uri}`);
  console.log(`[hapi] Use localhost:${server.info.port} for Nginx`);
})();

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});
