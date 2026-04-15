const mongoose = require("mongoose");
const Appointment = require("./Appointment");

const taskSchema = mongoose.Schema({
  order: {
    type: Number,
  },
  team: {
    type: String,
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Appointment,
    required: true,
  },
  medicalStaff: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
