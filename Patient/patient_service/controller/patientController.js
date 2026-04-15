const Patient = require("../model/Patient");

const get_all_patients = (req, res) => {
  Patient.find()
    .select({ password: 0, refreshToken: 0, role_patient: 0 })
    .exec()
    .then((patients) => {
      if (!patients) {
        return res.status(404).json({
          message: "There are no patients in the database",
        });
      }
      res.status(200).json(patients);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const get_one_patient_id = (req, res) => {
  const _id = req.params.id;
  Patient.findById(_id)
    .select({ password: 0, refreshToken: 0, role_patient: 0 })
    .exec()
    .then((patient) => {
      if (!patient) {
        return res.status(404).json({
          message: "patient not found",
        });
      }
      res.status(200).json(patient);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const create_one_patient = async (req, res) => {
  //check dubrecated email and phone number
  try {
    const deprectedEmailAddress = await Patient.findOne({
      email_address: req.body.email_address,
    }).exec();
    if (deprectedEmailAddress) {
      return res.status(409).json({ message: "this email already exist!" });
    }

    const deprectedPhonenumber = await Patient.findOne({
      phone_number: req.body.phone_number,
    }).exec();
    if (deprectedPhonenumber) {
      return res
        .status(409)
        .json({ message: "this phone number already exist!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  const patient = new Patient({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email_address: req.body.email_address,
    password: req.body.password,
    gender: req.body.gender,
    phone_number: req.body.phone_number,
    birth_date: req.body.birth_date,
    location: {
      address: req.body.location.address,
      country: req.body.location.country,
      city: req.body.location.city,
      longitude: req.body.location.longitude,
      latitude: req.body.location.latitude,
    },
  });
  patient
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Patient created successfully",
        createdPatient: {
          _id: result._id,
          first_name: result.first_name,
          last_name: result.last_name,
          email_address: result.email_address,
          gender: result.gender,
          phone_number: result.phone_number,
          birth_date: result.birth_date,
          address: result.location.address,
          country: result.location.country,
          city: result.location.city,
          longitude: result.location.longitude,
          latitude: result.location.latitude,
          createdAt: result.createdAt,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    });
};

const update_one_patient_id = (req, res) => {
  Patient.findById(req.params.id)
    .then(async (patient) => {
      if (!patient) {
        return res.status(404).json({
          message: "patient not found",
        });
      }

      // Update patient attributes
      patient.refreshToken = req.body?.refreshToken
        ? req.body.refreshToken
        : patient.refreshToken;
      patient.image = req.body?.image ? req.body.image : patient.image;
      patient.first_name = req.body?.first_name
        ? req.body.first_name
        : patient.first_name;
      patient.last_name = req.body?.last_name
        ? req.body.last_name
        : patient.last_name;
      patient.gender = req.body?.gender ? req.body.gender : patient.gender;
      if (req.body?.phone_number) {
        const deprectedPhonenumber = await Patient.findOne({
          phone_number: req.body.phone_number,
        }).exec();
        if (deprectedPhonenumber) {
          return res
            .status(409)
            .json({ message: "this phone number already exist!" });
        }
        patient.phone_number = req.body.phone_number;
      }

      if (req.body?.medical_reports)
        patient.medical_reports.push(req.body.medical_reports);
      if (req.body?.appointments)
        patient.appointments.push(req.body.appointments);

      if (patient.medical_folder && req.body?.medical_folder) {
        return res.status(409).json({
          message: "this patient already has medical_folder!",
        });
      }
      patient.medical_folder = req.body?.medical_folder
        ? req.body.medical_folder
        : patient.medical_folder;

      // Save updated appointment
      patient
        .save()
        .then((update_patient) => {
          delete update_patient._doc.password;
          delete update_patient._doc.refreshToken;
          delete update_patient._doc.role_patient;
          res.status(200).json(update_patient);
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

const delete_one_patient_id = (req, res) => {
  Patient.findById(req.params.id)
    .then((patient) => {
      if (!patient) {
        return res.status(404).json({
          message: "Patient does't exists",
        });
      }
      patient
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

const delete_one_appointment = (req, res) => {
  Patient.findByIdAndUpdate(
    req.params.patient_id,
    { $pull: { appointments: req.params.appointment_id } },
    { new: true }
  )
    .then((update_patient) => {
      if (!update_patient) {
        return res.status(404).json({
          message: "patient not found",
        });
      }
      delete update_patient._doc.password;
      delete update_patient._doc.refreshToken;
      delete update_patient._doc.role_patient;
      res.status(200).json(update_patient);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

const get_one_patient_query = (req, res) => {
  const email = req.query.email;
  const refreshToken = req.query.refreshToken;

  if (!email && !refreshToken) {
    return res.status(400).json({
      message: "Please provide either an email or a refresh token",
    });
  }

  let query;
  if (email) {
    query = { email_address: email };
  } else {
    query = { refreshToken: { $elemMatch: { $eq: refreshToken } } };
  }

  Patient.findOne(query)
    .then((patient) => {
      if (!patient) {
        return res.status(404).json({
          message: "Patient not found",
        });
      }
      res.status(200).json(patient);
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};

module.exports = {
  get_all_patients,
  get_one_patient_id,
  get_one_patient_query,
  create_one_patient,
  update_one_patient_id,
  delete_one_patient_id,
  delete_one_appointment,
};
