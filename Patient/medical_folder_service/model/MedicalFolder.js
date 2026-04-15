const mongoose = require("mongoose");

const medicalFolderSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  medicalFolder_content: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

module.exports = mongoose.model("MedicalFolder", medicalFolderSchema);
