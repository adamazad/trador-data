import Mongoose, { Schema, Document } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

export interface MessageDocument extends Document {
  user: string;
  parentId: string | null;
  message: string;
  public: Boolean;
}

const schema = new Mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: Schema.Types.String,
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(MongooseDelete, {
  deletedAt: true,
});

// Ensure virtual fields are serialised.
schema
  .set('toJSON', {
    virtuals: true,
  })
  .set('toObject', {
    virtuals: true,
  });

const MessageModel = Mongoose.model<MessageDocument>('Message', schema);

export default MessageModel;
