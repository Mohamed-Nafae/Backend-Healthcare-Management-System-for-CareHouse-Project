const express = require("express");
const app = express();
const port = 5007;
const connectDB = require("./config/connectDB");
require("dotenv").config();

// Connect to MongoDB
connectDB();

app.use(express.json());

app.use("/api/doctors", require("./routes/doctors"));

app.use("/api/nurses", require("./routes/nurses"));

app.use("/api/drivers", require("./routes/drivers"));

app.listen(port, () => console.log(`app listening on port ${port}!`));
