const Absence = require("../model/Absence");

// Middleware function to get an absence by id
async function getAbsence(req, res, next) {
  try {
    const absence = await Absence.findById(req.params.id);
    if (absence == null) {
      return res.status(404).json({ message: "absence not found" });
    }
    res.absence = absence;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = getAbsence;
