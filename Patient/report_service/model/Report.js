const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  report_content: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Report", reportSchema);
