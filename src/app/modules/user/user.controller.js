const { startSession } = require("mongoose");
const catchAsync = require("../../utils/catchAsync");
const generateOTP = require("../../utils/generateOTP");
const generateToken = require("../../utils/generateToken");
const sendMail = require("../../utils/sendMail");
const OTP = require("../otp/otp.model");
const User = require("./user.model");
const bcrypt = require("bcrypt");

// Create user into db
module.exports.createUser = catchAsync(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password should be matched",
    });
  }

  //   check is user already exists
  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    return res.status(400).json({
      success: false,
      message: "User Already exists",
    });
  }

  const user = await User.create({ username, email, password });

  //   create token
  const token = generateToken(
    { email: user.email },
    process.env.JWT_ACCESS_TOKEN,
    "2d"
  );

  res.status(200).json({
    success: true,
    message: "User created successfully",
    data: { token },
  });
});

// login user
module.exports.loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // check is user exist in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // check is password match
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(404).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  //   create token
  const token = generateToken(
    { email: user.email },
    process.env.JWT_ACCESS_TOKEN,
    "2d"
  );

  res.status(200).json({
    success: true,
    message: "login successful",
    data: { token },
  });
});

// Find is user exist in the database
module.exports.findIsUserExists = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const user = await User.findOne({ email });

  if (user) {
    return res.status(200).json({
      success: true,
      message: "User found successfully",
      data: { isUser: true, email },
    });
  }

  const otp = generateOTP();

  //   start session
  const session = await startSession();
  session.startTransaction();
  try {
    const payload = {
      to: email,
      subject: "E-learning OTP",
      text: `Your E-learning Verification Code is ${otp}. \n This code will expire in 5 minutes.`,
    };

    // sent email
    const emailSent = await sendMail(payload);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again later.",
      });
    }

    // save otp to database
    await OTP.create({ email, otp });

    // commit session
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "OTP sent to user email",
      data: { isUser: false, email },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
  }
});
