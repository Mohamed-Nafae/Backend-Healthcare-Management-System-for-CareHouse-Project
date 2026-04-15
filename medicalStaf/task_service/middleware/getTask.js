const Task = require("../model/Task");

// Middleware function to get an task by id
async function getTask(req, res, next) {
  await Task.findById(req.params.id)
    .populate("appointment")
    .exec()
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: "task not found" });
      }
      res.task = task;
      next();
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
}

module.exports = getTask;
