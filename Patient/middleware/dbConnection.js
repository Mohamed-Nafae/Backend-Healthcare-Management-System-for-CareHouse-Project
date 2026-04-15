const mongoose = require("mongoose");


let gridBucket;
const mongoConnection = (req, res, next) => {
  mongoose
    .connect(process.env.DATABASE_URI)
    .then((conn) => {
      console.log("connected success");
      let db = conn.connection.db;
      let db_collection = req.params.collectionName;
      console.log(db_collection);
      gridBucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: db_collection,
      });
      next();
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

const get_gridBucket = () => gridBucket;
module.exports = { mongoConnection, get_gridBucket };
