const express = require("express");
const app = express();
const port = 5001;
const connectDB = require("./config/connectDB");
require("dotenv").config();

// Connect to MongoDB
connectDB();

app.use(express.json());

app.use("/api/appointments", require("./route/appointments"));

app.use("/api/appointmentTypes", require("./route/appointmentTypes"));

app.listen(port, () => console.log(`app listening on port ${port}!`));
