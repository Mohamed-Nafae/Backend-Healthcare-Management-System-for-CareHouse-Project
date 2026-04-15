const axios = require("axios");

const getall_appointmentTypes = (req, res) => {
  axios
    .get("http://127.0.0.1:5001/api/appointmentTypes")
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const get_one_appointmentType_byname = (req, res) => {
  axios
    .get(`http://127.0.0.1:5001/api/appointmentTypes/${req.params.name}`)
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const create_one_appointmentType = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "name of appointment type is required." });
  }

  axios
    .post(`http://127.0.0.1:5001/api/appointmentTypes`, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const update_one_appointmentType_byname = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "name of appointment type is required." });
  }

  axios
    .put(
      `http://127.0.0.1:5001/api/appointmentTypes/${req.params.name}`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const delete_one_appointmentType_byname = (req, res) => {
  axios
    .get(
      `http://127.0.0.1:5001/api/appointments/query?typeofAppointment=${req.params.name}`
    )
    .then(async (response) => {
      if (response.data.length === 0) {
        try {
          const response = await axios.delete(
            `http://127.0.0.1:5001/api/appointmentTypes/${req.params.name}`,
            req.body,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          res.status(response.status).json({
            message: "this type of appointment is deleted successfully.",
          });
        } catch (err) {
          if (!err.response?.status) return res.sendStatus(500);
          res.status(err.response.status).json(err.response.data);
        }
      } else {
        return res.status(400).json({
          message:
            "you can't delete this type of appointment car there is an appointment already exist with this type.",
        });
      }
    })
    .catch(async (err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

module.exports = {
  getall_appointmentTypes,
  get_one_appointmentType_byname,
  create_one_appointmentType,
  update_one_appointmentType_byname,
  delete_one_appointmentType_byname,
};
