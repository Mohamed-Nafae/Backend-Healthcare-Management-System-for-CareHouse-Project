const express = require("express");
const router = express.Router();
const verifyRoles = require("../../middleware/verifyRoles");
const {
  handleLogin,
  handleLogout,
} = require("../../controllers/login_logoutController");
const {
  handleRefreshToken,
} = require("../../controllers/refreshTokenController");

// login by email
router.route("/login").post(handleLogin("doctors"));

//logout
router.route("/logout").get(handleLogout("doctors"));

// get One medicalFolder by id
router.route("/token").get(handleRefreshToken("doctors"));

//use the middle ware for verifyJWT access token
router.use(require("../../middleware/verifyJWT"));

// use the middle ware for verify the role of the doctor
router.use(verifyRoles(1954));

router.use(require("./doctorAPI/doctorAPI"));

module.exports = router;
