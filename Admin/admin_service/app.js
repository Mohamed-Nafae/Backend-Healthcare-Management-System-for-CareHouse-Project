const express = require("express");
const app = express();
const port = 5010;
const connectDB = require("./config/connectDB");
require("dotenv").config();

// Connect to MongoDB
connectDB();

app.use(express.json());

app.use("/api/admins", require("./route/admins"));

app.listen(port, () => console.log(`app listening on port ${port}!`));
