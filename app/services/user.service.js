const User = require('../models/user');
const bcrypt = require('bcrypt');
const SendMail = require('../nodemailer/sendMail');
const getMailTemplate = require('../nodemailer/getMailTemplates');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../api-error');
const jwt = require('jsonwebtoken');
const config = require('../config/index');
const Book = require('../models/book');

class UserService {
  async register(userInfor) {
    const user = await User.findOne({ username: userInfor.username });
    const email = await User.findOne({ email: userInfor.email });
    if (user) {
      throw new ApiError(400, 'Tên tài khoản đã tồn tại');
    }
    if (email) {
      throw new ApiError(400, 'Email đã tồn tại');
    }
    // Tạo token để verify email
    const verificationToken = uuidv4();
    const hashPassword = await bcrypt.hash(userInfor.password, 10);
    const newUser = new User({
      username: userInfor.username,
      password: hashPassword,
      fullName: userInfor.fullName,
      address: userInfor.address,
      phoneNumber: userInfor.phoneNumber,
      email: userInfor.email,
      verificationToken,
    });
    await newUser.save();
    // Gửi mail để người dùng xác thực
    const sendMailInstance = new SendMail();
    const verificationLink = `http://localhost:3000/api/v1/auth/verify-email?verificationToken=${verificationToken}`;
    await sendMailInstance.sendMail(
      userInfor.email,
      'Xác thực email đăng ký tài khoản',
      getMailTemplate.vefifyTemplateMail(userInfor.username, verificationLink)
    );
    return { success: true };
  }

  async login(userInfor) {
    const { username, password } = userInfor;

    const user = await User.findOne({ username });

    console.log(user);

    if (!user) {
      throw new ApiError(400, 'Sai tài khoản hoặc mật khẩu');
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      throw new ApiError(400, 'Sai tài khoản hoặc mật khẩu');
    }

    if (!user.isVerified) {
      throw new ApiError(400, 'Tài khoản chưa xác thực email!');
    }

    const access_token = jwt.sign(
      {
        _id: user._id.toString(),
        username: user.username,
        role: user.role,
      },
      config.jwt.secret_key,
      { expiresIn: '4h' }
    );

    const refresh_token = jwt.sign(
      {
        id: uuidv4(),
      },
      config.jwt.secret_key,
      { expiresIn: '1d' }
    );

    return {
      access_token,
      refresh_token,
      success: { id: user._id, notification: user.notification },
    };
  }

  async changePassword(oldPassowrd, newPassword, username) {
    const user = await User.findOne({ username });

    if (!user) {
      throw new ApiError(400, 'Không tồn tại tài khoản');
    }

    console.log(user);
    const isMatchPassword = await bcrypt.compare(oldPassowrd, user.password);

    if (!isMatchPassword) {
      throw new ApiError(400, 'Sai mật khẩu');
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.save();
  }

  async getAllUser() {
    const users = await User.find({});
    return users;
  }

  async addCart(userId, bookId, quantity) {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    const book = await Book.findById(bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    const existingBookInCart = user.cart.books.find((cartItem) =>
      cartItem.book.equals(bookId)
    );

    if (existingBookInCart) {
      existingBookInCart.quantity += parseInt(quantity);
    } else {
      user.cart.books.push({
        book: bookId,
        quantity: quantity,
      });
    }

    await user.save();
  }

  async updateBookQuantityInCart(userId, bookId, newQuantity) {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const bookItem = user.cart.books.filter((cartItem) => {
      console.log(cartItem.book.toString());
      return cartItem.book.toString() === bookId;
    });

    console.log(bookItem);
    if (bookItem) {
      if (newQuantity < 1) {
        throw new Error('Quantity cannot be less than 1');
      } else {
        bookItem[0].quantity = newQuantity;
      }
      await user.save();
    }
  }

  async removeBookFromCart(userId, bookId) {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const bookIndex = user.cart.books.findIndex((cartItem) =>
      cartItem.book.equals(bookId)
    );

    if (bookIndex !== -1) {
      user.cart.books.splice(bookIndex, 1);
      await user.save();
    }
  }

  async getUserCart(id) {
    const user = await User.findOne({ _id: id }).populate({
      path: 'cart.books.book',
      model: 'Book',
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.cart;
  }

  async getUser(id) {
    const user = await User.findOne({ _id: id }, { password: 0 });
    return user;
  }

  async updateUserInfo(id, payload) {
    await User.findByIdAndUpdate({ _id: id }, { $set: payload });
  }
}

module.exports = UserService;
