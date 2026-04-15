const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleLogout,
} = require("../controller/login_logoutController");

router
  .route("/login")
  // login by email
  .post(handleLogin);

//logout
router.route("/logout").get(handleLogout);

module.exports = router;
