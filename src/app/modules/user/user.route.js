const {
  createUser,
  findIsUserExists,
  loginUser,
} = require("./user.controller");

const router = require("express").Router();

router.post("/create-user", createUser);
router.post("/login-user", loginUser);
router.post("/user-exists", findIsUserExists);

module.exports = router;
