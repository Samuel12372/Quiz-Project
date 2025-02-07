const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    points: {
      type: Number,
      required: false,
      default: 0,
    },
    quizzesId: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { versionKey: false }
);

// Create the User model from the schema
const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;