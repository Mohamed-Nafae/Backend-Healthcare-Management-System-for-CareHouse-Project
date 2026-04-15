const express = require("express");
const router = express.Router();
const Absence = require("../model/Absence");
const getAbsence = require("../middleware/getAbsence");
const verifyRequiredAttributes = require("../middleware/verifyRequiredAttributes");
const {
  get_all_absence,
  get_all_absence_medicalStaff_id,
  get_one_absence_id,
  create_one_absence,
  update_reason_in_one_absence_id,
  delete_one_absence_id,
  delete_absences_medicalStaff_id,
} = require("../controller/absenceController");

// Get all absences
router.get("/", get_all_absence);

// get all absences in doctor id
router
  .route("/medicalStaffs/:idM")
  .get(get_all_absence_medicalStaff_id)
  .delete(delete_absences_medicalStaff_id);

// use medile ware getAbsence for get one absence by id
router.use("/:id", getAbsence);

router
  .route("/:id")
  // Get one absence
  .get(get_one_absence_id)
  //update reason in one absence id
  .put(update_reason_in_one_absence_id)
  // Delete one absence
  .delete(delete_one_absence_id);

// Create one absence
router.post("/", verifyRequiredAttributes(Absence), create_one_absence);

module.exports = router;
