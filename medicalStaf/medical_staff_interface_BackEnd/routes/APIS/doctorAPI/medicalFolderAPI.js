const express = require("express");
const router = express.Router();
const {
  download_medicalFolder_patient_id,
  get_one_medicalFolder_id_info,
} = require("../../../controllers/medicalFolderController");

// download medical folder initial
router.get("/", download_medicalFolder_patient_id);

router.use("/:idMF/reports", require("./reportAPI"));

router.get("/:idMF", get_one_medicalFolder_id_info);

module.exports = router;
