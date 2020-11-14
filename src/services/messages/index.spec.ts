import Mongoose from 'mongoose';
import MessageModel from '@models/Message';
import * as MessagesService from '.';

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
  await MessageModel.deleteMany({});
});

afterAll(async () => {
  await Mongoose.connection.close();
});

describe('Messages Service', () => {
  describe('Create', () => {
    test('Should create a new message', async () => {
      const testMessage = {
        user: '5fafa23b3634753c0877eab4',
        message: 'Jesting it',
      };

      const newMessage = await MessagesService.createMessage(testMessage);

      const foundMessage = await MessagesService.findMessageById(newMessage.id);

      expect(foundMessage?.user.toString()).toMatch(testMessage.user);
      expect(foundMessage?.message).toMatch(testMessage.message);
    });

    test('Should create a reply', async () => {
      const testMessage = {
        user: '5fafa23b3634753c0877eab4',
        message: 'Jesting it',
      };

      const post = await MessagesService.createMessage(testMessage);

      const newReply = await MessagesService.createMessage({
        ...testMessage,
        parentId: post._id,
      });

      expect(newReply.parentId?.toString()).toEqual(post.id.toString());
      expect(newReply.message).toEqual(testMessage.message);
      expect(newReply.user.toString()).toEqual(testMessage.user);
    });
  });

  describe('List', () => {
    test('List a collection of messages', async () => {
      const mockMessages = [
        {
          user: '5fafa23b3634753c0877eab4',
          message: 'Message #1',
        },
        {
          user: '5fafa23b3634753c0877eab4',
          message: 'Message #2',
        },
        {
          user: '5fafa23b3634753c0877eab4',
          message: 'Message #3',
        },
      ];

      for (let mockMessage of mockMessages) {
        await MessagesService.createMessage(mockMessage);
      }

      const foundMessages = await MessagesService.findMessages();
      // type of Array
      expect(Array.isArray(foundMessages)).toBeTruthy();
      expect(foundMessages.length).toEqual(mockMessages.length);
      // Compare submitted messages agaisnt created ones
      const contentExists = foundMessages.every(
        foundMessage =>
          mockMessages.find(
            mockMessage => mockMessage.message === foundMessage.message
          ) != undefined
      );
      expect(contentExists).toBeTruthy();
    });

    test('Should list message by id', async () => {
      const testMessage = {
        user: '5fafa23b3634753c0877eab4',
        message: 'Jesting it',
      };

      const post = await MessagesService.createMessage(testMessage);

      const newReply = await MessagesService.createMessage({
        ...testMessage,
        parentId: post._id,
      });

      expect(newReply.parentId?.toString()).toEqual(post._id.toString());
      expect(newReply.message).toEqual(testMessage.message);
      expect(newReply.user.toString()).toEqual(testMessage.user);
    });
  });
});
