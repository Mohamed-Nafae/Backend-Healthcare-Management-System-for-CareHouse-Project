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

// get all nurses
router.get("/", get_all_medicalStaffs_bykind("nurses"));

// create one nurse
router.post("/", create_one_medicalStaff_bykind("nurses"));

router.use("/:idM", verifymedicalStaffExist("nurses"));

router
  .route("/:idM")
  // get one nurse by id
  .get(get_one_medicalStaff_bykind_id)
  // update one nurse by id
  .put(update_one_medicalStaff_bykind_id("nurses"))
  // delete one nurse by id
  .delete(delete_one_medicalStaff_bykind_id("nurses"));

router
  .route("/:idM/image")
  //display one image by nurse id
  .get(display_image_medicalStaff_bykind_id)
  //update one image by nurse id
  .put(
    fileUpload(),
    filePayloadExists,
    fileExtLimiter([".png", ".jpg", ".jpeg"]),
    fileSizeLimiter,
    update_image_medicalStaff_bykind_id("nurses")
  );

router
  .route("/:idM/tasks")
  // get all tasks in nurse id
  .get(get_all_tasks_medicalStaff_bykind_id("nurses"))
  // create one tasks in nurse id
  .post(create_one_task("nurses"));

// delete one task id in nurse id
router.route("/:idM/tasks/:idT").delete(delete_one_task_id("nurses"));

router.get("/:idM/absences", get_absences_medicalStaff_id);

module.exports = router;
