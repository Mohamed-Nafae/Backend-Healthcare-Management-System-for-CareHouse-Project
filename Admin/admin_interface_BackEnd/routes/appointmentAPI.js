const express = require("express");
const router = express.Router();
const {
  getall_appointments,
  get_all_appointments_query,
  delete_one_appointment_id,
} = require("../controllers/appointmentController");

router.get("/", getall_appointments);

router.get("/query", get_all_appointments_query);

router.delete("/:idA", delete_one_appointment_id);

module.exports = router;
