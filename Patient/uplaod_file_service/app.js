const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const {
  mongoConnection,
  get_gridBucket,
} = require("./middleware/dbConnection");
const { gridStorage } = require("./config/engineStorageGridfs");

const methodOverride = require("method-override");


const app = express();
const port = 5004;

// Middleware
app.use(express.json());
app.use(methodOverride("_method"));

let gridBucket;

/*// @route GET /
// @desc Loads form
app.get("/:collectionName", mongoConnection, (req, res) => {
  gridBucket = get_gridBucket();
  gridBucket
    .find()
    .toArray()
    .then((files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render("index", { files: false });
      } else {
        files.map((file) => {
          if (
            file.contentType === "image/jpeg" ||
            file.contentType === "image/png"
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render("index", { files: files });
      }
    });
});*/

// @route POST /upload
// @desc  Uploads file to DB
app.post(
  "/upload/:collectionName",
  mongoConnection,
  gridStorage().single("file"),
  (req, res) => {
    try {
      res.status(201).json({ file: req.file });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
    //   res.redirect("/");
  }
);

// @route GET /files
// @desc  Display all files in JSON
app.get("/files/:collectionName", mongoConnection, (req, res) => {
  gridBucket = get_gridBucket();
  gridBucket
    .find({})
    .toArray()
    .then((files) => {
      //cursor.forEach((doc) => console.log(doc));

      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No file exists",
        });
      }
      return res.json(files);
    });
});

// @route GET /files/:collectionName/:_id
// @desc  Display single file object
app.get("/files/:collectionName/:_id", mongoConnection, (req, res) => {
  gridBucket = get_gridBucket();
  const id_file = new mongoose.mongo.ObjectId(req.params._id);
  console.log(id_file);
  gridBucket
    .find({ _id: id_file })
    .toArray()
    .then((result) => {
      if (!result || result.length === 0) {
        return res.status(201).json({
          err: "No file exists",
        });
      }
      const filename = result[0].filename;
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");
      gridBucket.openDownloadStream(id_file).pipe(res);
    })
    .catch((err) => res.status(400).json({ message: err.message }));
});

/* @route GET /image/:filename
 @desc Display Image
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});*/

// @route DELETE /files/:id
// @desc  Delete file
app.delete("/files/:collectionName/:_id", mongoConnection, (req, res) => {
  gridBucket = get_gridBucket();
  const id_file = new mongoose.mongo.ObjectId(req.params._id);
  gridBucket
    .delete(id_file)
    .then(() => res.status(200).json({ message: "deleting success." }))
    .catch((err) => res.status(400).json({ message: err.message }));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
