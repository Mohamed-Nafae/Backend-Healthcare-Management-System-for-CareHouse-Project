const Doctor = require("../models/Doctor");

const add_one_report = (req, res) => {
  Doctor.findById(req.params.idD)
    .then((doctor) => {
      if (!doctor) {
        return res.status(404).json({
          message: `Doctor not found`,
        });
      }
      doctor.reports.push(req.params.idR);
      doctor.save().then((update_doctor) => {
        delete update_doctor._doc.password;
        delete update_doctor._doc.refreshToken;
        res.status(200).json(update_doctor);
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

const delete_one_report = (req, res) => {
  Doctor.findByIdAndUpdate(
    req.params.idD,
    { $pull: { reports: req.params.idR } },
    { new: true }
  )
    .then((update_doctor) => {
      if (!update_doctor) {
        return res.status(404).json({
          message: `Doctor not found`,
        });
      }
      delete update_doctor._doc.password;
      delete update_doctor._doc.refreshToken;
      res.status(200).json(update_doctor);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

module.exports = {
  add_one_report,
  delete_one_report,
};
