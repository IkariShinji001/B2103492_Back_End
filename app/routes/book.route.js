const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const upload = require('../middleware/multer');
const auth = require('../middleware/auth');

router.route('/')
    .get(bookController.getAllBook)
    .post(upload.array('images', 15), bookController.createNewBook);

router.route('/count')
    .get(bookController.getBookCount);

router.route('/:id/rating')
    .get(bookController.getRating)
    .post(auth.loginRequired ,bookController.newRating);

router.route('/not-in-series')
    .get(bookController.getBookNotInSeries)
router.route('/:id')
    .get(bookController.getBookById)
    .put(auth.employee ,bookController.updateBook)
    .delete(auth.adminOnly, bookController.deleteBook)

router.route('/:id/images')
    .patch(auth.employee, upload.array('images', 15), bookController.createBookImage);

router.route('/:id/is-in-bussiness')
    .patch(auth.adminOnly ,bookController.updateIsInBussiness);
    
router.route('/:id/images/:publicId')
    .delete(bookController.deleteBookImage);


module.exports = router;
