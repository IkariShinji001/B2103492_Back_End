const express = require('express');
const router = express.Router();
const genresController = require('../controllers/genres.controller')
const auth = require('../middleware/auth')


router.route('/')
    .get(genresController.getAllGenres)
    .post(auth.employee, genresController.createNewGenres)

router.route('/:id')
    .put(auth.employee, genresController.updateGenre)
    .delete(auth.employee, genresController.deleteGenre);

module.exports = router;