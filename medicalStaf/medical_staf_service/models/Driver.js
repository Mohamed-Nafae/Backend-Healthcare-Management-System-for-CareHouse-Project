const mongoose = require("mongoose");

// add the driver notification

const driverSchema = mongoose.Schema({
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
  image: {
    type: mongoose.Schema.Types.ObjectId,
  },
  role_driver: {
    type: Number,
    default: 2022,
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

module.exports = mongoose.model("Driver", driverSchema);
