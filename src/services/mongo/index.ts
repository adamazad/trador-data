import Mongoose from 'mongoose';
import { MONGO_URI, NODE_ENV } from '@constants';

/**
 * Starts a Mongo connection
 */
export async function init() {
  await Mongoose.connect(MONGO_URI || '', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  Mongoose.set('useCreateIndex', true);
  Mongoose.set('useFindAndModify', false);

  if (NODE_ENV !== 'test') {
    Mongoose.set('debug', true);
  }
}

Mongoose.connection.on('error', err => {
  console.error(err);
  process.exit(100);
});
