const router = require("express").Router();
const {
  register,
  resendOTP,
  verifyOTP,
  changePassword,
  login,
  forrgotPassword,
  verifyOtpForrgotPassword,
  resendOtpPassword,
  resetPasswordRequest,
  resetPassword,
} = require("../controllers/auth.controllers");
const { restrict } = require("../middlewares/auth.middlewares");

router.post("/register", register);
router.get("/resend-otp", resendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/resend-otp-password", resendOtpPassword);
router.post("/forrgot-password", forrgotPassword);
router.post("/verify-otp-password", verifyOtpForrgotPassword);
router.post("/change-password", changePassword);
router.post("/reset-password-request", resetPasswordRequest);
router.post("/reset-password", resetPassword);

module.exports = router;
