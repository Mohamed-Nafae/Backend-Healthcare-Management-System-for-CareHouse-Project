const MedicalFolder = require("../model/MedicalFolder");

const get_all_medicalFolders = (req, res) => {
  MedicalFolder.find()
    .exec()
    .then((medicalFolders) => {
      if (medicalFolders.length === 0) {
        return res.status(404).json({
          message: "There is no medical folder exist.",
        });
      }
      res.status(200).json(medicalFolders);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const get_medicalFolder_id = (req, res) => {
  const _id = req.params.id;
  MedicalFolder.findById(_id)
    .exec()
    .then((medicalFolder) => {
      if (!medicalFolder) {
        return res.status(404).json({
          message: "MedicalFolder not found",
        });
      }
      res.status(200).json(medicalFolder);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const create_one_medicalFolder = async (req, res) => {
  if (!req.body?.patient || !req.body?.medicalFolder_content) {
    return res.status(400).json({
      message: "all the patient and the medicalFolder_content are required.",
    });
  }

  try {
    const deplecated_content = await MedicalFolder.findOne({
      medicalFolder_content: req.body.medicalFolder_content,
    }).exec();
    const deplecated_patient = await MedicalFolder.findOne({
      patient: req.body.patient,
    }).exec();

    if (deplecated_content || deplecated_patient)
      return res
        .status(409)
        .json({ message: "this MedicalFolder is already exist!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  const medicalFolder = new MedicalFolder({
    patient: req.body.patient,
    medicalFolder_content: req.body.medicalFolder_content,
  });

  medicalFolder
    .save()
    .then((result) => {
      res.status(201).json({
        message: "MedicalFolder created successfully",
        MedicalFolder: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};

const update_one_medicalFolder_id = (req, res) => {
  MedicalFolder.findById(req.params.id)
    .then((medicalFolder) => {
      if (!medicalFolder) {
        return res.status(404).json({
          message: "MedicalFolder not found",
        });
      }

      if (req.body?.reports) medicalFolder.reports.push(req.body.reports);
      else
        return res.status(400).json({
          message:
            "you should to specifier the reports updated in the request body.",
        });

      // Save updated medicalFolder
      medicalFolder
        .save()
        .then((update_medicalFolder) => {
          res.status(200).json(update_medicalFolder);
        })
        .catch((err) => {
          res.status(500).json({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};

const delete_one_report = (req, res) => {
  MedicalFolder.findByIdAndUpdate(
    req.params.medicalFolder_id,
    { $pull: { reports: req.params.report_id } },
    { new: true }
  )
    .then((update_medicalFolder) => {
      if (!update_medicalFolder) {
        return res.status(404).json({
          message: "medicalFolder not found",
        });
      }
      res.status(200).json(update_medicalFolder);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

const delete_one_medicalFolder_id = (req, res) => {
  MedicalFolder.findById(req.params.id)
    .then((medicalFolder) => {
      if (!medicalFolder) {
        return res.status(404).json({
          message: "medicalFolder does't exists",
        });
      }
      medicalFolder
        .deleteOne()
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(500).json({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};

module.exports = {
  get_all_medicalFolders,
  get_medicalFolder_id,
  create_one_medicalFolder,
  update_one_medicalFolder_id,
  delete_one_medicalFolder_id,
  delete_one_report,
};
