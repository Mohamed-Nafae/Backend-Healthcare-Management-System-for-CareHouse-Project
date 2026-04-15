const express = require("express");
const router = express.Router();
const Appointment = require("../model/Appointment");
const verifyRequiredAttributes = require("../middleWare/verifyRequiredAttributes");
const {
  getall_appointments,
  get_appointments_patient,
  get_appointment_id,
  get_appointment_query,
  create_one_appointment,
  update_one_appointment_id,
  delete_one_appointment_id,
} = require("../controller/appointmentsController");

// use the meddlewarer that verifier the Required Attributes in the Appointment
router
  .route("/")
  // get all appointments
  .get(getall_appointments)
  // create one appointment
  .post(verifyRequiredAttributes(Appointment), create_one_appointment);

// GET /appointments endpoint with query parameters
router.get("/query", get_appointment_query);

//get all appointments by Patient id
router.get("/patients/:idP", get_appointments_patient);

router
  .route("/:id")
  // get One appointmemt by id
  .get(get_appointment_id)
  //update one appointment by id
  .put(update_one_appointment_id)
  //delete one appointment by id
  .delete(delete_one_appointment_id);

module.exports = router;
