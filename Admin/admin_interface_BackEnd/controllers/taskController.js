const axios = require("axios");

const get_all_tasks = (req, res) => {
  axios
    .get(`http://localhost:5009/api/tasks`)
    .then((result) => {
      res.status(200).json(result.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    });
};

const get_one_task_id = (req, res) => {
  axios
    .get(`http://localhost:5009/api/tasks/${req.params.idT}`)
    .then((result) => {
      res.status(200).json(result.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    });
};

const get_all_tasks_medicalStaff_bykind_id = (medicalStaffName) => {
  return (req, res) => {
    axios
      .get(
        `http://localhost:5009/api/tasks/medicalStaffs/${req.medicalStaff._id}`
      )
      .then((result) => {
        res.status(200).json(result.data);
      })
      .catch((err) => {
        console.log(err.message);
        if (!err.response?.status) return res.sendStatus(500);
        return res.status(err.response.status).json(err.response.data);
      });
  };
};

const create_one_task = (medicalStaffName) => {
  return async (req, res) => {
    if (!req.body?.date)
      return res
        .status(400)
        .json({ message: "you must provide the date of the task" });

    if (!req.body?.appointment)
      return res
        .status(400)
        .json({ message: "you must provide the appointment of this task" });

    if (!req.body?.team)
      return res
        .status(400)
        .json({ message: "you must provide the team for this task" });

    try {
      const date = req.body.date;
      await axios.get(
        `http://127.0.0.1:5001/api/appointments/${req.body.appointment}`
      );

      delete req.body.date;
      const task = await axios.post(
        `http://localhost:5009/api/tasks`,
        { ...req.body, medicalStaff: req.medicalStaff._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const newTask = task.data;
      const newtaskArray = [...req.medicalStaff.tasks, newTask._id];

      await axios.put(
        `http://127.0.0.1:5007/api/${medicalStaffName}/${req.medicalStaff._id}`,
        { tasks: [...newtaskArray] },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (medicalStaffName === "doctors") {
        await axios.put(
          `http://localhost:5001/api/appointments/${req.body.appointment}`,
          { status: "inprogress", date: date, doctor: req.medicalStaff._id },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else if (medicalStaffName === "nurses") {
        await axios.put(
          `http://localhost:5001/api/appointments/${req.body.appointment}`,
          { status: "inprogress", date: date, nurse: req.medicalStaff._id },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      res.status(200).json(newTask);
    } catch (err) {
      console.log(err.message);
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    }
  };
};

const update_one_task_id = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "request body is required." });
  }

  axios
    .put(`http://localhost:5009/api/tasks/${req.params.idT}`, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      res.status(200).json(result.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    });
};

const delete_one_task_id = (medicalStaffName) => {
  return (req, res) => {
    axios
      .delete(`http://127.0.0.1:5009/api/tasks/${req.params.idT}`)
      .then(async (response) => {
        try {
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

          return res.status(200).json({ message: "task deleted succefully." });
        } catch (err) {
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
  get_all_tasks,
  get_all_tasks_medicalStaff_bykind_id,
  get_one_task_id,
  create_one_task,
  update_one_task_id,
  delete_one_task_id,
};
