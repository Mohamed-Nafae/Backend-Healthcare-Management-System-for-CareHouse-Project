const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const verifymedicalStaffExist = require("../../../middleware/verifymedicalStaffExist");
const {
  get_absences_medicalStaff_id,
} = require("../../../controllers/absenceController");
const {
  fileExtLimiter,
  fileSizeLimiter,
  filePayloadExists,
} = require("../../../middleware/fileErrorhandle");

const {
  get_all_medicalStaffs_bykind,
  get_one_medicalStaff_bykind_id,
  display_image_medicalStaff_bykind_id,
  create_one_medicalStaff_bykind,
  update_one_medicalStaff_bykind_id,
  update_image_medicalStaff_bykind_id,
  delete_one_medicalStaff_bykind_id,
} = require("../../../controllers/medicalStaffController");

const {
  get_all_tasks_medicalStaff_bykind_id,
  create_one_task,
  delete_one_task_id,
} = require("../../../controllers/taskController");

// get all doctors
router.get("/", get_all_medicalStaffs_bykind("doctors"));

// create one doctor
router.post("/", create_one_medicalStaff_bykind("doctors"));

router.use("/:idM", verifymedicalStaffExist("doctors"));

router
  .route("/:idM")
  // get one doctor by id
  .get(get_one_medicalStaff_bykind_id)
  // update one doctor by id
  .put(update_one_medicalStaff_bykind_id("doctors"))
  // delete one doctor by id
  .delete(delete_one_medicalStaff_bykind_id("doctors"));

router
  .route("/:idM/image")
  //display one image by doctor id
  .get(display_image_medicalStaff_bykind_id)
  //update one image by doctor id
  .put(
    fileUpload(),
    filePayloadExists,
    fileExtLimiter([".png", ".jpg", ".jpeg"]),
    fileSizeLimiter,
    update_image_medicalStaff_bykind_id("doctors")
  );

router
  .route("/:idM/tasks")
  // get all tasks in doctor id
  .get(get_all_tasks_medicalStaff_bykind_id("doctors"))
  // create one tasks in doctor id
  .post(create_one_task("doctors"));

// delete one task id in doctor id
router.route("/:idM/tasks/:idT").delete(delete_one_task_id("doctors"));

router.get("/:idM/absences", get_absences_medicalStaff_id);

module.exports = router;
