const express = require("express");
const app = express();
const port = 5009;
const connectDB = require("./config/connectDB");
require("dotenv").config();

// Connect to MongoDB
connectDB();

app.use(express.json());

app.use("/api/tasks", require("./route/tasks"));

app.listen(port, () => console.log(`app listening on port ${port}!`));
