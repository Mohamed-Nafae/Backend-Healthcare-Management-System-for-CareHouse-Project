const axios = require("axios");

const get_tasks_medicalStaff_id = (req, res) => {
  axios
    .get(
      `http://127.0.0.1:5009/api/tasks/medicalStaffs/${req.medicalStaff._id}`
    )
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const get_task_id = (req, res) => {
  axios
    .get(`http://127.0.0.1:5009/api/tasks/${req.params.idT}`)
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

//finish task
const update_one_task_id = (medicalStaffName) => {
  return (req, res) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "request body is required." });
    }

    axios
      .put(`http://127.0.0.1:5009/api/tasks/${req.params.idT}`, req.body, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        try {
          // delete one task whent it finish
          await axios.delete(
            `http://127.0.0.1:5009/api/tasks/${req.params.idT}`
          );

          // delete one appointment whent it finish
          await axios.delete(
            `http://localhost:5001/api/appointments/${response.data.appointment._id}`
          );

          // get tasks array from medical staff
          const response2 = await axios.get(
            `http://localhost:5007/api/${medicalStaffName}/${response.data.medicalStaff}`
          );

          // delete one task from medical staff
          const newtasksArray = response2.data.tasks.filter(
            (task) => task !== response.data._id
          );
          await axios.put(
            `http://localhost:5007/api/${medicalStaffName}/${response.data.medicalStaff}`,
            { tasks: [...newtasksArray] },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // delete one oppointment in the patient
          await axios.delete(
            `http://localhost:5003/api/patients/${response.data.appointment.patient}/appointments/${response.data.appointment._id}`
          );

          return res.status(200).json({ message: "task deleted succefully." });
        } catch (error) {
          if (!err.response?.status) return res.sendStatus(500);
          res.status(err.response.status).json(err.response.data);
        }
      })
      .catch((err) => {
        if (!err.response?.status) return res.sendStatus(500);
        res.status(err.response.status).json(err.response.data);
      });
  };
};

module.exports = {
  get_tasks_medicalStaff_id,
  get_task_id,
  update_one_task_id,
};
