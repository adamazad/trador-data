import {
  isValidObjectId,
  MongooseFilterQuery,
  MongooseUpdateQuery,
} from 'mongoose';
import MessageModel, { MessageDocument } from '@models/Message';
import '@models/User';

type CreateMessageParams = {
  user: string;
  parentId?: string | null;
  message: string;
};

/**
 * Creates a new `MessageDocument`
 *
 * @param {CreateMessageParams} payload values with which to create the document
 */
export async function createMessage(payload: CreateMessageParams) {
  const newMessage = await new MessageModel(payload).save();

  return newMessage.populate('user');
}

/**
 * Returns one `MessageDocument`
 *
 * @param messageId message Id
 */
export async function findMessageById(messageId: string) {
  if (!isValidObjectId(messageId)) {
    return null;
  }
  return MessageModel.findById(messageId).exec();
}

/**
 * Returns a set of `MessageDocument`
 *
 * @param {MongooseFilterQuery<MessageDocument>} conditions query conditions
 */
export async function findMessages(
  conditions: MongooseFilterQuery<MessageDocument> = {}
) {
  return MessageModel.find(conditions).exec();
}

/**
 * Returns a custom Mongoose Query
 *
 */
export function createQuery() {
  return MessageModel.find();
}

/**
 * Updates a Message and returns the updated `MessageDocument`
 *
 * @param {string} messageId the message Id
 * @param updatePayload fields to update
 */
export async function findAndUpdateMessageById(
  messageId: string,
  updatePayload: MongooseUpdateQuery<MessageDocument>
) {
  return MessageModel.findByIdAndUpdate(messageId, updatePayload, {
    new: true,
  }).exec();
}

/**
 * Deletes a Message from the database by ID
 *
 * @param {string} messageId the message Id
 */
export async function findAndDeleteMessageById(messageId: string) {
  return MessageModel.findByIdAndDelete(messageId).exec();
}
