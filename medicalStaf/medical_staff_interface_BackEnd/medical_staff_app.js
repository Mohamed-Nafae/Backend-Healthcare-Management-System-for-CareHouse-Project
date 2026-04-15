const express = require("express");
const cookieParser = require("cookie-parser");
const { logger } = require("./middleware/logEvents");
require("dotenv").config();
const app = express();
const port = 5006;

// custom middleware logger
app.use(logger);

//built-in middleware for json
app.use(express.json());

//Cross Origin Resource Sharing

//middleware for cookies
app.use(cookieParser());

app.use("/api", require("./routes/root"));

app.listen(port, () => console.log(`app listening on port ${port}!`));
