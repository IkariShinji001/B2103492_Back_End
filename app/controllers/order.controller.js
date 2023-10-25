const OrderService = require('../services/order.service')

class OrderController{
  async createNewOrder(req, res, next){
    const userId = req.user;
    const payload = req.body; 
    payload.user = userId._id;


    try {
      const newOrder = await OrderService.createNewOrder(payload);
      return res.status(200).json(newOrder);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrder(req, res, next){
    const {status} = req.query;
    try {
      const orders = await OrderService.getAllOrder({status});
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async approveOrder(req, res, next){
    const {id} = req.params;
    const {status} = req.body;
    const staffId = req.user._id;
    try {
      const approvedOrder = await OrderService.approveOrder(id, status, staffId);
      return res.status(200).json(approvedOrder);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new OrderController();