const mongoose = require("mongoose");

// add the admin notification

const adminSchema = mongoose.Schema({
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
  phone_number: {
    type: Number,
    required: true,
    unique: true,
  },
  role_admin: {
    type: Number,
    default: 5168,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: [{ type: String }],
});

module.exports = mongoose.model("Admin", adminSchema);
