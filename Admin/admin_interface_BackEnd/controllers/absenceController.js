const axios = require("axios");

const get_absences_medicalStaff_id = (req, res) => {
  axios
    .get(
      `http://127.0.0.1:5008/api/absences/medicalStaffs/${req.medicalStaff._id}`
    )
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

module.exports = {
  get_absences_medicalStaff_id,
};
