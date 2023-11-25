const router = require("express").Router();
const {
  register,
  resendOTP,
  verifyOTP,
  changePassword,
} = require("../controllers/auth.controllers");

router.post("/register", register);
router.get("/resend-otp", resendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/change-password", changePassword);

module.exports = router;
