const jwt = require("jsonwebtoken");

const generateToken = (payload, accessToken, expiresIn) => {
  return jwt.sign(payload, accessToken, {
    expiresIn,
  });
};

module.exports = generateToken;
