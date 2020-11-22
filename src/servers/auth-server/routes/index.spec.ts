import { Server } from '@hapi/hapi';
import Mongoose from 'mongoose';
import Faker from 'faker';

import { init } from '../server';

const MONGO_URI = process.env.MONGO_URL as string;

describe('Auth Routes', () => {
  let server: Server;

  beforeAll(async () => {
    await Mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }).catch(err => {
      process.exit(1);
    });

    // Start server
    server = await init();
  });

  beforeEach(async () => {});

  afterAll(async () => {
    await Mongoose.connection.close();
  });

  describe('POST /register', () => {
    // Test user
    let payload = {
      email: Faker.internet.email().toLocaleLowerCase(),
      password: Faker.internet.password(),
    };
    test('It should fail when payload is {}', async () => {
      const registerRes = await server.inject({
        url: '/register',
        method: 'POST',
        payload: {},
      });

      expect(registerRes.statusCode).toBe(400);
    });

    test(`It should not expect payload with extra fields`, async () => {
      const registerRes = await server.inject({
        url: '/register',
        method: 'POST',
        payload: {
          ...payload,
          extraA: 'a',
          extraB: 'b',
        },
      });

      expect(registerRes.statusCode).toBe(400);
    });

    test(`It should not expect payload with extra fields`, async () => {
      const registerRes = await server.inject({
        url: '/register',
        method: 'POST',
        payload: {
          ...payload,
          extraA: 'a',
          extraB: 'b',
        },
      });

      expect(registerRes.statusCode).toBe(400);
    });

    test('It should register a new user', async () => {
      const registerRes = await server.inject({
        url: '/register',
        method: 'POST',
        payload,
      });

      expect(registerRes.statusCode).toBe(201);
    });
  });

  describe('POST /login', () => {
    // Test user
    let payload = {
      email: Faker.internet.email().toLocaleLowerCase(),
      password: Faker.internet.password(),
    };

    test('It return user obejct and auth', async () => {
      // Register
      const registerRes = await server.inject({
        url: '/register',
        method: 'POST',
        payload,
      });

      expect(registerRes.statusCode).toBe(201);

      // Login
      const loginRes = await server.inject({
        url: '/login',
        method: 'POST',
        payload,
      });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email: payload.email,
          auth: expect.objectContaining({
            expiresIn: expect.any(Number),
            createdAt: expect.any(String),
            accessToken: expect.any(String),
          }),
        })
      );
    });
  });
});
