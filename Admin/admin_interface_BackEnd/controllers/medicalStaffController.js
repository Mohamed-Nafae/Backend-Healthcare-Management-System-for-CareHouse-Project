const axios = require("axios");
const bcrypt = require("bcrypt");
const FormData = require("form-data");

const get_all_medicalStaffs_bykind = (medicalStaffName) => {
  return (req, res) => {
    axios
      .get(`http://127.0.0.1:5007/api/${medicalStaffName}`)
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((err) => {
        console.log(err.message);
        if (!err.response?.status) return res.sendStatus(500);
        return res.status(err.response.status).json(err.response.data);
      });
  };
};

const get_one_medicalStaff_bykind_id = (req, res) => {
  res.status(200).json(req.medicalStaff);
};

const create_one_medicalStaff_bykind = (medicalStaffName) => {
  return async (req, res) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "request body is required." });
    }

    const data = req.body;
    console.log(data);

    try {
      //encrypt the password
      data.password = await bcrypt.hash(data.password, 10);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:5007/api/${medicalStaffName}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      res.status(201).json(response.data.createdMedicalStaff);
    } catch (err) {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    }
  };
};

const update_one_medicalStaff_bykind_id = (medicalStaffName) => {
  return (req, res) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "request body is required." });
    }
    axios
      .put(
        `http://127.0.0.1:5007/api/${medicalStaffName}/${req.medicalStaff._id}`,
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((err) => {
        if (!err.response?.status) return res.sendStatus(500);
        res.status(err.response.status).json(err.response.data);
      });
  };
};

const update_image_medicalStaff_bykind_id = (medicalStaffName) => {
  return async (req, res) => {
    const file_id = req.medicalStaff?.image ? req.medicalStaff.image : null;
    const formData = new FormData();
    const { file } = req.files;
    formData.append("file", file.data, {
      filename: file.name,
      contentType: file.mimetype,
    });
    if (file_id) {
      try {
        await axios
          .delete(`http://127.0.0.1:5004/files/images/${file_id}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((err) => {
            if (!err.response?.status) return res.sendStatus(500);
            return res.status(err.response.status).json(err.response.data);
          });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
      }
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:5004/upload/images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = {
        image: response.data.file.id,
      };
      try {
        const response1 = await axios.put(
          `http://127.0.0.1:5007/api/${medicalStaffName}/${req.medicalStaff._id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        res.status(200).json(response1.data);
      } catch (err) {
        if (!err.response?.status) return res.sendStatus(500);
        return res.status(err.response.status).json(err.response.data);
      }
    } catch (err) {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    }
  };
};

const display_image_medicalStaff_bykind_id = (req, res) => {
  const file_id = req.medicalStaff?.image ? req.medicalStaff.image : null;
  if (file_id) {
    try {
      axios
        .get(`http://127.0.0.1:5004/files/images/${file_id}`, {
          responseType: "stream",
        })
        .then((response) => {
          response.data.pipe(res);
        })
        .catch((err) => {
          if (!err.response?.status) return res.send(err.message);
          return res.status(err.response.status).json(err.response.data);
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res
      .status(404)
      .json({ message: "this medicalStaff does not have an image." });
  }
};

const delete_one_medicalStaff_bykind_id = (medicalStaffName) => {
  return async (req, res) => {
    try {
      const medicalStaff_id = req.medicalStaff._id;
      const file_id = req.medicalStaff?.image ? req.medicalStaff.image : null;

      await axios.delete(
        `http://127.0.0.1:5007/api/${medicalStaffName}/${medicalStaff_id}`
      );

      if (file_id) {
        try {
          await axios
            .delete(`http://127.0.0.1:5004/files/images/${file_id}`)
            .then((response) => {
              console.log(response.data);
            })
            .catch((err) => {
              if (!err.response?.status) return res.sendStatus(500);
              return res.status(err.response.status).json(err.response.data);
            });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error.message });
        }
      }

      await axios.delete(
        `http://localhost:5008/api/absences/medicalStaffs/${medicalStaff_id}`
      );

      await axios.delete(
        `http://localhost:5009/api/tasks/medicalStaffs/${medicalStaff_id}`
      );

      res.status(200).json({
        message: `the ${medicalStaffName.substring(
          0,
          medicalStaffName.length - 1
        )} deleted successfully`,
      });
    } catch (err) {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    }
  };
};

module.exports = {
  get_all_medicalStaffs_bykind,
  get_one_medicalStaff_bykind_id,
  create_one_medicalStaff_bykind,
  update_one_medicalStaff_bykind_id,
  update_image_medicalStaff_bykind_id,
  display_image_medicalStaff_bykind_id,
  delete_one_medicalStaff_bykind_id,
};
