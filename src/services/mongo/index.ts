import Mongoose from 'mongoose';

import { MONGO_HOST, NODE_ENV } from '@constants';

Mongoose.connect(MONGO_HOST || '', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

Mongoose.set('useCreateIndex', true);
Mongoose.set('useFindAndModify', false);

if (NODE_ENV !== 'test') {
  Mongoose.set('debug', true);
}

Mongoose.connection.on('error', err => {
  console.error(err);
  process.exit(100);
});
