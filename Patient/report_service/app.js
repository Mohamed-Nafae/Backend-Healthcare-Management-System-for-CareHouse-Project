const express = require("express");
const app = express();
const port = 5005;
const connectDB = require("./config/connectDB");
require("dotenv").config();

// Connect to MongoDB
connectDB();

app.use(express.json());

app.use("/api/reports", require("./router/reports"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
