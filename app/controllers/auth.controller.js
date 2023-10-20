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

  async verifyAccessToken(req, res, next){
    const accessToken = req.cookies.access_token;
    try {
      const authService = new AuthService(); 
      await authService.verifyAccessToken(accessToken);
      return res.status(200).json({isVerified: true});
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token hết hạn' });
      } else {
        return res.status(500).json({ error: 'Token không hợp lệ' });
      }
    }
  },

  async signOut(req ,res, next){
    try {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');

      return res.status(200).json({message: 'Đăng xuất thành công'});
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AuthController;
