import Mongoose from 'mongoose';
import { EmailAlreadyInUseError } from './AccountError';
import * as AccountService from '.';
import UserModel from '@models/User';

const MONGO_URI = process.env.MONGO_URL as string;

beforeAll(async () => {
  await Mongoose.connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await Mongoose.connection.close();
});

describe('Auth Service', () => {
  const testUser = {
    name: 'Test',
    email: 'test@test.com',
    password: 'test',
  };

  describe('register', () => {
    test('Should register a new user with email and password', async () => {
      await AccountService.registerWithEmailAndPassword(
        testUser.email,
        testUser.password
      );

      const account = await AccountService.findAccountByEmail(testUser.email);

      expect(account?.email).toMatch(testUser.email);
    });

    test('Should fail creating an account with duplicate email', async () => {
      // Create user
      await AccountService.registerWithEmailAndPassword(
        testUser.email,
        testUser.password
      );

      const failedToCreate = AccountService.registerWithEmailAndPassword(
        testUser.email,
        testUser.password
      );

      expect(failedToCreate).rejects.toThrow(EmailAlreadyInUseError);
    });
  });

  describe('login', () => {
    test('Should log in a user with right credentials', async () => {
      await AccountService.registerWithEmailAndPassword(
        testUser.email,
        testUser.password
      );

      const appUser = await AccountService.loginWithEmailAndPassword(
        testUser.email,
        testUser.password
      );

      expect(appUser.email).toEqual(testUser.email);
    });
  });

  test('Should retrieve one user from database by email', async () => {
    await AccountService.registerWithEmailAndPassword(
      testUser.email,
      testUser.password
    );

    const user = await AccountService.findAccountByEmail(testUser.email);
    expect(user?.email).toEqual(testUser.email);
  });
});
