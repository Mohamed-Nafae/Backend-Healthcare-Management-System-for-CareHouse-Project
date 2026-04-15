const express = require("express");
const router = express.Router();
const {
  get_all_medicalFolders,
  get_medicalFolder_id,
  create_one_medicalFolder,
  update_one_medicalFolder_id,
  delete_one_medicalFolder_id,
  delete_one_report,
} = require("../controller/medicalFolderController");

router
  .route("/")
  // get all medicalFolders
  .get(get_all_medicalFolders)
  // create one medicalFolder
  .post(create_one_medicalFolder);

router
  .route("/:id")
  // get One medicalFolder by id
  .get(get_medicalFolder_id)
  // update One medicalFolder by id
  .put(update_one_medicalFolder_id)
  // delete One medicalFolder by id
  .delete(delete_one_medicalFolder_id);

//delete One report in medical folder id by report id that you wont to deleted
router.route("/:medicalFolder_id/reports/:report_id").delete(delete_one_report);

module.exports = router;
