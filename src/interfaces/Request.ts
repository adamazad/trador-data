import * as Hapi from '@hapi/hapi';
import { AppUser } from './AppUser';

declare module '@hapi/hapi' {
  export interface UserCredentials extends AppUser {}
}

export interface ICredentials extends Hapi.AuthCredentials {
  id: string;
}

export interface IRequestAuth extends Hapi.RequestAuth {
  credentials: ICredentials;
}

export interface IRequest extends Hapi.Request {
  auth: IRequestAuth;
}

export interface IGetMesssageRequest extends IRequest {
  params: {
    messageId: string;
  };
}

export interface ICreateMesssageRequest extends IRequest {
  payload: {
    parentId?: string;
    message: string;
  };
}

export interface IUpdateMesssageRequest extends IRequest {
  params: {
    messageId: string;
  };
  payload: {
    message: string;
  };
}

export interface IDeleteMesssageRequest extends IRequest {
  params: {
    messageId: string;
  };
}

export interface ILoginRequest extends IRequest {
  payload: {
    email: string;
    password: string;
  };
}

export interface IRegisterRequest extends IRequest {
  payload: {
    name: string;
    email: string;
    password: string;
  };
}
