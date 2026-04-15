const axios = require("axios");

const verify_medicalStaff_exist = (medicalStaffName) => {
  return (req, res, next) => {
    axios
      .get(`http://127.0.0.1:5007/api/${medicalStaffName}/${req.params.idM}`)
      .then((response) => {
        req.medicalStaff = response.data;
        next();
      })
      .catch((err) => {
        if (!err.response?.status) return res.sendStatus(500);
        return res.status(err.response.status).json(err.response.data);
      });
  };
};

module.exports = verify_medicalStaff_exist;
