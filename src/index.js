const express = require("express");
const app = express();
const cors = require("cors");
const userRoute = require("./app/modules/user/user.route");
const otpRoute = require("./app/modules/otp/otp.route");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from api");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/otp", otpRoute);

module.exports = app;
