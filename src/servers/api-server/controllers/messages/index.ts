import { ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';

import * as MessageService from '@services/messages';
import {
  ICreateMesssageRequest,
  IDeleteMesssageRequest,
  IUpdateMesssageRequest,
  IGetMesssageRequest,
} from '@interfaces/Request';

export async function getMessages() {
  const messages = await MessageService.createQuery()
    .populate('user', 'name')
    .sort('-createdAt')
    .exec()
    .catch(error => Boom.badRequest(error));
  return {
    messages,
  };
}

export async function getMessage(req: IGetMesssageRequest) {
  const message = await MessageService.findMessageById(
    req.params.messageId
  ).catch(error => Boom.badRequest(error));

  if (message == null) {
    throw Boom.notFound();
  }

  return message;
}

export async function createMessage(req: ICreateMesssageRequest) {
  const { payload, auth } = req;
  const { credentials } = auth;

  if (payload.parentId) {
    const parentExists = MessageService.findMessageById(payload.parentId);

    if (parentExists == null) {
      throw Boom.badRequest('Parent message does not exist');
    }
  }

  const message = await MessageService.createMessage({
    ...payload,
    user: credentials.id,
  });

  return message.toJSON();
}

export async function updateMesssage(
  req: IUpdateMesssageRequest,
  h: ResponseToolkit
) {
  const { credentials } = req.auth;
  const { messageId } = req.params;

  const message = await MessageService.findMessageById(messageId);

  if (message == null) {
    throw Boom.notFound();
  }

  if (message.user != credentials.id) {
    throw Boom.forbidden();
  }

  await MessageService.findAndUpdateMessageById(
    messageId,
    req.payload
  ).catch(error => Boom.badRequest(error));

  return h.response().code(204);
}

export async function deleteMesssage(
  req: IDeleteMesssageRequest,
  h: ResponseToolkit
) {
  const { credentials } = req.auth;
  const { messageId } = req.params;

  const message = await MessageService.findMessageById(messageId);

  if (message == null) {
    throw Boom.forbidden();
  }

  if (message.user != credentials.id) {
    throw Boom.unauthorized();
  }

  await MessageService.findAndDeleteMessageById(messageId).catch(error =>
    Boom.badRequest(error)
  );

  return h.response().code(204);
}
