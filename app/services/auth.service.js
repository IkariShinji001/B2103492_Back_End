const User = require('../models/user');
const ApiError = require('../api-error');
const jwt = require('jsonwebtoken');
const config = require('../config/index');
const SendMail = require('../nodemailer/sendMail');
const getMailTemplate = require('../nodemailer/getMailTemplates');
const bcrypt = require('bcrypt');
class AuthService {
  async verifyEmail(verificationToken) {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw new ApiError(400, 'Không tồn tại tài khoản này');
    }

    user.isVerified = true;
    await user.save();

    return { success: true };
  }

  async verifyRefreshToken(oldAccessToken, refreshToken) {
    const decodedToken = jwt.decode(oldAccessToken);
    if (!refreshToken) {
      throw new ApiError(401, 'Không tìm thấy refresh token');
    }
    const isVerified = jwt.verify(refreshToken, config.jwt.secret_key);
    if (isVerified) {
      const accessToken = jwt.sign(
        {
          username: decodedToken.username || decodedToken.staffID,
          role: decodedToken.role,
          _id: decodedToken._id,
        },
        config.jwt.secret_key,
        { expiresIn: '3h' }
      );
      return { success: true, accessToken };
    } else {
      throw new ApiError(400, 'Refresh token không hợp lệ');
    }
  }

  async verifyAccessToken(access_token) {
    if (!access_token) {
      throw new ApiError(400, 'Không tìm thấy access token');
    }

    const isVerified = jwt.verify(access_token, config.jwt.secret_key);

    if (isVerified) {
      return true;
    }
  }

  async verifyForgetPassword(userEmail) {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      throw new ApiError(400, 'Không tồn tại tài khoản có email này');
    }
    const sendMail = new SendMail();
    const payload = {
      isResetPassword: true,
      username: user.username,
    };
    const token = jwt.sign(payload, config.jwt.secret_key);

    const verificationLink = `http://localhost:10000/reset-password/?verificationToken=${token}`;

    await sendMail.sendMail(
      user.email,
      'Quên mật khẩu',
      getMailTemplate.forgotPasswordTemplate(user.username, verificationLink)
    );
  }

  async resetPassword(token, newPassword){
    const decodedToken = jwt.verify(token, config.jwt.secret_key);
    if (!decodedToken.isResetPassword) {
      throw new ApiError(400, 'Token không hợp lệ');
    }
    const user = await User.findOne({ username: decodedToken.username });

    console.log(user);

    if (!user) {
      throw new ApiError(400, 'Không tồn tại user');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;

    console.log(user);
    await user.save();

  }

}

module.exports = AuthService;
