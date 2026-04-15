const Report = require("../model/Report");

const get_reports_patient = (req, res) => {
  const patient_id = req.params.idP;
  Report.find({ patient: patient_id })
    .exec()
    .then((reports) => {
      res.status(200).json(reports);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const get_report_id = (req, res) => {
  const _id = req.params.id;
  Report.findById(_id)
    .exec()
    .then((report) => {
      if (!report) {
        return res.status(404).json({
          message: "Report not found",
        });
      }
      res.status(200).json(report);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const create_one_report = async (req, res) => {
  if (!req.body?.patient || !req.body?.doctor || !req.body?.report_content) {
    return res.status(400).json({
      message:
        "all the patient and the doctor and the report_content are required.",
    });
  }

  try {
    const deplecated_content = await Report.findOne({
      report_content: req.body.report_content,
    }).exec();

    if (deplecated_content)
      return res.status(409).json({ message: "this Report is already exist!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  const report = new Report({
    patient: req.body.patient,
    doctor: req.body.doctor,
    report_content: req.body.report_content,
  });

  report
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Report created successfully",
        report: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};

const delete_one_report_id = (req, res) => {
  Report.findById(req.params.id)
    .then((report) => {
      if (!report) {
        return res.status(404).json({
          message: "report does't exists",
        });
      }
      report
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
  get_reports_patient,
  get_report_id,
  create_one_report,
  delete_one_report_id,
};
