const express = require("express");
const router = express.Router();
const Patient = require("../model/Patient");
const verifyRequiredAttributes = require("../middleWare/verifyRequiredAttributes");
const {
  get_all_patients,
  get_one_patient_id,
  get_one_patient_query,
  create_one_patient,
  update_one_patient_id,
  delete_one_patient_id,
  delete_one_appointment,
} = require("../controller/patientController");

// get one patient by email or by refreshToken in query paramaters
router.route("/query").get(get_one_patient_query);

//
router
  .route("/:id")
  // get One patient by id
  .get(get_one_patient_id)
  //update One patient by id
  .put(update_one_patient_id)
  //delete One patient by id
  .delete(delete_one_patient_id);

// delete one appointment from the patient
router
  .route("/:patient_id/appointments/:appointment_id")
  .delete(delete_one_appointment);
// use the meddlewarer that verifier the Required Attributes in the Patient
router
  .route("/")
  .post(verifyRequiredAttributes(Patient), create_one_patient)
  //get all  Patients
  .get(get_all_patients);

module.exports = router;
