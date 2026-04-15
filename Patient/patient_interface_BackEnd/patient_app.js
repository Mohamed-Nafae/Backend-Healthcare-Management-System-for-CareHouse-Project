const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const { logger } = require("./middleware/logEvents");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 5000;

// custom middleware logger
app.use(logger);

//built-in middleware for json
app.use(express.json());

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//middleware for cookies
app.use(cookieParser());

app.use("/api/patients", require("./routes/root"));

app.listen(port, () => console.log(`app listening on port ${port}!`));

// const sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "certaficateSSL", "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "certaficateSSL", "cert.pem")),
//   },
//   app
// );

// sslServer.listen(port, () =>
//   console.log(`secure server with https listen in ${port}`)
// );
