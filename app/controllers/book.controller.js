const BookService = require('../services/book.service');
const ApiError = require('../api-error');

const bookController = {
  async createNewBook(req, res, next) {
    const newBookInfor = req.body;
    try {
      const bookService = new BookService();
      const newBook = await bookService.createNewBook(newBookInfor);
      return res.status(201).json(newBook);
    } catch (error) {
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      console.log(error);
      return res.status(500).json({ message: 'Lỗi không xác định' });
    }
  },

  async createBookImage(req, res, next){
    const cloudinary_secure_url= req.cloudinary_secure_url;
    const bookId = req.params.id;
    try{
      const bookService = new BookService();
      const newImageUrl = await bookService.createNewImage(bookId, cloudinary_secure_url);
      return res.status(201).json({newImageUrl});
    }catch(error){
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      console.log(error);
      return res.status(500).json({ message: 'Lỗi không xác định' });
    }
  },

  async deleteBookImage(req, res, next){
    const publicId = req.params.publicId;
    const bookId = req.params.id;
    try{
      const bookService = new BookService();
      await bookService.deleteImage(bookId, publicId);
      return res.status(200).json({message: 'Đã xóa ảnh thàng công'});
    }catch(error){
      if (error instanceof ApiError) {
        return next(new ApiError(error.statusCode, error.message));
      }
      console.log(error);
      return res.status(500).json({ message: 'Lỗi không xác định' });
    }
  }
};

module.exports = bookController;
