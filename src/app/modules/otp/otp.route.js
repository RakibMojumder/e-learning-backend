const { verifyOtp } = require("./otp.controller");

const router = require("express").Router();

router.post("/verify-otp", verifyOtp);

module.exports = router;
