const express = require("express");
const router = express.Router();
const verify_patient_exist = require("../../middleware/verifyPatientExist");
const {
  get_appointments_patient,
  get_appointment_id,
  update_one_appointment_id,
  create_one_appointment,
  delete_one_appointment,
} = require("../../controller/appointmentController");

//use the middle ware for virefier the existing of patient
router.use("/:idP/appointments", verify_patient_exist);

// get all appointents by patient id
router
  .route("/:idP/appointments")
  .get(get_appointments_patient)
  .post(create_one_appointment);

router
  .route("/:idP/appointments/:idA")
  // get One appointmemt by id
  .get(get_appointment_id)
  //update one appointment by id
  .put(update_one_appointment_id)
  //delete one appointment by id
  .delete(delete_one_appointment);

module.exports = router;
