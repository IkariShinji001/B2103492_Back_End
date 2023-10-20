const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SeriesController = require('../controllers/series.controller');
const upload = require('../middleware/multer')
const uploadSingleImageCoudinary = require('../middleware/uploadImage')


router.route('/')
    .get(SeriesController.getSeries)
    .post(auth.employee, upload.single('image'), uploadSingleImageCoudinary, SeriesController.createNewSeries)

router.route('/:id')
    .get(SeriesController.getBooksSeries)
    .put(upload.array('image', 1) ,SeriesController.updateSeries)
    .delete(SeriesController.deleteSeries)


router.route('/:id/books')
    .patch(SeriesController.updateBookToSeries)

router.route('/:id/users')
    .post(SeriesController.FollowSeries)
    .delete(SeriesController.unfollowSeries)


module.exports = router;

