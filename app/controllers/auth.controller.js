const AuthService = require('../services/auth.service');
const ApiError = require('../api-error');
const AuthController = {
  async verifyEmail(req, res, next) {
    const { verificationToken } = req.query;

    try {
      const authService = new AuthService();
      const sendMailResult = await authService.verifyEmail(verificationToken);
      if (sendMailResult.statusCode === 400) {
        return next(
          new ApiError(sendMailResult.statusCode, sendMailResult.message)
        );
      }
      res.status(200).json({ message: 'Tài khoản đã được xác thực ' });
    } catch (err) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      console.log(err);
      return next(new ApiError(500, 'Lỗi xảy ra trong quá trình xác thực'));
    }
  },

  async verifyRefreshToken(req, res, next) {
    const refreshToken = req.cookies.refresh_token;
    const oldAccessToken = req.cookies.access_token;
    try {
      const authService = new AuthService();
      const result = await authService.verifyRefreshToken(
        oldAccessToken,
        refreshToken
      );
      if (result.statusCode === 400) {
        return next(new ApiError(result.statusCode, result.message));
      }
      res.cookie('access_token', result.accessToken);
      return res.status(200).json({
        message: 'Xác thực refresh token thành công và cấp access_token mới',
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      console.log(error);
      return next(new ApiError(500, 'Lỗi xảy ra trong quá trình xác thực'));
    }
  },

  async verifyAccessToken(req, res, next) {
    const tokenName = req.headers.referer.includes('localhost:9999')
      ? 'admin_access_token'
      : 'user_access_token';
    const accessToken = req.cookies[tokenName];
    try {
      const authService = new AuthService();
      await authService.verifyAccessToken(accessToken);
      return res.status(200).json({ isVerified: true });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token hết hạn' });
      } else {
        return res.status(500).json({ error: 'Token không hợp lệ' });
      }
    }
  },

  async signOut(req, res, next) {
    const tokenName = req.headers.referer.includes('localhost:9999')
      ? 'admin_access_token'
      : 'user_access_token';
      const refreshTokenName = req.headers.referer.includes('localhost:9999')
      ? 'admin_refresh_token'
      : 'user_refresh_token';
    try {
      res.clearCookie(tokenName);
      res.clearCookie(refreshTokenName);
      return res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
      next(error);
    }
  },

  async verifyForgetPassword(req, res, next) {
    const { email } = req.body;
    try {
      const authService = new AuthService();
      await authService.verifyForgetPassword(email);
      return res.status(200).json({ message: 'Đã gửi mail xác nhận' });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res) {
    const newPassword = req.body.newPassword;
    const token = req.body.verificationToken;
    try {
      const authService = new AuthService();
      await authService.resetPassword(token, newPassword);
      return res.status(200).json({ success: 'Đổi mật khẩu thành công' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Lỗi server' });
    }
  },
};

module.exports = AuthController;
