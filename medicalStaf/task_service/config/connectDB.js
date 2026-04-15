const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then((conn) => console.log("connect to the db success"))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
