const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const verifyRequiredAttributes = require("../middleWare/verifyRequiredAttributes");
const {
  get_all_medicalStaffs_byKind,
  get_one_medicalStaff_byKindid,
  get_one_medicalStaff_query,
  create_one_medicalStaff_byKind,
  update_one_medicalStaff_byKindid,
  delete_one_medicalStaff_byKindid,
  delete_one_absence_byKindid,
} = require("../controller/medicalStaffController");

const {
  add_one_report,
  delete_one_report,
} = require("../controller/doctorController");

// get one doctor by email or by refreshToken in query paramaters
router.route("/query").get(get_one_medicalStaff_query(Doctor));

//
router
  .route("/:id")
  // get One doctor by id
  .get(get_one_medicalStaff_byKindid(Doctor))
  //update One doctor by id
  .put(update_one_medicalStaff_byKindid(Doctor))
  //delete One doctor by id
  .delete(delete_one_medicalStaff_byKindid(Doctor));

// add and delete one report id by doctor id
router
  .route("/:idD/reports/:idR")
  .post(add_one_report)
  .delete(delete_one_report);

// delete one absence from the doctor
router.route("/:idM/absences/:idA").delete(delete_one_absence_byKindid(Doctor));

// use the meddlewarer that verifier the Required Attributes in the Doctor
router
  .route("/")
  .post(
    verifyRequiredAttributes(Doctor),
    create_one_medicalStaff_byKind(Doctor)
  )
  //get all  Doctors
  .get(get_all_medicalStaffs_byKind(Doctor));

module.exports = router;
