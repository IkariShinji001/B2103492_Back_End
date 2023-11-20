const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.route('/verify-email')
    .get(authController.verifyEmail);

router.route('/verify/refresh-token')
    .post(authController.verifyRefreshToken);

router.route('/verify/access-token')
    .get(authController.verifyAccessToken);

router.route('/sign-out')
    .get(authController.signOut);

router.route('/verify-forget-password')
    .post(authController.verifyForgetPassword);

router.route('/reset-password')
    .post(authController.resetPassword);
module.exports = router;
