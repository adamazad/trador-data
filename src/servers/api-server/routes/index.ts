import { Server } from '@hapi/hapi';
import Joi from 'joi';
import * as MessageController from '../controllers/messages';

const register = async (server: Server) => {
  server.route({
    method: 'GET',
    path: '/messages',
    options: {
      tags: ['api'],
      auth: false, // GET /messages does not require authentication
    },
    handler: MessageController.getMessages,
  });

  server.route({
    method: 'POST',
    path: '/messages',
    options: {
      validate: {
        payload: {
          message: Joi.string().required(),
          parentId: Joi.string().optional(),
        },
      },
      tags: ['api'],
      auth: 'bearer',
    },
    handler: MessageController.createMessage,
  });

  server.route({
    method: 'PUT',
    path: '/messages/{messageId}',
    options: {
      validate: {
        payload: {
          message: Joi.string().required(),
          parentId: Joi.string().optional(),
        },
      },
      tags: ['api'],
      auth: 'bearer',
    },
    handler: MessageController.updateMesssage,
  });

  server.route({
    method: 'DELETE',
    path: '/messages/{messageId}',
    options: {
      tags: ['api'],
      auth: 'bearer',
      plugins: {
        pagination: {
          enabled: false,
        },
      },
    },
    handler: MessageController.deleteMesssage,
  });

  server.route({
    method: 'GET',
    path: '/messages/{messageId}',
    options: {
      tags: ['api'],
      auth: false,
    },
    handler: MessageController.getMessage,
  });
};

export default {
  name: 'api-routes',
  version: '0.0.1',
  register,
};
