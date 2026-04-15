const express = require("express");
const app = express();
const port = 5008;
const connectDB = require("./config/connectDB");
require("dotenv").config();

// Connect to MongoDB
connectDB();

app.use(express.json());

app.use("/api/absences", require("./route/absences"));

app.listen(port, () => console.log(`app listening on port ${port}!`));
