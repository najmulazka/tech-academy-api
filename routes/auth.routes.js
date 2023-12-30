const router = require("express").Router();
const {
  register,
  sendOtp,
  resendOTP,
  verifyOTP,
  login,
  forrgotPassword,
  verifyOtpForrgotPassword,
  resendOtpPassword,
  resetPassword,
  loginAdmin,
} = require("../controllers/auth.controllers");
const emailValidation = require('../middlewares/validationEmail.middlewares')

router.post("/register", emailValidation, register);
router.post("/send-otp", emailValidation, sendOtp);
router.get("/resend-otp", resendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login-admin", loginAdmin);
router.post("/login", login);

router.get("/resend-otp-password", resendOtpPassword);
router.post("/forrgot-password", forrgotPassword);
router.post("/verify-otp-password", verifyOtpForrgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
