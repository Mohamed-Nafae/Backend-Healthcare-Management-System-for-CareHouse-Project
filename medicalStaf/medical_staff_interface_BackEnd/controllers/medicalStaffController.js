const axios = require("axios");

const display_image_medicalStaff_id = (req, res) => {
  const file_id = req.medicalStaff?.image ? req.medicalStaff.image : null;
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
    res
      .status(404)
      .json({ message: "this medicalStaff does not have an image." });
  }
};

module.exports = display_image_medicalStaff_id;
