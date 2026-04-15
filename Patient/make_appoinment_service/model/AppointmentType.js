const mongoose = require("mongoose");

// add the default status

const appointmentTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AppointmentType", appointmentTypeSchema);
