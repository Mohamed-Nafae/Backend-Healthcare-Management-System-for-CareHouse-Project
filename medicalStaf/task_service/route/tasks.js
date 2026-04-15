const express = require("express");
const router = express.Router();
const Task = require("../model/Task");
const verifyRequiredAttributes = require("../middleWare/verifyRequiredAttributes");
const getTask = require("../middleware/getTask");
const {
  get_all_tasks,
  get_all_tasks_medicalStaff_id,
  get_one_task_id,
  create_one_task,
  update_one_task_id,
  delete_task_id,
  delete_tasks_medicalStaff_id,
} = require("../controller/taskController");

// get all task by medicalStaff id
router
  .route("/medicalStaffs/:idM")
  .get(get_all_tasks_medicalStaff_id)
  .delete(delete_tasks_medicalStaff_id);

// use medile ware getTask for get one absence by id
router.use("/:id", getTask);

router
  .route("/:id")
  // get One appointmemt by id
  .get(get_one_task_id)
  //update one task by id
  .put(update_one_task_id)
  //delete one task by id
  .delete(delete_task_id);

// use the meddlewarer that verifier the Required Attributes in the Task
router
  .route("/")
  // Get all tasks
  .get(get_all_tasks)
  // create one task
  .post(verifyRequiredAttributes(Task), create_one_task);

module.exports = router;
