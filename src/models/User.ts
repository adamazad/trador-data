import uniqueValidator from 'mongoose-unique-validator';
import mongoose, { Schema, Document } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const SALT_WORK_FACTOR = 8;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: Schema.Types.String,
      default: '',
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: isEmail,
        message: '{VALUE} is not a valid email',
        isAsync: false,
      },
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure virtual fields are serialised.
userSchema
  .set('toJSON', {
    virtuals: true,
  })
  .set('toObject', {
    virtuals: true,
  });

userSchema
  .index({
    name: 'text',
    email: 'text',
  })
  .index({ '$**': 'text' });

/**
 * @alias User.methods.comparePassword
 * @param {string} password the payload password
 * @return {promise} return a promise
 */
userSchema.methods.comparePassword = async function comparePassword(
  password: string
) {
  return bcrypt.compare(password, this.password);
};

userSchema.plugin(uniqueValidator).plugin(mongooseDelete, {
  deletedAt: true,
});

userSchema.pre('save', function hashPassword(this: UserDocument, next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, SALT_WORK_FACTOR).then((hash: any) => {
    user.password = hash;
    next();
  });
});

userSchema.pre('findOneAndUpdate', async function () {
  const query: any = this;
  if (query._update.password) {
    const hashedPassword = await bcrypt.hash(
      query._update.password,
      SALT_WORK_FACTOR
    );
    query.password = hashedPassword;
  }
});

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
