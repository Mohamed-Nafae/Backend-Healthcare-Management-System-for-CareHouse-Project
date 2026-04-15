const axios = require("axios");

const get_one_patient = (req, res) => {
  res.status(200).json(req.patient);
};

const display_image_patient_id = (req, res) => {
  const file_id = req.patient?.image ? req.patient.image : null;
  if (file_id) {
    try {
      axios
        .get(`http://127.0.0.1:5004/files/images/${file_id}`, {
          responseType: "stream",
        })
        .then((response) => {
          response.data.pipe(res);
        })
        .catch((err) => {
          if (!err.response?.status) return res.send(err.message);
          return res.status(err.response.status).json(err.response.data);
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "this patient does not have an image." });
  }
};

const verify_patient_exist = (req, res, next) => {
  axios
    .get(`http://127.0.0.1:5003/api/patients/${req.params.idP}`)
    .then((response) => {
      req.patient = response.data;
      next();
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    });
};

module.exports = {
  get_one_patient,
  verify_patient_exist,
  display_image_patient_id,
};
