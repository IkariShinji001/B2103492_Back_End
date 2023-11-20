const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OrderController = require('../controllers/order.controller');

router.route('/')
    .post(auth.loginRequired ,OrderController.createNewOrder)
    .get(auth.employee, OrderController.getAllOrder);

router.route('/user')
    .get(auth.loginRequired, OrderController.getUserOrders)

router.route('/status-dilivery/:id')
    .patch(auth.loginRequired, OrderController.updateDiliveryStatusByUser)

router.route('/approve/:id')
    .patch(auth.loginRequired, OrderController.approveOrder)

router.route('/cancel/:id')
    .patch(auth.loginRequired, OrderController.cancelOrder)

router.route('/is-bought/books/:id')
    .get(auth.loginRequired, OrderController.isBoughtOrder)

router.route('/revenue')
    .get(auth.adminOnly, OrderController.calculateBookRevenueStatistics)
module.exports = router;
