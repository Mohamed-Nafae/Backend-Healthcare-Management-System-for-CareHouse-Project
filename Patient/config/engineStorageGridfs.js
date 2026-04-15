const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

function gridStorage() {
  let storage = new GridFsStorage({
    url: process.env.DATABASE_URI,
    file: (req, file) => {
      return {
        filename: file.originalname,
        bucketName: req.params.collectionName,
        date: Date.now,
      };
    },
  });

  let uplaodGrid = multer({ storage });
  return uplaodGrid;
}
module.exports = { gridStorage };
