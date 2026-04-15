const express = require("express");
const router = express.Router();
const verify_patient_exist = require("../../middleware/verifyPatientExist");
const {
  get_reports_patient_id,
  download_report_id,
} = require("../../controller/reportController");

//use the middle ware for virefier the existing of patient
router.use("/:idP", verify_patient_exist);

router
  .route("/:idP/reports")
  // get all reports by patient id
  .get(get_reports_patient_id);

router
  .route("/:idP/reports/:idR")
  // download one report by id
  .get(download_report_id);

module.exports = router;
