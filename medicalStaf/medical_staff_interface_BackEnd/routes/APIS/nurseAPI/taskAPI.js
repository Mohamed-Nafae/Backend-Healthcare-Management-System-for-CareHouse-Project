const express = require("express");
const router = express.Router();

const {
  get_task_id,
  get_tasks_medicalStaff_id,
  update_one_task_id,
} = require("../../../controllers/taskController");

router
  .route("/")
  // get all tasks in medical Staff id
  .get(get_tasks_medicalStaff_id);

router
  .route("/:idT")
  // get one task by id
  .get(get_task_id)
  // make task finished in one task by id
  .put(update_one_task_id("nurses"));

module.exports = router;
