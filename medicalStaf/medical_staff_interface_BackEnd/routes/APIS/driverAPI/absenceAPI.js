const express = require("express");
const router = express.Router();

const {
  get_absences_medicalStaff_id,
  get_absence_id,
  create_one_absence,
  update_one_absence_id,
  delete_one_absence_id,
} = require("../../../controllers/absenceController");

router
  .route("/")
  // get all absence in medical Staff id
  .get(get_absences_medicalStaff_id)
  // create one absence
  .post(create_one_absence("drivers"));

router
  .route("/:idA")
  // get one absence by id
  .get(get_absence_id)
  // update reason in one absence by id
  .put(update_one_absence_id)
  // delete one absence by id
  .delete(delete_one_absence_id("drivers"));

module.exports = router;
