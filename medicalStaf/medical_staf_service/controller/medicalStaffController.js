const Doctor = require("../models/Doctor");
const Nurse = require("../models/Nurse");
const Driver = require("../models/Driver");

// like doctor he give you all doctors in the dbs
const get_all_medicalStaffs_byKind = (Model) => {
  return (req, res) => {
    const modelName =
      Model === Doctor ? "Doctor" : Model === Nurse ? "Nurse" : "Driver";
    Model.find()
      .select({ password: 0, refreshToken: 0 })
      .exec()
      .then((medicalStaffs) => {
        if (!medicalStaffs) {
          return res.status(404).json({
            message: `There are no ${modelName} in the database`,
          });
        }
        res.status(200).json(medicalStaffs);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  };
};

const get_one_medicalStaff_byKindid = (Model) => {
  return (req, res) => {
    const modelName =
      Model === Doctor ? "Doctor" : Model === Nurse ? "Nurse" : "Driver";

    const _id = req.params.id;
    Model.findById(_id)
      .select({ password: 0, refreshToken: 0 })
      .exec()
      .then((medicalStaff) => {
        if (!medicalStaff) {
          return res.status(404).json({
            message: `${modelName} not found`,
          });
        }
        res.status(200).json(medicalStaff);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  };
};

const create_one_medicalStaff_byKind = (Model) => {
  return async (req, res) => {
    const modelName =
      Model === Doctor ? "Doctor" : Model === Nurse ? "Nurse" : "Driver";

    //check dubrecated email and phone number
    try {
      const deprectedEmailAddress_doctor = await Doctor.findOne({
        email_address: req.body.email_address,
      }).exec();

      const deprectedEmailAddress_nurse = await Nurse.findOne({
        email_address: req.body.email_address,
      }).exec();

      const deprectedEmailAddress_driver = await Driver.findOne({
        email_address: req.body.email_address,
      }).exec();

      if (
        deprectedEmailAddress_doctor ||
        deprectedEmailAddress_driver ||
        deprectedEmailAddress_nurse
      ) {
        return res.status(409).json({ message: "this email already exist!" });
      }

      const deprectedPhonenumber_doctor = await Doctor.findOne({
        phone_number: req.body.phone_number,
      }).exec();
      const deprectedPhonenumber_nurse = await Nurse.findOne({
        phone_number: req.body.phone_number,
      }).exec();
      const deprectedPhonenumber_driver = await Driver.findOne({
        phone_number: req.body.phone_number,
      }).exec();
      if (
        deprectedPhonenumber_doctor ||
        deprectedPhonenumber_driver ||
        deprectedPhonenumber_nurse
      ) {
        return res
          .status(409)
          .json({ message: "this phone number already exist!" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

    if (modelName === "Doctor") {
      const model = new Model({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_address: req.body.email_address,
        password: req.body.password,
        gender: req.body.gender,
        phone_number: req.body.phone_number,
        birth_date: req.body.birth_date,
        speciality: req.body.speciality,
        location: {
          address: req.body.location.address,
          country: req.body.location.country,
          city: req.body.location.city,
        },
      });
      model
        .save()
        .then((result) => {
          res.status(201).json({
            message: `${modelName} created successfully`,
            createdMedicalStaff: {
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
              speciality: result.speciality,
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
    } else {
      const model = new Model({
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
        },
      });
      model
        .save()
        .then((result) => {
          res.status(201).json({
            message: `${modelName} created successfully`,
            createdMedicalStaff: {
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
    }
  };
};

const update_one_medicalStaff_byKindid = (Model) => {
  return (req, res) => {
    const modelName =
      Model === Doctor ? "Doctor" : Model === Nurse ? "Nurse" : "Driver";

    Model.findById(req.params.id)
      .then(async (medicalStaff) => {
        if (!medicalStaff) {
          return res.status(404).json({
            message: `${modelName} not found`,
          });
        }

        //update the speciality of doctor
        if (modelName === "Doctor") {
          medicalStaff.speciality = req.body?.speciality
            ? req.body.speciality
            : medicalStaff.speciality;
        }

        // Update medicalStaff attributes
        medicalStaff.refreshToken = req.body?.refreshToken
          ? req.body.refreshToken
          : medicalStaff.refreshToken;
        medicalStaff.image = req.body?.image
          ? req.body.image
          : medicalStaff.image;
        medicalStaff.first_name = req.body?.first_name
          ? req.body.first_name
          : medicalStaff.first_name;
        medicalStaff.last_name = req.body?.last_name
          ? req.body.last_name
          : medicalStaff.last_name;
        medicalStaff.gender = req.body?.gender
          ? req.body.gender
          : medicalStaff.gender;
        medicalStaff.tasks = req.body?.tasks
          ? req.body.tasks
          : medicalStaff.tasks;
        if (req.body?.phone_number) {
          try {
            const deprectedPhonenumber_doctor = await Doctor.findOne({
              phone_number: req.body.phone_number,
            }).exec();
            const deprectedPhonenumber_nurse = await Nurse.findOne({
              phone_number: req.body.phone_number,
            }).exec();
            const deprectedPhonenumber_driver = await Driver.findOne({
              phone_number: req.body.phone_number,
            }).exec();
            if (
              deprectedPhonenumber_doctor ||
              deprectedPhonenumber_driver ||
              deprectedPhonenumber_nurse
            ) {
              return res
                .status(409)
                .json({ message: "this phone number already exist!" });
            }
          } catch (error) {
            return res.status(500).json({ message: error.message });
          }
          medicalStaff.phone_number = req.body.phone_number;
        }

        if (req.body?.absences) medicalStaff.absences.push(req.body.absences);

        // Save updated appointment
        medicalStaff
          .save()
          .then((update_medicalStaff) => {
            delete update_medicalStaff._doc.password;
            delete update_medicalStaff._doc.refreshToken;
            res.status(200).json(update_medicalStaff);
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
};

const delete_one_medicalStaff_byKindid = (Model) => {
  return (req, res) => {
    const modelName =
      Model === Doctor ? "Doctor" : Model === Nurse ? "Nurse" : "Driver";

    Model.findById(req.params.id)
      .then((medicalStaff) => {
        if (!medicalStaff) {
          return res.status(404).json({
            message: `${modelName} does't exists`,
          });
        }
        medicalStaff
          .deleteOne()
          .then((result) => {
            res.sendStatus(204);
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
};

const delete_one_absence_byKindid = (Model) => {
  return (req, res) => {
    const modelName =
      Model === Doctor ? "Doctor" : Model === Nurse ? "Nurse" : "Driver";

    Model.findByIdAndUpdate(
      req.params.idM,
      { $pull: { absences: req.params.idA } },
      { new: true }
    )
      .then((update_medicalStaff) => {
        if (!update_medicalStaff) {
          return res.status(404).json({
            message: `${modelName} not found`,
          });
        }
        delete update_medicalStaff._doc.password;
        delete update_medicalStaff._doc.refreshToken;
        res.status(200).json(update_medicalStaff);
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  };
};

const get_one_medicalStaff_query = (Model) => {
  return (req, res) => {
    const modelName =
      Model === Doctor ? "Doctor" : Model === Nurse ? "Nurse" : "Driver";

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

    Model.findOne(query)
      .then((medicalStaff) => {
        if (!medicalStaff) {
          return res.status(404).json({
            message: `${modelName} not found`,
          });
        }
        res.status(200).json(medicalStaff);
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
        });
      });
  };
};

module.exports = {
  get_all_medicalStaffs_byKind,
  get_one_medicalStaff_byKindid,
  get_one_medicalStaff_query,
  create_one_medicalStaff_byKind,
  update_one_medicalStaff_byKindid,
  delete_one_medicalStaff_byKindid,
  delete_one_absence_byKindid,
};
