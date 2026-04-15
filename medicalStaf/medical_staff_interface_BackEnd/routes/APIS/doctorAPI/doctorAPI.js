const express = require("express");
const router = express.Router();
const verifymedicalStaffExist = require("../../../middleware/verifymedicalStaffExist");
const display_image_doctors = require("../../../controllers/medicalStaffController");

router.use("/:idM", verifymedicalStaffExist("doctors"));

router.use("/:idM/absences", require("./absenceAPI"));

router.use("/:idM/tasks", require("./taskAPI"));

// display one image in nurse id
router.route("/:idM/image").get(display_image_doctors);

router
  .route("/:idM")
  // get one doctor by id
  .get((req, res) => {
    res.status(200).json(req.medicalStaff);
  });

module.exports = router;
