const mongoose = require("mongoose");

// add the doctor notification

const doctorSchema = mongoose.Schema({
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
    type: Number,
    required: true,
    unique: true,
  },
  birth_date: {
    type: Date,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
  },
  role_doctor: {
    type: Number,
    default: 1954,
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  absences: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  refreshToken: [{ type: String }],
});

module.exports = mongoose.model("Doctor", doctorSchema);
