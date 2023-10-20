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
    
router.route('/inventory')
    .get(bookController.getAllInventoryHistory)

router.route('/not-in-series')
    .get(bookController.getBookNotInSeries)
router.route('/:id')
    .get(bookController.getBookById)
    .put(bookController.updateBook)
    .delete(bookController.deleteBook)

router.route('/:id/inventory')
    .get(auth.employee, bookController.getInventoryHistoryById)
    .put(auth.employee ,bookController.updateInventoryBook);

router.route('/:id/images')
    .patch(upload.array('images', 15), bookController.createBookImage);

router.route('/:id/is-in-bussiness')
    .patch(bookController.updateIsInBussiness);
    
router.route('/:id/images/:publicId')
    .delete(bookController.deleteBookImage);


module.exports = router;
