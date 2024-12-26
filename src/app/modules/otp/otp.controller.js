const catchAsync = require("../../utils/catchAsync");
const OTP = require("./otp.model");

module.exports.verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const otpEntry = await OTP.findOne({ email, otp });
  if (!otpEntry) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  }

  // Delete OTP after successful verification
  await OTP.deleteOne({ _id: otpEntry._id });
  return res
    .status(200)
    .json({ success: true, message: "OTP verified successfully" });
});
