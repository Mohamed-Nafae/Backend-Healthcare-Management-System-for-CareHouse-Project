const axios = require("axios");

const verify_patient_exist = (req, res, next) => {
  axios
    .get(`http://127.0.0.1:5003/api/patients/${req.params.idP}`)
    .then((response) => {
      req.patient = response.data;
      if (req._id !== req.patient._id) return res.sendStatus(401);
      next();
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    });
};

module.exports = verify_patient_exist;
