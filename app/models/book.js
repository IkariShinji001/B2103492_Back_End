const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  star: {
    type: Number,
    min: 1,
    max: 5,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bookSchema = new Schema({
  name: String,
  volume: Number,
  bookCover: {
    type: String,
    enum: ['Cứng', 'Mềm'],
  },
  series: {
    type: Schema.Types.ObjectId, ref: 'Series',
    default: null
  },
  author: String,
  numberOfPages: Number,
  weight: String,
  price: Number,
  discount: Number,
  discountPrice: Number,
  review: [reviewSchema],
  promotions: [String],
  limited: Boolean,
  age: Number,
  summarize: String,
  genres: [{ type: Schema.Types.ObjectId, ref: 'Genres' }],
  images: [String],
  quantity:{type: Number, default: 0},
  isInBussiness: {type: Boolean, default: true},
  createdAt: { type: Date, default: Date.now },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
