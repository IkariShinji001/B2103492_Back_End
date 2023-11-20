const Order = require('../models/order');
const Book = require('../models/book');
const User = require('../models/user');
const ApiError = require('../api-error');
const SendMail = require('../nodemailer/sendMail');
const getMailTemplates = require('../nodemailer/getMailTemplates');
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
    payload.orderPrice += parseInt(payload.feeShipment);

    const newOrder = new Order(payload);

    await newOrder.save();

    for (let i = 0; i < bookStatuses.length; i++) {
      const { bookId, newQuantity } = bookStatuses[i];
      await Book.findByIdAndUpdate(bookId, { quantity: newQuantity });
    }

    const populatedOrder = await Order.findById(newOrder._id)
      .populate({
        path: 'books.book',
        select: 'name volume discountPrice quantity',
      })
      .populate({
        path: 'user',
        select: 'email',
      })
      .exec();

    const sendMail = new SendMail();

    await sendMail.sendMail(
      populatedOrder.user.email,
      'Đặt hàng',
      getMailTemplates.orderConfirmationTemplate(
        populatedOrder.userReceive,
        populatedOrder.books,
        populatedOrder.orderPrice,
        populatedOrder.deliveryDate,
        populatedOrder.orderDate
      )
    );

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
      .sort({ createdAt: -1 });

    console.log(orders);
    return orders;
  }

  async getUserOrders(userId, id) {
    if (id) {
      const orders = await Order.find({ user: userId, _id: id })
        .populate({
          path: 'user',
          select: 'username fullName email address phoneNumber',
        })
        .populate({
          path: 'books.book',
          select: 'name volume quantity discountPrice images',
        })
        .sort({ createdAt: -1 });
      return orders;
    }

    const orders = await Order.find({ user: userId })
      .populate({
        path: 'user',
        select: 'username fullName email address phoneNumber',
      })
      .populate({
        path: 'books.book',
        select: 'name volume quantity discountPrice images',
      })
      .sort({ createdAt: -1 });
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

  async cancelOrder(id) {
    const statusDilivery = 'Hoàn hàng';
    const approveOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status: 'Hủy đơn hàng', statusDilivery } },
      { returnDocument: 'after' }
    );

    for (let i = 0; i < approveOrder.books.length; i++) {
      const bookId = approveOrder.books[i].book;
      const quantity = approveOrder.books[i].quantity;

      const book = await Book.findById(bookId);

      const updatedQuantity = book.quantity + quantity;

      await Book.findByIdAndUpdate(bookId, {
        $set: { quantity: updatedQuantity },
      });
    }

    const notification = {
      title: 'Thông báo đơn đặt hàng',
      message: `Trạng thái đơn hàng ${approveOrder._id} đã được cập nhật thành Hủy đơn hàng.`,
      isRead: false,
    };

    await User.findByIdAndUpdate(approveOrder.user, {
      $push: { notification },
    });
    return approveOrder;
  }

  async isBoughtOrder(userId, bookId) {
    const isBought = await Order.find({ user: userId, 'books.book': bookId });
    if (isBought.length > 0) {
      return true;
    }
    return false;
  }

  async updateDiliveryStatusByUser(id) {
    const updatedOrder = await Order.findByIdAndUpdate(id, {
      $set: { statusDilivery: 'Đã nhận đơn hàng' },
    });
    return updatedOrder;
  }

  async calculateBookRevenueStatistics() {
    const pipeline = [
      {
        $match: {
          statusDilivery: 'Đã nhận đơn hàng',
        },
      },
      {
        $unwind: '$books',
      },
      {
        $lookup: {
          from: 'books', 
          localField: 'books.book',
          foreignField: '_id',
          as: 'bookInfo',
        },
      },
      {
        $unwind: '$bookInfo',
      },
      {
        $group: {
          _id: '$books.book',
          totalRevenue: {
            $sum: { $multiply: ['$books.quantity', '$bookInfo.discountPrice'] },
          },
          totalQuantity: { $sum: '$books.quantity' },
          bookName: { $first: '$bookInfo.name' },
          bookVolume: { $first: '$bookInfo.volume' },
          images: { $first: '$bookInfo.images' }
        },
      },
      {
        $project: {
          _id: 1,
          totalRevenue: 1,
          totalQuantity: 1,
          bookName: 1,
          bookVolume: 1,
          images: 1
        },
      },
    ];

    const result = await Order.aggregate(pipeline);

    return result;
  }
}

module.exports = new OrderService();
