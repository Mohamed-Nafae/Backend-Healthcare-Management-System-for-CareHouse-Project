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

const get_absence_id = (req, res) => {
  axios
    .get(`http://127.0.0.1:5008/api/absences/${req.params.idA}`)
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const update_one_absence_id = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "request body is required." });
  }
  axios
    .put(`http://127.0.0.1:5008/api/absences/${req.params.idA}`, req.body)
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const create_one_absence = (medicalStaffName) => {
  return async (req, res) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "request body is required." });
    }
    const data = { ...req.body, medicalStaff: req.medicalStaff._id };

    try {
      const response = await axios.post(
        `http://localhost:5008/api/absences`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      try {
        const response2 = await axios.put(
          `http://127.0.0.1:5007/api/${medicalStaffName}/${req.medicalStaff._id}`,
          {
            absences: response.data._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        if (!err.response?.status) return res.sendStatus(500);
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(201).json(response.data);
    } catch (err) {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    }
  };
};

const delete_one_absence_id = (medicalStaffName) => {
  return async (req, res) => {
    try {
      const response = await axios.delete(
        `http://localhost:5008/api/absences/${req.params.idA}`
      );
      try {
        const response2 = await axios.delete(
          `http://127.0.0.1:5007/api/${medicalStaffName}/${req.medicalStaff._id}/absences/${req.params.idA}`
        );
        return res
          .status(200)
          .json({ message: "absence successfully deleted" });
      } catch (err) {
        if (!err.response?.status) return res.sendStatus(500);
        return res.status(err.response.status).json(err.response.data);
      }
    } catch (err) {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    }
  };
};

module.exports = {
  get_absences_medicalStaff_id,
  get_absence_id,
  update_one_absence_id,
  create_one_absence,
  delete_one_absence_id,
};
