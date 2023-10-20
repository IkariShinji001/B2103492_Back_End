const Series = require('../models/series');
const Books = require('../models/book');
const ApiError = require('../api-error');
const getImageIdFromSecureUrl = require('../helper/cloudinary/getImageIdFromSecureUrl');
const deleteCloudinaryImage = require('../helper/cloudinary/deleteCloudinaryImage');
const uploadArrayImageCloudinary = require('../helper/cloudinary/uploadArrayImageCloudinary');

class SeriesService {
  async getAllSeries() {
    const series = await Series.find({});
    return series;
  }

  async getSeriesByName(name) {
    name = new RegExp(name, 'i');
    const series = await Series.find({ name: { $regex: name } });
    return series;
  }

  async createSeries(newSeriesInfor) {
    const existedSeries = await Series.findOne({ name: newSeriesInfor.name });

    if (existedSeries) {
      const id = getImageIdFromSecureUrl(newSeriesInfor.image);
      await deleteCloudinaryImage(id);
      throw new ApiError(400, 'Đã tồn tại series này');
    }

    newSeriesInfor.followerCount = 0;

    const newSeries = new Series(newSeriesInfor);
    await newSeries.save();
    return newSeries;
  }

  async updateSeries(id, payload) {
    if (payload.image) {
      const uploadImage = await uploadArrayImageCloudinary(payload.image);
      payload.image = uploadImage[0];
      const oldSeries = await Series.findById(id);
      const publicId = getImageIdFromSecureUrl(oldSeries.image);
      await deleteCloudinaryImage(publicId);
      const series = await Series.findByIdAndUpdate(
        id,
        { $set: payload },
        { returnDocument: 'after' }
      );
      return series;
    }

    const series = await Series.findByIdAndUpdate(
      id,
      { $set: payload },
      { returnDocument: 'after' }
    );
    return series;
  }

  async getAllBookSeries(seriesId) {
    const series = await Series.findById(seriesId).populate('books');
    return series;
  }

  async followSeries(seriesId, userId) {
    const existedFollower = await Series.findOne({ userFollower: userId });
    if (existedFollower) {
      throw new ApiError(400, 'Đang theo dõi series này rồi');
    }
    await Series.findByIdAndUpdate(seriesId, {
      $push: { userFollower: userId },
    });
  }

  async unfollowerSeries(seriesId, userId) {
    const existedFollower = await Series.findOne({ userFollower: userId });
    if (!existedFollower) {
      throw new ApiError(400, 'Chưa theo dõi series này!');
    }
    await Series.findByIdAndUpdate(seriesId, {
      $pull: { userFollower: userId },
    });
  }

  async deleteSeries(seriesId) {
    const deletedSeries = await Series.findByIdAndDelete(seriesId);

    const publicId = getImageIdFromSecureUrl(deletedSeries.image);
    await deleteCloudinaryImage(publicId);
    await Books.updateMany(
      { series: deletedSeries._id },
      { $set: { series: null } }
    );
  }

  async addBookToSeries(id, payload) {
    const series = await Series.findByIdAndUpdate(id, {
      $push: { books: payload.bookId },
    });
    await Books.findByIdAndUpdate(payload.bookId, {
      $set: { series: series._id },
    });
  }

  async pullBookOutSeries(id, payload) {
    await Series.findByIdAndUpdate(id, { $pull: { books: payload.bookId } });
    await Books.findByIdAndUpdate(payload.bookId, { $set: { series: null } });
  }
}

module.exports = new SeriesService();
