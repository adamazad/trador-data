import { MongooseFilterQuery } from 'mongoose';
import { AppUser, UserAuth } from '@interfaces/AppUser';
import UserModel, { UserDocument } from '@models/User';
import JwtService from '@services/jwt';

import { EmailAlreadyInUseError, WrongCredentialsError, EmailNotAllowedError, UserNotFoundError } from './AccountError';

type InitialFields = {
  name?: string;
};

export async function registerWithEmailAndPassword(
  email: string,
  password: string,
  initialFields: InitialFields = {}
): Promise<UserDocument> {
  // Disallow alias such as Gmail: jon+test@gmail.com
  if (!email || email.includes('+')) {
    return Promise.reject(new EmailNotAllowedError());
  }
  // Assume the user is in database
  const userExists = await UserModel.exists({ email });

  if (userExists) {
    return Promise.reject(new EmailAlreadyInUseError());
  }

  return new UserModel({
    // right to left: initial fields cannot rewrite, email and password
    ...initialFields,
    email,
    password,
  }).save();
}

/**
 *
 * @param {String} email User email
 * @param {String} password User password
 * @returns {AppUser}
 */
export async function loginWithEmailAndPassword(email: string, password: string): Promise<AppUser> {
  const user = await UserModel.findOne({ email }).exec();

  // if user is not found
  if (!user) {
    return Promise.reject(new WrongCredentialsError());
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return Promise.reject(new WrongCredentialsError());
  }

  // Create AppUser
  const { id, name } = user;

  // Use the default value from JWT
  const expiresIn = JwtService.getExpiresIn();

  const accessToken = await JwtService.sign(
    {
      email: user.email,
      id,
      name,
    },
    {
      expiresIn,
    }
  );

  const auth: UserAuth = {
    accessToken,
    expiresIn,
    createdAt: new Date().toISOString(),
  };

  const appUser: AppUser = {
    email: user.email,
    id,
    name,
    auth,
  };

  return appUser;
}

/**
 * Finds an account matching criteria
 */
export async function findAccounts(filter: MongooseFilterQuery<UserDocument>) {
  return UserModel.find(filter).exec();
}

/**
 * Finds an account matching criteria
 *
 * @param {string} email Supply email
 */
export async function findAccountByEmail(email: string) {
  return UserModel.findOne({ email }).exec();
}

/**
 * Finds an account matching criteria
 *
 * @param {Object} options Search criteria
 * @param {Schema.Types.ObjectId} options.id Supply email
 * @param {Schema.Types.ObjectId} options.email Supply email
 * @param {String} options.password Supply email
 */
export async function resetAccountPasswordById(userId: string, newPassword: string) {
  const userExists = await UserModel.findById(userId);

  if (!userExists) {
    return Promise.reject(new UserNotFoundError());
  }

  return UserModel.findByIdAndUpdate(userId, { password: newPassword }).exec();
}
