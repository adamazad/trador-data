import { ResponseToolkit } from '@hapi/hapi';
import AnonAnimals from 'anonymous-animals';
import Boom from '@hapi/boom';

import { ILoginRequest, IRegisterRequest } from '@interfaces/Request';
import * as AccountService from '@services/accounts';

export async function register(req: IRegisterRequest, h: ResponseToolkit) {
  const { payload } = req;

  await AccountService.registerWithEmailAndPassword(
    payload.email,
    payload.password,
    {
      name: AnonAnimals.get(),
    }
  ).catch(err => {
    throw Boom.badRequest(err);
  });

  return h.response().code(201);
}

export async function login(req: ILoginRequest, h) {
  const { payload } = req;

  try {
    // Error is dispatched to API
    const appUser = await AccountService.loginWithEmailAndPassword(
      payload.email,
      payload.password
    );
    return appUser;
  } catch (e) {
    throw Boom.badRequest(e);
  }
}
