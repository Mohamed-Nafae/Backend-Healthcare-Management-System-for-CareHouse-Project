const express = require("express");
const router = express.Router();
const {
  get_one_patient,
  display_image_patient_id,
  verify_patient_exist,
} = require("../../../controllers/patientConttroller");

router.use("/:idP", verify_patient_exist);

router.use("/:idP/medicalFolders", require("./medicalFolderAPI"));

router.get("/:idP", get_one_patient);

router.get("/:idP/image", display_image_patient_id);

module.exports = router;
