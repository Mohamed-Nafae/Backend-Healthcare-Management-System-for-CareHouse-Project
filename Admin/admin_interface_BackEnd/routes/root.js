const express = require("express");
const router = express.Router();
const { handleRefreshToken } = require("../controllers/refreshTokenController");
const {
  handleLogin,
  handleLogout,
} = require("../controllers/login_logoutController");

router.get("/token", handleRefreshToken);

router.post("/login", handleLogin);

router.get("/logout", handleLogout);

router.use(
  "/:id",
  require("../middleware/verifyJWT"),
  require("../middleware/verifyRoles"),
  require("../middleware/verifyAdminExist")
);

router.use("/:id/appointmentTypes", require("./appointmentTypeAPI"));

router.use("/:id/appointments", require("./appointmentAPI"));

router.use("/:id/tasks", require("./taskAPI"));

router.use("/:id/doctors", require("./APIs/doctorAPI/doctorAPI"));

router.use("/:id/nurses", require("./APIs/nurseAPI/nurseAPI"));

//router.use("/:id/drivers", require("./APIs/driverAPI/driverAPI"));

module.exports = router;
