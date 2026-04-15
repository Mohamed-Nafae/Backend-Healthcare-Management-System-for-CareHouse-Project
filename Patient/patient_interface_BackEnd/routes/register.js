const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const {
  fileExtLimiter,
  fileSizeLimiter,
  filePayloadExists,
} = require("../middleware/fileErrorhandle");

const { create_one_patient } = require("../controller/patientController");

// create one patient
router.post(
  "/register",
  fileUpload(),
  filePayloadExists,
  fileExtLimiter([".pdf"]),
  fileSizeLimiter,
  create_one_patient
);

module.exports = router;
