const express = require("express");
const router = express.Router();

router.use("/doctors", require("./APIS/doctorRoot"));

router.use("/nurses", require("./APIS/nurseRoot"));

router.use("/drivers", require("./APIS/driverRoot"));

module.exports = router;
