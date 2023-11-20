const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventory.controller');
const auth = require('../middleware/auth');

router.route('/')
    .post(auth.employee, InventoryController.addInventory);

module.exports = router;