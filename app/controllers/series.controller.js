const SeriesService = require('../services/series.service');

class SeriesController {
  async createNewSeries(req, res, next) {
    const newSeriesInfor = req.body;
    newSeriesInfor.image = req.cloudinary_secure_url;
    try {
      const newSeries = await SeriesService.createSeries(newSeriesInfor);
      return res.status(200).json(newSeries);
    } catch (error) {
      next(error);
    }
  }

  async getSeries(req, res, next) {
    const { search } = req.query || null;
    try {
      if (search) {
        const series = await SeriesService.getSeriesByName(search);
        return res.status(200).json(series);
      }
      const series = await SeriesService.getAllSeries();
      return res.status(200).json(series);
    } catch (error) {
      next(error);
    }
  }

  async addBookToSeries(req, res, next) {
    const { bookId } = req.body;
    const seriesId = req.params.id;
    try {
      await SeriesService.addBookToSeries(bookId, seriesId);
      return res
        .status(200)
        .json({ message: 'Thêm sách vào series thành công' });
    } catch (error) {
      next(error);
    }
  }

  async getBooksSeries(req, res, next){
    const seriesId = req.params.id;
    try {
      const books = await SeriesService.getAllBookSeries(seriesId);
      res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  }

  async updateSeries(req, res, next){
    console.log("dasd");
    const {id} = req.params;
    const image = req.files || null;
    const payload = req.body;
    console.log(image);
    if(image.length !== 0){
      payload.image = image;
    }
    try {
      const updatedSeries = await SeriesService.updateSeries(id, payload);
      return res.status(200).json(updatedSeries);
    } catch (error) {
      next(error);
    }
  }

  async FollowSeries(req, res, next){
    const seriesId = req.params.id;
    const {userId} = req.body;
    try {
      await SeriesService.followSeries(seriesId, userId);
      return res.status(200).json({message: 'Theo dõi series sách thành công'});
    } catch (error) {
      next(error);
    }
  }

  async unfollowSeries(req, res, next){
    const seriesId = req.params.id;
    const {userId} = req.body;
    try {
      await SeriesService.unfollowerSeries(seriesId, userId);
      return res.status(200).json({message: 'Hủy theo dõi sách thành công'});
    } catch (error) {
      next(error);
    }
  }


  async deleteSeries(req, res, next){
    const {id} = req.params;

    try {
      await SeriesService.deleteSeries(id);

      return res.status(200).json({message: 'Đã xóa bộ sách thành công'});
    } catch (error) {
      next(error);
    }
  }


  async updateBookToSeries(req, res, next){
    const {id} = req.params;
    const payload = req.body;
    try {

      if(payload.action === 'add'){
        const book = await SeriesService.addBookToSeries(id, payload);
        return res.status(200).json(book);
      }else if(payload.action === 'pull'){
        const book = await SeriesService.pullBookOutSeries(id, payload);
        return res.status(200).json(book);
      }
      return res.status(400).json({message: 'Không gửi hành động'});
    } catch (error) {
      next(error);      
    }
  }
}

module.exports = new SeriesController();
