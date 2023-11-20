const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  fullName: String,
  email: String,
  address: String,
  phoneNumber: String,
  cart: {
    books: [
      {
        book: {
          type: Schema.Types.ObjectId,
          ref: 'Book',
        },
        quantity: Number,
      },
    ],
  },
  notification: [
    {
      title: String,
      message: String,
      isRead: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
