const axios = require("axios");

const get_appointments_patient = (req, res) => {
  axios
    .get(`http://127.0.0.1:5001/api/appointments/patients/${req.params.idP}`)
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const get_appointment_id = (req, res) => {
  axios
    .get(`http://127.0.0.1:5001/api/appointments/${req.params.idA}`)
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const update_one_appointment_id = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "request body is required." });
  }
  axios
    .put(`http://127.0.0.1:5001/api/appointments/${req.params.idA}`, req.body)
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const create_one_appointment = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "request body is required." });
  }
  const location = { ...req.patient.location };
  const data = {
    ...req.body,
    location: location,
    patient: req.params.idP,
  };

  try {
    const response = await axios.post(
      `http://localhost:5001/api/appointments`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    try {
      console.log(response.data);
      const response2 = await axios.put(
        `http://127.0.0.1:5003/api/patients/${req.params.idP}`,
        {
          appointments: response.data.createdAppointment._id,
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

const delete_one_appointment = async (req, res) => {
  try {
    const response = await axios.delete(
      `http://localhost:5001/api/appointments/${req.params.idA}`
    );
    try {
      console.log(response.data);
      const response2 = await axios.delete(
        `http://127.0.0.1:5003/api/patients/${req.params.idP}/appointments/${req.params.idA}`
      );
      return res
        .status(200)
        .json({ message: "appointment successfully deleted" });
    } catch (err) {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    }
  } catch (err) {
    if (!err.response?.status) return res.sendStatus(500);
    return res.status(err.response.status).json(err.response.data);
  }
};

module.exports = {
  get_appointments_patient,
  get_appointment_id,
  update_one_appointment_id,
  create_one_appointment,
  delete_one_appointment,
};
