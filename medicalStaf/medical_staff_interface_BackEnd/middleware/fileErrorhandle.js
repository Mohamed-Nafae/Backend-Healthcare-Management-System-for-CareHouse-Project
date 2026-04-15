const path = require("path");
const MB = 20; // 20 MB
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
  const { file } = req.files;

  const fileOverLimit = file.size > FILE_SIZE_LIMIT;
  const fileEmpty = file.size <= 100;
  //wich files are over the limit?

  if (fileOverLimit) {
    const properVerb = "is";

    const sentence =
      `Upload failed. ${file.name.toString()} ${properVerb} over the files size limit of ${MB} MB.`.replaceAll(
        ",",
        ", "
      );

    const message = sentence.replace(",", " and");

    return res.status(413).json({ message });
  } else if (fileEmpty) {
    return res
      .status(413)
      .json({ message: `Upload failed. ${file.name.toString()} is empty!` });
  }

  next();
};

const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    const { file } = req.files;

    const fileExtension = path.extname(file.name).toLowerCase();
    // Are the file extension allowed?
    const allowed = allowedExtArray.includes(fileExtension);
    if (!allowed) {
      const message =
        `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(
          ",",
          ", "
        );

      return res.status(422).json({ message });
    }

    next();
  };
};

const filePayloadExists = (req, res, next) => {
  if (!req?.files) {
    return res
      .status(400)
      .json({ message: "the file is required in the request." });
  }
  const { file } = req.files;
  if (file.data.length === 0) {
    return res.status(400).json({ message: "the file you send is empty" });
  }
  next();
};

module.exports = {
  fileSizeLimiter,
  filePayloadExists,
  fileExtLimiter,
};
