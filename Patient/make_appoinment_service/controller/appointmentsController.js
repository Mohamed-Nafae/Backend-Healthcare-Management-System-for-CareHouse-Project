const Appointment = require("../model/Appointment");
const AppointmentType = require("../model/AppointmentType");

const getall_appointments = (req, res) => {
  Appointment.find()
    .exec()
    .then((appointments) => {
      if (appointments.length === 0) {
        return res.status(404).json({
          message: "the app does not have any Appointments .",
        });
      }
      res.status(200).json(appointments);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const get_appointments_patient = (req, res) => {
  const patient_id = req.params.idP;
  Appointment.find({ patient: patient_id })
    .exec()
    .then((appointments) => {
      console.log(appointments);
      res.status(200).json(appointments);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const get_appointment_id = (req, res) => {
  const _id = req.params.id;
  Appointment.findById(_id)
    .exec()
    .then((appointment) => {
      if (!appointment) {
        return res.status(404).json({
          message: "Appointment not found",
        });
      }
      res.status(200).json(appointment);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const create_one_appointment = async (req, res) => {
  try {
    // check if the appointmentType available or not
    const appointmentType = await AppointmentType.findOne({
      name: req.body.typeofAppointment,
    }).exec();
    if (!appointmentType?.available)
      return res.status(404).json({
        message: "this type of appointment is unavailable.",
      });

    //check for deprectedAppointment
    const deprectedAppointment = await Appointment.findOne({
      patient: req.body.patient,
      typeofAppointment: req.body.typeofAppointment,
    }).exec();
    if (deprectedAppointment) {
      return res
        .status(409)
        .json({ message: "this appointment already exist!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  const appointment = new Appointment({
    typeofAppointment: req.body.typeofAppointment,
    date: req.body.date,
    time: req.body.time,
    status: req.body.status,
    location: {
      address: req.body.location.address,
      country: req.body.location.country,
      city: req.body.location.city,
      longitude: req.body.location.longitude,
      latitude: req.body.location.latitude,
    },
    careTaker: req.body.careTaker,
    qrCode_id: req.body.qrCode_id,
    patient: req.body.patient,
    doctor: req.body.doctor,
    nurse: req.body.nurse,
  });
  appointment
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Appointment created successfully",
        createdAppointment: {
          _id: result._id,
          typeofAppointment: result.typeofAppointment,
          date: result.date,
          time: result.time,
          status: result.status,
          location: result.location,
          careTaker: result.careTaker,
          qrCode_id: result.qrCode_id,
          patient: result.patient,
          doctor: result.doctor,
          nurse: result.nurse,
          createdAt: result.createdAt,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};

const update_one_appointment_id = (req, res) => {
  Appointment.findById(req.params.id)
    .then((appointment) => {
      if (!appointment) {
        return res.status(404).json({
          message: "Appointment not found",
        });
      }

      // Update appointment attributes
      appointment.date = req.body?.date ? req.body.date : appointment.date;
      appointment.time = req.body?.time ? req.body.time : appointment.time;
      appointment.status = req.body?.status
        ? req.body.status
        : appointment.status;
      appointment.doctor = req.body?.doctor
        ? req.body.doctor
        : appointment.doctor;
      appointment.nurse = req.body?.nurse ? req.body.nurse : appointment.nurse;

      // Save updated appointment
      appointment
        .save()
        .then((updatedAppointment) => {
          res.status(200).json(updatedAppointment);
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

const delete_one_appointment_id = (req, res) => {
  // add where the appointemt status is en proccess it can't delete it in the client side
  Appointment.findById(req.params.id)
    .then((appointment) => {
      if (!appointment) {
        return res.status(404).json({
          message: "Appointment does't exists",
        });
      }
      appointment
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

const get_appointment_query = async (req, res) => {
  try {
    const { status, typeofAppointment } = req.query;

    // Build the query object based on the provided query parameters
    const query = {};

    if (status) {
      query.status = status;
    }

    if (typeofAppointment) {
      query.typeofAppointment = typeofAppointment;
    }

    // Find appointments based on the query
    const appointments = await Appointment.find(query);

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getall_appointments,
  get_appointments_patient,
  get_appointment_id,
  get_appointment_query,
  create_one_appointment,
  update_one_appointment_id,
  delete_one_appointment_id,
};
