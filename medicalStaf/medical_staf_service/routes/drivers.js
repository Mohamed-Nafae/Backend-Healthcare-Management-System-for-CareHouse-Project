const express = require("express");
const router = express.Router();
const Driver = require("../models/Driver");
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

// get one driver by email or by refreshToken in query paramaters
router.route("/query").get(get_one_medicalStaff_query(Driver));

//
router
  .route("/:id")
  // get One driver by id
  .get(get_one_medicalStaff_byKindid(Driver))
  //update One driver by id
  .put(update_one_medicalStaff_byKindid(Driver))
  //delete One driver by id
  .delete(delete_one_medicalStaff_byKindid(Driver));

// delete one absence from the driver
router.route("/:idM/absences/:idA").delete(delete_one_absence_byKindid(Driver));

// use the meddlewarer that verifier the Required Attributes in the Driver
router
  .route("/")
  .post(
    verifyRequiredAttributes(Driver),
    create_one_medicalStaff_byKind(Driver)
  )
  //get all  Drivers
  .get(get_all_medicalStaffs_byKind(Driver));

module.exports = router;
