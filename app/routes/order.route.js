const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OrderController = require('../controllers/order.controller');

router.route('/')
    .post(auth.loginRequired ,OrderController.createNewOrder)
    .get(auth.employee, OrderController.getAllOrder);

router.route('/approve/:id')
    .put(auth.employee, OrderController.approveOrder)
module.exports = router;
