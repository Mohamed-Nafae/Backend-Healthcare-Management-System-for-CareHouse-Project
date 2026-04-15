const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const {
  download_report_id,
  create_one_report,
} = require("../../../controllers/reportController");
const {
  fileExtLimiter,
  fileSizeLimiter,
  filePayloadExists,
} = require("../../../middleware/fileErrorhandle");

// create one report
router.post(
  "/",
  fileUpload(),
  filePayloadExists,
  fileExtLimiter([".pdf"]),
  fileSizeLimiter,
  create_one_report
);

// download report id
router.get("/:idR", download_report_id);

module.exports = router;
