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
    try {
      const { genres, search, lowestPrice, highestPrice, limit, page, sortName, sortDate } = req.query;
      const books = await bookService.getBooksByFilters(
        genres,
        search,
        lowestPrice,
        highestPrice,
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


  async getBookNotInSeries(req, res, next){
    try {
      const books = await bookService.getBookNotInSeries();
      return res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  },

  async getRating(req, res, next){
    const {id} = req.params;
    try {
      const rating = await bookService.getRating(id);
      return res.status(200).json(rating);
    } catch (error) {
      next(error);
    }
  },

  async newRating(req, res, next) {
    const { id } = req.params;
    const userId = req.user._id;
    const { star, comment } = req.body;
    try {
      await bookService.ratingBook(id, userId, star, comment);
      return res.status(200).json({ message: 'Đã đánh giá sách thành công' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = bookController;
