const mongoose = require("mongoose");
const Double = require("mongoose-double")(mongoose);

// add the default status

const appointmentSchema = mongoose.Schema({
  typeofAppointment: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  status: {
    type: String,
    enum: ["waiting", "inprogress"],
    default: "waiting",
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
  careTaker: {
    type: Boolean,
    default: false,
  },
  qrCode_id: {
    type: String,
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
  },
  nurse: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
