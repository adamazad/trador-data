import Mongoose from 'mongoose';
import { Server } from '@hapi/hapi';
import Faker, { fake } from 'faker';

import UserModel, { UserDocument } from '@models/User';
import MessageModel, { MessageDocument } from '@models/Message';

import { init } from '../server';

const MONGO_URI = process.env.MONGO_URL as string;

describe('API Routes', () => {
  let server: Server;
  // Populate
  const users: UserDocument[] = [];
  const messages: MessageDocument[] = [];

  beforeAll(async () => {
    await Mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }).catch(err => {
      process.exit(1);
    });

    // Populate users
    for (let i = 0; i < 2; i++) {
      users.push(
        await UserModel.create({
          email: Faker.internet.email(),
          name: Faker.name.findName(),
          password: Faker.internet.password(),
        })
      );
    }

    // Create messages
    for (let i = 0; i < 10; i++) {
      // Random user
      const { id: user } = users[Math.floor(Math.random() * users.length)];
      // Random message to randomly reply
      const { id: parentId } = messages[Math.floor(Math.random() * messages.length)] || { id: null };

      messages.push(
        await MessageModel.create({
          message: Faker.lorem.sentence(),
          public: true,
          parentId,
          user,
        })
      );
    }

    // Start server
    server = await init();
  });

  beforeEach(async () => {});

  afterAll(async () => {
    await Mongoose.connection.close();
  });

  describe('GET /messages', () => {
    test('It should list all messages in the database', async () => {
      const messageListRes = await server.inject({
        url: '/messages',
        method: 'GET',
      });
      expect(messageListRes.statusCode).toBe(200);
      expect(messageListRes.result?.messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            message: expect.any(String),
          }),
        ])
      );
    });
  });

  describe('GET /messages/{messageId}', () => {
    test('It should list a single message in database', async () => {
      // Using the first message
      const actualMessage = messages[0];

      const { statusCode, result } = await server.inject({
        url: `/messages/${actualMessage.id}`,
        method: 'GET',
      });

      expect(statusCode).toBe(200);
      expect(result?.id).toEqual(actualMessage.id);
      expect(result?.message).toEqual(actualMessage.message);
      expect(result?.parentId).toEqual(actualMessage.parentId);
    });
  });

  describe('POST /messages', () => {
    test('It should return 401 without authentication object', async () => {
      const registerRes = await server.inject({
        url: '/messages',
        method: 'POST',
      });
      expect(registerRes.statusCode).toBe(401);
    });

    test('It should create and return the new message', async () => {
      const author = users[0].toJSON();

      const payload = {
        message: Faker.lorem.sentence(),
      };

      const { result, statusCode } = await server.inject({
        url: '/messages',
        method: 'POST',
        payload,
        auth: {
          credentials: {
            id: author.id,
          },
          strategy: 'bearer',
        },
      });

      expect(statusCode).toBe(201);
      expect(`${result?.user}`).toMatch(`${author.id}`);
      expect(result?.message).toEqual(payload.message);
      expect(result?.id).toEqual(expect.any(String));
      expect(result?.parentId).toBe(null);
    });
  });
});
