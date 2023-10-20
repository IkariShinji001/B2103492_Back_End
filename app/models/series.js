const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeriesSchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
  },
  books: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  publisher: String,
  image: {
    type: String,
    default:
      'https://image.slidesdocs.com/responsive-images/docs/poster-white-and-blue-business-report-cover-word-template_82f5de071f__max.jpg',
  },
  followerCount: { type: Number, default: 0 },
  userFollower: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Series = mongoose.model('Series', SeriesSchema);

module.exports = Series;
