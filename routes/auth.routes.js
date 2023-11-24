const router = require('express').Router();
const { register, resendOTP, verifyOTP, changePassword, login } = require('../controllers/auth.controllers');

router.post('/register', register);
router.post('/resend-otp', resendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/change-password', changePassword);

module.exports = router;
