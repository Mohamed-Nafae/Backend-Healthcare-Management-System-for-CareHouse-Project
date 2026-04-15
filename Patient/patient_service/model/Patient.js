const mongoose = require("mongoose");
const Double = require("mongoose-double")(mongoose);

// add the patient notification

const patientSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email_address: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  birth_date: {
    type: String,
    required: true,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
  },
  role_patient: {
    type: Number,
    default: 2002,
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    longitude: {
      type: Double,
      required: true,
    },
    latitude: {
      type: Double,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  medical_reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  medical_folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicalFolder",
  },
  refreshToken: [{ type: String }],
});

module.exports = mongoose.model("Patient", patientSchema);
