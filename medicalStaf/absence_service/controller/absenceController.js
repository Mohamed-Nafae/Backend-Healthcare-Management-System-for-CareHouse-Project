const Absence = require("../model/Absence");

const get_all_absence = async (req, res) => {
  try {
    const absences = await Absence.find();
    if (absences.length == 0)
      return res
        .status(404)
        .json({ message: "no one has absences in the app." });
    res.json(absences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const get_all_absence_medicalStaff_id = async (req, res) => {
  try {
    const absences = await Absence.find({ medicalStaff: req.params.idM });
    if (absences.length == 0)
      return res
        .status(404)
        .json({ message: "this medicalStaff does not have any absences." });
    res.json(absences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const get_one_absence_id = (req, res) => {
  res.status(200).json(res.absence);
};

// create one from the date.now in front end and if the started date < end date
const create_one_absence = async (req, res) => {
  // check if deprecatedAbsence
  const deprecatedAbsence = await Absence.findOne({
    medicalStaff: req.body.medicalStaff,
    startDate: req.body.startDate,
  }).exec();
  if (deprecatedAbsence) {
    return res.status(409).json({ message: "this absence already exist!" });
  }

  const absence = new Absence({
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    reason: req.body.reason,
    medicalStaff: req.body.medicalStaff,
  });
  try {
    const savedAbsence = await absence.save();
    res.status(201).json(savedAbsence);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const update_reason_in_one_absence_id = async (req, res) => {
  if (req.body.reason != null) {
    res.absence.reason = req.body.reason;
  }
  try {
    const updatedAbsence = await res.absence.save();
    res.json(updatedAbsence);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const delete_absences_medicalStaff_id = async (req, res) => {
  try {
    const absence = await Absence.deleteMany({ medicalStaff: req.params.idM });
    if (absence.deletedCount === 0) {
      return res
        .status(200)
        .json({ message: "this medicalStaff does not have any absence." });
    }
    res.status(200).json({
      message: "all the absences of this medical staff deleted successefuly.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete one if started date.day > date.now.day in front end
const delete_one_absence_id = async (req, res) => {
  try {
    const absence = await res.absence.deleteOne();

    res.status(200).json(absence);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  get_all_absence,
  get_all_absence_medicalStaff_id,
  get_one_absence_id,
  create_one_absence,
  update_reason_in_one_absence_id,
  delete_absences_medicalStaff_id,
  delete_one_absence_id,
};
