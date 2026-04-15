const express = require("express");
const router = express.Router();
const verifymedicalStaffExist = require("../../../middleware/verifymedicalStaffExist");
const display_image_nurses = require("../../../controllers/medicalStaffController");

router.use("/:idM", verifymedicalStaffExist("nurses"));

router.use("/:idM/absences", require("./absenceAPI"));

router.use("/:idM/tasks", require("./taskAPI"));

router.use("/:idM/tasks/:idT/patients", require("./patientAPI"));

// display one image in nurse id
router.route("/:idM/image").get(display_image_nurses);

router
  .route("/:idM")
  // get one nurse by id
  .get((req, res) => {
    res.status(200).json(req.medicalStaff);
  });

module.exports = router;
