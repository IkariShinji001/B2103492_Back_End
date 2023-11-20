const InventoryService = require('../services/inventory.service');

class InventoryController {
  async addInventory(req, res, next) {
    try {
      const inventory = req.body;
      const staffId = req.user._id;
      await InventoryService.addInventory(inventory, staffId);
      return res.status(200).json({ message: 'Thêm nhập kho thành công' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InventoryController();
