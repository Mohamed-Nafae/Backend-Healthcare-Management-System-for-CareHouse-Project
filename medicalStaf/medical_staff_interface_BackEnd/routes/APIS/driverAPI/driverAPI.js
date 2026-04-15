const express = require("express");
const router = express.Router();
const verifymedicalStaffExist = require("../../../middleware/verifymedicalStaffExist");
const display_image_drivers = require("../../../controllers/medicalStaffController");

router.use("/:idM", verifymedicalStaffExist("drivers"));

router.use("/:idM/absences", require("./absenceAPI"));

router.use("/:idM/tasks", require("./taskAPI"));

// display one image in driver id
router.route("/:idM/image").get(display_image_drivers);

router
  .route("/:idM")
  // get one driver by id
  .get((req, res) => {
    res.status(200).json(req.medicalStaff);
  });

module.exports = router;
