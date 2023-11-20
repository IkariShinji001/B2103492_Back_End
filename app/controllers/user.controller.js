const UserService = require('../services/user.service');
const ApiError = require('../api-error');
const UserController = {
  async register(req, res, next) {
    const userInfor = req.body;
    try {
      const userService = new UserService();
      await userService.register(userInfor);
      res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (error) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      console.log(error);
      return next(new ApiError(500, 'Lỗi không xác định'));
    }
  },

  async login(req, res, next) {
    const userInfor = req.body;
    try {
      const userService = new UserService();
      const result = await userService.login(userInfor);
      res.cookie('user_access_token', result.access_token, { httpOnly: true });
      res.cookie('user_refresh_token', result.refresh_token, { httpOnly: true });
      return res
        .status(200)
        .json({ success: result.success, access_token: result.access_token });
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      return next(new ApiError(500, 'Lỗi không xác định'));
    }
  },

  async changePassword(req, res, next) {
    const { username } = req.user;
    const { oldPassword, newPassword } = req.body;
    try {
      const userService = new UserService();
      await userService.changePassword(oldPassword, newPassword, username);
      return res.status(200).json({ message: 'Đã đổi mật khẩu thành công' });
    } catch (error) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      console.log(error);
      return next(new ApiError(500, 'Lỗi không xác định'));
    }
  },

  async getAllUsers(req, res, next) {
    try {
      const userService = new UserService();
      const users = await userService.getAllUser();
      return res.status(200).json(users);
    } catch (error) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      return next(new ApiError(500, 'Lỗi không xác định'));
    }
  },

  async getUser(req, res, next) {
    try {
      const userService = new UserService();
      const user = await userService.getUser(req.user._id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  async updateUserInfo(req, res, next) {
    const userId = req.user._id;
    const userInfor = req.body;
    try {
      const userService = new UserService();
      await userService.updateUserInfo(userId, userInfor);
      return res.status(200).json({ message: 'Đã cập nhật thông tin thành công' });
    } catch (error) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      console.log(error);
      return next(new ApiError(500, 'Lỗi không xác định'));
    }
  },

  async addCart(req, res, next) {
    const userId = req.user._id;
    const { bookId, quantity } = req.body;
    try {
      const userService = new UserService();
      await userService.addCart(userId, bookId, quantity);
      return res
        .status(200)
        .json({ message: 'Đã thêm sách vào giỏ hàng thành công' });
    } catch (error) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      console.log(error);
      return next(new ApiError(500, 'Lỗi không xác định'));
    }
  },

  async removeBookCart(req, res, next) {
    const userId = req.user._id;
    const { id } = req.params;
    try {
      const userService = new UserService();
      await userService.removeBookFromCart(userId, id);
      return res
        .status(200)
        .json({ message: 'Đã xóa sách khỏi giỏ hàng thành công' });
    } catch (error) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      console.log(error);
      return next(new ApiError(500, 'Lỗi không xác định'));
    }
  },

  async updateQuantityInCart(req, res, next) {
    const userId = req.user._id;
    const { bookId, quantity } = req.body;

    console.log(bookId, quantity);
    try {
      const userService = new UserService();
      await userService.updateBookQuantityInCart(userId, bookId, quantity);
      return res
        .status(200)
        .json({ message: 'Đã cập nhật số lượng trong giỏ hàng thành công' });
    } catch (error) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      console.log(error);
      return next(new ApiError(500, 'Lỗi không xác định'));
    }
  },

  async getUserCart(req, res, next) {
    const userId = req.user._id;
    try {
      const userService = new UserService();
      const cart = await userService.getUserCart(userId);
      return res.status(200).json(cart);
    } catch (error) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      console.log(error);
      return next(new ApiError(500, 'Lỗi không xác định'));
    }
  },
};

module.exports = UserController;
