import { Server } from '@hapi/hapi';
import Joi from 'joi';

import * as AccountControllers from '../controllers/account';

const register = async (server: Server) => {
  server.route({
    method: 'POST',
    path: '/login',
    options: {
      validate: {
        payload: {
          email: Joi.string().required(),
          password: Joi.string().required(),
        },
      },
      tags: ['api'],
    },
    handler: AccountControllers.login,
  });

  server.route({
    method: 'POST',
    path: '/register',
    options: {
      validate: {
        payload: {
          email: Joi.string().required(),
          password: Joi.string().required(),
          name: Joi.string().optional(),
        },
      },
      tags: ['api'],
    },
    handler: AccountControllers.register,
  });

  server.route({
    method: '*',
    path: '/',
    handler: (_, h) => h.response().code(204),
  });
};

export default {
  name: 'auth-server/routes',
  version: '0.0.1',
  register,
};
