const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authentication = require('../middleware/authentication');
const auth = require('../middleware/auth');

router.route('/')
    .get(auth.adminOnly, userController.getAllUsers)
    .post(userController.register)
    .patch(authentication, userController.changePassword)

router.route('/infor')
    .get(auth.loginRequired, userController.getUser)
    .put(auth.loginRequired, userController.updateUserInfo)

router.route('/login')
    .post(userController.login);

router.route('/cart')
   .get(auth.loginRequired, userController.getUserCart)
    .post(auth.loginRequired, userController.addCart)
    .patch(auth.loginRequired, userController.updateQuantityInCart)

router.route('/cart/books/:id')
    .delete(auth.loginRequired, userController.removeBookCart)


module.exports = router;
