const AppointmentType = require("../model/AppointmentType");

const getall_appointmentTypes = (req, res) => {
  AppointmentType.find()
    .exec()
    .then((AppointmentTypes) => {
      if (AppointmentTypes.length === 0) {
        return res.status(404).json({
          message: "the app does not have any AppointmentTypes.",
        });
      }
      res.status(200).json(AppointmentTypes);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const get_appointmentType_name = (req, res) => {
  AppointmentType.findOne({ name: req.params.name })
    .exec()
    .then((appointmentType) => {
      if (!appointmentType) {
        return res.status(404).json({
          message: "AppointmentType not found",
        });
      }
      res.status(200).json(appointmentType);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const create_one_appointmentType = async (req, res) => {
  if (!req.body?.name)
    return res
      .status(400)
      .json({ message: "the name of the appointmentType is required." });
  try {
    const deprectedAppointmentType = await AppointmentType.findOne({
      name: req.body.name,
    }).exec();
    if (deprectedAppointmentType) {
      return res
        .status(409)
        .json({ message: "this appointmentType already exist!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  const appointment = new AppointmentType({
    name: req.body.name,
  });
  appointment
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};

const update_one_appointmentType_availability = (req, res) => {
  AppointmentType.findOne({ name: req.params.name })
    .then((appointmentType) => {
      if (!appointmentType) {
        return res.status(404).json({
          message: "AppointmentType not found",
        });
      }

      // Update appointmentType availability
      if (!req.body?.available)
        return res.status(400).json({
          message:
            "the available attribute is required for the update in the request.",
        });

      appointmentType.available = req.body.available;

      // Save updated appointment
      appointmentType
        .save()
        .then((updatedAppointmentType) => {
          res.status(200).json(updatedAppointmentType);
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

const delete_one_appointment_name = (req, res) => {
  AppointmentType.findOne({ name: req.params.name })
    .then((appointmentType) => {
      if (!appointmentType) {
        return res.status(404).json({
          message: "AppointmentType does't exists",
        });
      }
      appointmentType
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
  getall_appointmentTypes,
  delete_one_appointment_name,
  get_appointmentType_name,
  create_one_appointmentType,
  update_one_appointmentType_availability,
};
