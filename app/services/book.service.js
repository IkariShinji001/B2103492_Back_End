const Book = require('../models/book');
const Series = require('../models/series');
const deleteCloudinaryImage = require('../helper/cloudinary/deleteCloudinaryImage');
const getImageIdFromSecureUrl = require('../helper/cloudinary/getImageIdFromSecureUrl');
const uploadArrayImageCloudinary = require('../helper/cloudinary/uploadArrayImageCloudinary');
const ApiError = require('../api-error');

class BookService {
  async createNewBook(newBookInfor, images) {
    const existedBook = await Book.findOne({
      name: newBookInfor.name,
      volume: newBookInfor.volume,
    });

    if (existedBook) {
      throw new ApiError(400, 'Đã tồn tại quyển sách này');
    }

    // upload ảnh lên cloudinary
    const resultUploadCloudinary = await uploadArrayImageCloudinary(images);
    newBookInfor.images = resultUploadCloudinary;
    newBookInfor.discountPrice =
      newBookInfor.price - (newBookInfor.discount / 100) * newBookInfor.price;

    const newBook = new Book(newBookInfor);
    await newBook.save();

    if (newBook.series) {
      await Series.findByIdAndUpdate(newBook.series, {
        $push: { books: newBook._id },
      });
    }

    return newBook;
  }

  async createNewImage(bookId, images) {
    const resultUploadCloudinary = await uploadArrayImageCloudinary(images);
    console.log(resultUploadCloudinary);
    await Book.findByIdAndUpdate(bookId, {
      $push: { images: resultUploadCloudinary },
    });
    return resultUploadCloudinary;
  }

  async deleteBook(id) {
    const book = await Book.findByIdAndDelete(id);

    for (const url of book.images) {
      const publicId = getImageIdFromSecureUrl(url);
      await deleteCloudinaryImage(publicId);
    }
  }

  async deleteImage(bookId, publicId) {
    const book = await Book.findById(bookId);

    if (!book) {
      throw new ApiError(400, 'Không tồn tại ID sách');
    }

    book.images = book.images.filter((image) => {
      const publicIdDB = getImageIdFromSecureUrl(image);
      return publicIdDB !== publicId;
    });
    await deleteCloudinaryImage(publicId);

    await book.save();
  }

  async updateBookInfor(bookId, updateData) {
    updateData.discountPrice =
      updateData.price - (updateData.discount / 100) * updateData.price;
    const book = await Book.findByIdAndUpdate(bookId, { $set: updateData });
    if (!book) {
      throw new ApiError(400, 'Không tồn tại ID sách');
    }

    if (updateData.series) {
      await Series.findOneAndUpdate(
        { books: bookId },
        { $pull: { books: bookId } },
        { strict: true }
      );

      await Series.findByIdAndUpdate(updateData.series, {
        $push: { books: bookId },
      });
    }
  }

  async getBookById(id) {
    const book = await Book.findById(id).populate('series').populate('genres');
    return book;
  }

  async getBooksByFilters(
    genres,
    search,
    lowestPrice,
    highestPrice,
    limit,
    page,
    sortName,
    sortDate
  ) {
    const query = {};
    if (genres) {
      query.genres = { $in: genres };
    }

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search), $options: 'i' } },
        { volume: Number(search) || '' },
      ];
    }

    if (parseInt(lowestPrice) || parseInt(highestPrice)) {
      console.log('asdasd');
      query.discountPrice = { $gte: lowestPrice, $lte: highestPrice };
    }

    let sortOption;

    if (sortDate) {
      sortOption = {
        createdAt: sortDate,
      };
    } else {
      sortOption = {
        name: sortName,
      };
    }

    const books = await Book.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sortOption);
    return books;
  }

  async getBooksByName(search, limit, page, sortName, sortDate) {
    let sortOption;

    if (sortDate) {
      sortOption = {
        createdAt: sortDate,
      };
    } else {
      sortOption = {
        name: sortName,
      };
    }
    const books = await Book.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { volume: Number(search) || '' },
      ],
    })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sortOption);
    return books;
  }

  async getBookCount() {
    const count = await Book.countDocuments({});
    return count;
  }

  async updateIsInBussiness(id, state) {
    await Book.findByIdAndUpdate(id, { $set: { isInBussiness: state } });
  }

  async getBookNotInSeries() {
    const books = await Book.find(
      { series: null },
      { name: 1, volume: 1, quantity: 1 }
    );

    return books;
  }

  async getRating(id) {

    const book = await Book.findById(id);
    
    let avgRating = 0;

    if(book.review.length > 0) {
      for(let i = 0; i < book.review.length; i++) {
        avgRating += book.review[i].star;
      }
      avgRating = avgRating / book.review.length;
    }

    return {avgRating, numberOfRating: book.review.length};
  }

  async ratingBook(id, userId, star, comment) {
    await Book.findByIdAndUpdate(id, {
      $push: {
        review: {
          userId: userId,
          star,
          comment,
        },
      },
    });
  }
}

module.exports = BookService;
