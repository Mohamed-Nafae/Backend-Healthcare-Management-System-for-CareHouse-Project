const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const verify_patient_exist = require("../../middleware/verifyPatientExist");
const {
  fileExtLimiter,
  fileSizeLimiter,
  filePayloadExists,
} = require("../../middleware/fileErrorhandle");
const {
  get_one_patient,
  update_image_patient_id,
  update_one_patient_id,
  display_image_patient_id,
} = require("../../controller/patientController");

// get all appointents
//router.get("/appointments", getall_appointments);

//use the middle ware for virefier the existing of patient
router.use("/:idP", verify_patient_exist);

router
  .route("/:idP")
  // get One patient by id
  .get(get_one_patient)
  // update one patient by id
  .put(update_one_patient_id);

router
  .route("/:idP/image")
  //display one image by patient id
  .get(display_image_patient_id)
  //update one image by patient id
  .put(
    fileUpload(),
    filePayloadExists,
    fileExtLimiter([".png", ".jpg", ".jpeg"]),
    fileSizeLimiter,
    update_image_patient_id
  );

module.exports = router;
