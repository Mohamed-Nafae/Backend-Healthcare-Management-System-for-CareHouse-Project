const express = require("express");
const router = express.Router();
const {
  get_reports_patient,
  get_report_id,
  create_one_report,
  delete_one_report_id,
} = require("../controller/reportController");

// get all reports by Patient id
router.route("/patients/:idP").get(get_reports_patient);

router
  .route("/:id")
  // get One report by id
  .get(get_report_id)
  // delete One report by id
  .delete(delete_one_report_id);

// create one report
router.route("/").post(create_one_report);

module.exports = router;
