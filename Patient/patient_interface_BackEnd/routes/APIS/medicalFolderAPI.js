const express = require("express");
const router = express.Router();
const verify_patient_exist = require("../../middleware/verifyPatientExist");
const {
  download_medicalFolder_patient_id,
} = require("../../controller/medicalFolderController");

//use the middle ware for virefier the existing of patient
router.use("/:idP", verify_patient_exist);

router
  .route("/:idP/medicalFolder")
  // download One medicalFolder by patient id
  .get(download_medicalFolder_patient_id);

module.exports = router;
