const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  books: [{
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
    quantity: Number,
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
  },
  status: {
    type: String,
    enum: ['Chờ xác nhận', 'Đã xác nhận', 'Không xác nhận'],
    default: 'Chờ xác nhận',
  },
  orderPrice: Number,
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
