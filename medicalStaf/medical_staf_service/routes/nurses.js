const express = require("express");
const router = express.Router();
const Nurse = require("../models/Nurse");
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

// get one nurse by email or by refreshToken in query paramaters
router.route("/query").get(get_one_medicalStaff_query(Nurse));

//
router
  .route("/:id")
  // get One nurse by id
  .get(get_one_medicalStaff_byKindid(Nurse))
  //update One nurse by id
  .put(update_one_medicalStaff_byKindid(Nurse))
  //delete One nurse by id
  .delete(delete_one_medicalStaff_byKindid(Nurse));

// delete one absence from the nurse
router.route("/:idM/absences/:idA").delete(delete_one_absence_byKindid(Nurse));

// use the meddlewarer that verifier the Required Attributes in the Nurse
router
  .route("/")
  .post(verifyRequiredAttributes(Nurse), create_one_medicalStaff_byKind(Nurse))
  //get all  Nurses
  .get(get_all_medicalStaffs_byKind(Nurse));

module.exports = router;
