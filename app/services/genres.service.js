const Genres = require('../models/genres');
const Books = require('../models/book');

class GenresService {
  async getAllGenres(order) {
    const genres = await Genres.find({}).sort({ type: order });
    return genres;
  }

  async getGenresByName(type, order) {
    const genres = await Genres.find({
      type: { $regex: new RegExp(type), $options: 'i' },
    }).sort({ type: order });
    return genres;
  }

  async createNewGenres(newGenresInfo) {
    const newGenres = new Genres(newGenresInfo);
    newGenres.save();
    return newGenres;
  }

  async deleteGenreById(id) {
    const res = await Genres.findByIdAndDelete(id);

    const books = await Books.find({ genres: res._id });

    for (const book of books) {
      book.genres.pull(res._id);
      await book.save();
    }
  }

  async updateGenreById(id, payload){
    await Genres.findByIdAndUpdate(id, {$set: payload });
  }
}

module.exports = new GenresService();
