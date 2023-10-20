const BookService = require('../services/book.service');
const ApiError = require('../api-error');
const bookService = new BookService();

const bookController = {
  async createNewBook(req, res, next) {
    let newBookInfo = req.body;
    const images = req.files;

    for (const key in newBookInfo) {
      if (
        newBookInfo[key] === undefined ||
        newBookInfo[key] === '' ||
        newBookInfo[key] === 'undefined'
      ) {
        delete newBookInfo[key];
      }
    }
    if (newBookInfo.genres) {
      newBookInfo.genres = newBookInfo.genres.split(',');
    }

    try {
      const newBook = await bookService.createNewBook(newBookInfo, images);
      return res.status(201).json(newBook);
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      next(error);
    }
  },

  async createBookImage(req, res, next) {
    const bookId = req.params.id;
    const images = req.files;
    try {
      const newImageUrl = await bookService.createNewImage(bookId, images);
      return res.status(201).json(newImageUrl);
    } catch (error) {
      next(error);
    }
  },

  async getBookById(req, res, next) {
    const { id } = req.params;

    try {
      const book = await bookService.getBookById(id);
      return res.status(200).json(book);
    } catch (error) {
      next(error);
    }
  },

  async deleteBook(req, res, next) {
    const { id } = req.params;
    try {
      await bookService.deleteBook(id);
      return res.status(200).json({ message: 'Đã xóa sách thành công' });
    } catch (error) {
      next(error);
    }
  },

  async deleteBookImage(req, res, next) {
    const publicId = req.params.publicId;
    const bookId = req.params.id;
    try {
      await bookService.deleteImage(bookId, publicId);
      return res.status(200).json({ message: 'Đã xóa ảnh thàng công' });
    } catch (error) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      next(error);
    }
  },

  async updateBook(req, res, next) {
    const updateData = req.body;
    const { id } = req.params;

    try {
      await bookService.updateBookInfor(id, updateData);

      return res.status(200).json({ message: 'Cập nhật thành công' });
    } catch (error) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      next(error);
    }
  },

  async getAllBook(req, res, next) {
    const { search } = req.query;
    const { page, limit, sortName, sortDate } = req.query || null;
    try {
      if (search) {
        const books = await bookService.getBooksByName(
          search,
          limit,
          page,
          sortName,
          sortDate
        );
        return res.status(200).json(books);
      }
      const books = await bookService.getAllBook(
        limit,
        page,
        sortName,
        sortDate
      );
      res.status(200).json(books);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  async getBookCount(req, res, next) {
    try {
      const count = await bookService.getBookCount();
      return res.status(200).json(count);
    } catch (error) {
      next(error);
    }
  },

  async updateIsInBussiness(req, res, next) {
    const { id } = req.params;
    const { state } = req.body;
    try {
      await bookService.updateIsInBussiness(id, state);
      return res.status(200).json('Cập nhật thành công');
    } catch (error) {
      console.log(error);
      next(error);
    }
  },


  async getAllInventoryHistory(req, res, next){
    const {sortDate} = req.query;
    try {
      const inventoryHistory = await bookService.getAllInventoryHistory(sortDate);
      return res.status(200).json(inventoryHistory);
    } catch (error) {
      next(error);
    }
  },

  async getInventoryHistoryById(req, res, next){
    const {id} = req.params;
    try {
      const inventoryHistory = await bookService.getInventoryHistoryById(id);

      return res.status(200).json(inventoryHistory);
    } catch (error) {
      next(error);
    }
  },

  async updateInventoryBook(req, res, next){
    const {id} = req.params;
    const payload = req.body;
    payload.staffID = req.user.staffID;
    console.log(req.user);
    console.log(payload);
    try {
      const book = await bookService.updateInventoryBook(id, payload);
      return res.status(200).json(book);
    } catch (error) {
      next(error);
    }
  },

  async getBookNotInSeries(req, res, next){
    try {
      const books = await bookService.getBookNotInSeries();
      return res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = bookController;
