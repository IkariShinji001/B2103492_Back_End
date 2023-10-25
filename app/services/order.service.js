const Order = require('../models/order');
const Book = require('../models/book');
const User = require('../models/user');
const ApiError = require('../api-error');
class OrderService {
  async createNewOrder(payload) {
    payload.orderPrice = 0;
    const bookStatuses = [];

    for (let i = 0; i < payload.books.length; i++) {
      let book = await Book.findById(payload.books[i].book, {
        name: 1,
        volume: 1,
        discountPrice: 1,
        quantity: 1,
      });
      if (payload.books[i].quantity > book.quantity) {
        throw new ApiError(
          400,
          `Sách ${book.name} volume ${book.volume} không đủ hàng!`
        );
      }
      payload.orderPrice += book.discountPrice * payload.books[i].quantity;

      bookStatuses.push({
        bookId: book._id,
        newQuantity: book.quantity - payload.books[i].quantity,
      });
    }

    const newOrder = new Order(payload);

    await newOrder.save();

    for (let i = 0; i < bookStatuses.length; i++) {
      const { bookId, newQuantity } = bookStatuses[i];
      await Book.findByIdAndUpdate(bookId, { quantity: newQuantity });
    }

    return newOrder;
  }

  async getAllOrder(status) {
    if (!status.status) {
      status = {};
    }
    const orders = await Order.find(status)
      .populate({
        path: 'user',
        select: 'username fullName email address phoneNumber',
      })
      .populate({
        path: 'books.book',
        select: 'name volume quantity discountPrice',
      })
      .populate({
        path: 'staff',
        select: 'fullName',
      })
      .sort({ createAt: -1 });

    return orders;
  }

  async approveOrder(id, status, staffId) {
    let statusDilivery;
    if (status === 'Chấp nhận đơn hàng') {
      statusDilivery = 'Đang giao hàng';
    }
    const approveOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status, statusDilivery, staff: staffId } },
      { returnDocument: 'after' }
    );

    if (status === 'Từ chối đơn hàng' || status === 'Hủy đơn hàng') {
      for (let i = 0; i < approveOrder.books.length; i++) {
        const bookId = approveOrder.books[i].book;
        const quantity = approveOrder.books[i].quantity;

        const book = await Book.findById(bookId);

        const updatedQuantity = book.quantity + quantity;

        await Book.findByIdAndUpdate(bookId, {
          $set: { quantity: updatedQuantity },
        });
      }
    }
    const notification = {
      title: 'Thông báo đơn đặt hàng',
      message: `Trạng thái đơn hàng ${approveOrder._id} đã được cập nhật thành ${status}.`,
      isRead: false,
    };
    await User.findByIdAndUpdate(approveOrder.user, {
      $push: { notification },
    });
    return approveOrder;
  }
}

module.exports = new OrderService();
