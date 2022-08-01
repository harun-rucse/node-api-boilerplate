const express = require('express');
const authController = require('../controllers/auth-controller');
const { protect } = require('../middlewares/auth-middleware');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:resetToken', authController.resetPassword);
router.get('/verify-email/:token', authController.vefiryEmail);

router.patch('/update-password', protect, authController.updatePassword);

module.exports = router;
