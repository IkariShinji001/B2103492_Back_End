const express = require('express');
const router = express.Router();
const genresController = require('../controllers/genres.controller')


router.route('/')
    .get(genresController.getAllGenres)
    .post(genresController.createNewGenres)

router.route('/:id')
    .put(genresController.updateGenre)
    .delete(genresController.deleteGenre);

module.exports = router;