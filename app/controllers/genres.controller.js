const genresService = require('../services/genres.service')

const genresController ={

  async getAllGenres(req, res, next){
    const {search, order} = req.query;
    try {
      if(search){
        const genres = await genresService.getGenresByName(search, order);
        return res.status(200).json(genres);
      }
      const genres = await genresService.getAllGenres(order);
      return res.status(200).json(genres);
    } catch (error) {
      next(error);
    }
  },


  async createNewGenres(req, res, next){
    const newGrenresInfo = req.body;
    try {
      const newGenres = await genresService.createNewGenres(newGrenresInfo);
      return res.status(200).json(newGenres);
    } catch (error) {
      next(error);
    }
  },

  async deleteGenre(req, res, next){
    const {id} = req.params;
    try {
      await genresService.deleteGenreById(id);

      return res.status(200).json({message: "Xóa thành công"});
    } catch (error) {
      console.log(error);
      next(error);
    }
  },


  async updateGenre(req, res, next){
    const {id} = req.params;
    const payload = req.body;
    try {
      await genresService.updateGenreById(id, payload);
      return res.status(200).json({message: "Cập nhật thành công"});
    } catch (error) {
      next(error);
    }
  },

}

module.exports = genresController;