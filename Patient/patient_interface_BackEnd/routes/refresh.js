const express = require("express");
const router = express.Router();
const { handleRefreshToken } = require("../controller/refreshTokenController");

router
  .route("/token")
  // get One accesstoken by refreshToken
  .get(handleRefreshToken);

module.exports = router;
