const StaffService = require('../services/staff.service');
const ApiError = require('../api-error');

const staffController = {
  async registerNewStaff(req, res, next) {
    const staffInfor = req.body;
    try {
      const result = await StaffService.registerNewStaff(staffInfor);
      if (result.success) {
        return res.status(201).json({
          newStaff: result.newStaff,
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      } 
      if (error.message === 'No recipients defined') {
        return next(new ApiError(400, 'Email không tồn tại'));
      }
      return next(new ApiError(500, 'Lỗi xảy ra trong quá trình tạo mới'));
    }
  },

  async login(req, res, next) {
    const { staffID, password } = req.body;
    try {
      const result = await StaffService.login(staffID, password);
      res.cookie('admin_access_token', result.access_token, { httpOnly: true });
      res.cookie('admin_refresh_token', result.refresh_token, { httpOnly: true });
      return res.status(200).json({ role: result.role });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    const { search } = req.query;
    try {
      if (search) {
        const staffs = await StaffService.getStaffByFullNameOrStaffId(search);
        return res.status(200).json(staffs);
      }

      const staffs = await StaffService.getAll(search);
      return res.status(200).json(staffs);
    } catch (error) {
      next(error);
    }
  },

  async updateStaff(req, res, next){
    const {id} = req.params;
    const payload = req.body;
    try {
      const updatedStaff = await StaffService.updateStaffInfo(id, payload);
      return res.status(200).json(updatedStaff);
    } catch (error) {
      next(error);
    }
  },

  async deleteStaff(req, res, next){
    const {id} = req.params;
    try {
      await StaffService.deleteStaff(id);
      return res.status(200).json({message: 'Xóa thành công'});
    } catch (error) {
      next(error);
    }
  }
};

module.exports = staffController;
