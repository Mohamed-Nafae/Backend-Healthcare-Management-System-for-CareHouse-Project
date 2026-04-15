const express = require("express");
const router = express.Router();

const {
  getall_appointmentTypes,
  get_appointmentType_name,
  create_one_appointmentType,
  update_one_appointmentType_availability,
  delete_one_appointment_name,
} = require("../controller/appointmentTypesController");

router
  .route("/:name")
  // get One appointmemt by name
  .get(get_appointmentType_name)
  //update one appointment by name
  .put(update_one_appointmentType_availability)
  //delete one appointment by name
  .delete(delete_one_appointment_name);

// use the meddlewarer that verifier the Required Attributes in the Appointment
router
  .route("/")
  // get all appointmentTypes
  .get(getall_appointmentTypes)
  // create one appointmentType
  .post(create_one_appointmentType);

module.exports = router;
