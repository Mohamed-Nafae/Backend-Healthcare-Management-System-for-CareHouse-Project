const express = require("express");
const router = express.Router();
const {
  get_one_appointmentType_byname,
  getall_appointmentTypes,
  create_one_appointmentType,
  update_one_appointmentType_byname,
  delete_one_appointmentType_byname,
} = require("../controllers/appointmentTypeController");

router.route("/").get(getall_appointmentTypes).post(create_one_appointmentType);

router
  .route("/:name")
  .get(get_one_appointmentType_byname)
  .put(update_one_appointmentType_byname)
  .delete(delete_one_appointmentType_byname);

module.exports = router;
