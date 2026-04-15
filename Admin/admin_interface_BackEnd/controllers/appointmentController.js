const axios = require("axios");

const getall_appointments = (req, res) => {
  axios
    .get("http://127.0.0.1:5001/api/appointments/")
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const get_one_appointment_id = (req, res) => {};

const delete_one_appointment_id = (req, res) => {
  //delete one appointment
  axios
    .delete(`http://localhost:5001/api/appointments/${req.params.idA}`)
    .then(async (response) => {
      // delete one oppointment in the patient
      await axios.delete(
        `http://localhost:5003/api/patients/${response.data.patient}/appointments/${response.data._id}`
      );
      res.status(200).json({ message: "appointment deleted successfully." });
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const get_all_appointments_query = (req, res) => {
  const query = new URLSearchParams(req.query).toString();

  axios
    .get(`http://127.0.0.1:5001/api/appointments/query?${query}`)
    .then((response) => {
      if (response.data.length === 0) {
        return res.status(404).json({ message: "appointment not found" });
      }
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

module.exports = {
  getall_appointments,
  get_all_appointments_query,
  delete_one_appointment_id,
};
