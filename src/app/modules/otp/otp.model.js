const { Schema, model } = require("mongoose");

const otpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expires: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

otpSchema.index({ expires: 1 }, { expireAfterSeconds: 300000 });

const OTP = model("otp", otpSchema);

module.exports = OTP;
