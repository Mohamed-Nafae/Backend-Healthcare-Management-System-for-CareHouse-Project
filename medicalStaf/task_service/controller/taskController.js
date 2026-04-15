const Task = require("../model/Task");

const get_all_tasks = (req, res) => {
  Task.find()
    .populate("appointment")
    .then((tasks) => {
      if (tasks.length == 0)
        return res
          .status(404)
          .json({ message: "no one has tasks in the app." });
      res.status(200).json(tasks);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const get_all_tasks_medicalStaff_id = (req, res) => {
  Task.find({ medicalStaff: req.params.idM })
    .populate("appointment")
    .then((tasks) => {
      if (tasks.length === 0) {
        return res
          .status(404)
          .json({ message: "this medicalStaff does not have any task" });
      }
      res.status(200).json(tasks);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
};

const get_one_task_id = (req, res) => {
  res.status(200).json(res.task);
};

const create_one_task = async (req, res) => {
  // check if deprecatedTask
  try {
    const deprecatedTask = await Task.findOne({
      appointment: req.body.appointment,
      medicalStaff: req.body.medicalStaff,
    }).exec();

    if (deprecatedTask) {
      return res.status(409).json({ message: "this task already exist!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  const task = new Task({
    appointment: req.body.appointment,
    medicalStaff: req.body.medicalStaff,
    team: req.body.team,
  });
  task
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const update_one_task_id = async (req, res) => {
  // check if the medical staff has scan the correcte task qrCode_id
  if (req.body.finished != null) {
    if (!req.body?.qrCode_id)
      return res.status(400).json({ message: "the qrCode_id is required!" });
    if (req.body.qrCode_id !== res.task.appointment.qrCode_id) {
      return res
        .status(400)
        .json({ message: "you had been scan the wrong task" });
    }
    res.task.finished = req.body.finished;
  }

  res.task.team = req.body?.team ? req.body.team : res.task.team;
  res.task.order = req.body?.order ? req.body.order : res.task.order;

  try {
    const updatedAbsence = await res.task.save();
    res.json(updatedAbsence);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const delete_task_id = async (req, res) => {
  try {
    const task = await res.task.deleteOne();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const delete_tasks_medicalStaff_id = async (req, res) => {
  try {
    const task = await Task.deleteMany({ medicalStaff: req.params.idM });
    if (task.deletedCount === 0) {
      return res
        .status(200)
        .json({ message: "this medicalStaff does not have any task." });
    }
    res.status(200).json({
      message: "all the tasks of this medical staff deleted successefuly.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  get_all_tasks,
  get_all_tasks_medicalStaff_id,
  get_one_task_id,
  create_one_task,
  update_one_task_id,
  delete_task_id,
  delete_tasks_medicalStaff_id,
};
