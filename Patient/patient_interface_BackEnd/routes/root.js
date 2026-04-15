const express = require("express");
const router = express.Router();

router.use(require("./register"));

router.use(require("./login_logout"));

router.use(require("./refresh"));

router.use(require("../middleware/verifyJWT"));

router.use(require("../middleware/verifyRoles"));

router.use(require("./APIS/patientAPI"));

router.use(require("./APIS/appointmentAPI"));

router.use(require("./APIS/medicalFolderAPI"));

router.use(require("./APIS/reportAPI"));

module.exports = router;
