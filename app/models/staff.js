const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  staffID: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  fullName: String,
  email: String,
  address: String,
  role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee',
  },
  phoneNumber: String,
  createdAt: { type: Date, default: Date.now },
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
