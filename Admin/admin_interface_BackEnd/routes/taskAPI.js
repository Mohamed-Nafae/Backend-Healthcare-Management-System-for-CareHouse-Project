const express = require("express");
const router = express.Router();

const {
  get_all_tasks,
  get_one_task_id,
  update_one_task_id,
} = require("../controllers/taskController");

// get all tasks
router.get("/", get_all_tasks);

router
  .route("/:idT")
  // get one task by id
  .get(get_one_task_id)
  // update one task by id
  .put(update_one_task_id);

module.exports = router;
