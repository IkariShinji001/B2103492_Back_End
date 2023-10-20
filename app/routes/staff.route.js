const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const auth = require('../middleware/auth')

router.route('/')
  .get(auth.adminOnly, staffController.getAll)
  .post(auth.adminOnly, staffController.registerNewStaff);

router.route('/login')
  .post(staffController.login);


module.exports = router;
