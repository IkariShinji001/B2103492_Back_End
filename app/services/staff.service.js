const Staff = require('../models/staff');
const ApiError = require('../api-error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/index');
const { v4: uuidv4 } = require('uuid');
const SendMail = require('../nodemailer/sendMail');
const getMailTemplate = require('../nodemailer/getMailTemplates');
const generatePassword = require('../helper/generatePassword');

class StaffService {
  async login(staffID, password) {
    const staff = await Staff.findOne({
      $or: [
        { staffID: staffID },
        { email: staffID }
      ]
    });

    if (!staff) {
      throw new ApiError(400, 'Tài khoản không tồn tại');
    }

    const isMatchPassword = await bcrypt.compare(password, staff.password);

    if (!isMatchPassword) {
      throw new ApiError(400, 'Sai tên tài khoản hoặc mật khẩu');
    }

    const access_token = jwt.sign(
      {
        staffID: staffID,
        role: staff.role,
        _id: staff._id.toString(),
      },
      config.jwt.secret_key,
      { expiresIn: '4h' }
    );

    const refresh_token = jwt.sign({ id: uuidv4() }, config.jwt.secret_key, {
      expiresIn: '1d',
    });

    return { success: true, access_token, refresh_token, role: staff.role };
  }

  async registerNewStaff(staffInfor) {
    staffInfor.staffID = uuidv4().substr(0, 7).toUpperCase();
    const isStaffExisted = await Staff.findOne({ staffID: staffInfor.staffID  });
    if (isStaffExisted) {
      throw new ApiError(400, 'Đã tồn tại nhân viên này');
    }

    const isEmailExisted = await Staff.findOne({ email: staffInfor.email });

    if (isEmailExisted) {
      throw new ApiError(400, 'Đã tồn email này');
    }
    const password = generatePassword(8, true, true, false);
    staffInfor.password = password;
    staffInfor.password = await bcrypt.hash(staffInfor.password, 10);
    const payload = {
      staffID: staffInfor.staffID,
      password,
    };

    const sendMail = new SendMail();
    await sendMail.sendMail(
      staffInfor.email,
      'Tài khoản nhân viên Thế giới tiểu thuyêt',
      getMailTemplate.staffRegister(payload)
    );

    const newStaff = new Staff(staffInfor);
    await newStaff.save();

    return { success: true, newStaff };
  }

  async getAll() {
    const staffs = await Staff.find({}, { password: 0 }).sort({fullName: 1});
    return staffs;
  }

  async getStaffByFullNameOrStaffId(search) {
    const staffs = await Staff.find(
      {
        $or: [
          { fullName: { $regex: new RegExp(search, 'i') } },
          { staffID: { $regex: new RegExp(search, 'i') } },
        ],
      },
      { password: 0 }
    ).sort({fullName: 1});
    return staffs;
  }

  async updateStaffInfo(id, payload){
    const updatedStaff = await Staff.findByIdAndUpdate(id, {$set: payload}, {returnDocument: 'after'});
    return updatedStaff;
  }

  async deleteStaff(id){
    await Staff.findByIdAndDelete(id);
  }
}

module.exports = new StaffService();
