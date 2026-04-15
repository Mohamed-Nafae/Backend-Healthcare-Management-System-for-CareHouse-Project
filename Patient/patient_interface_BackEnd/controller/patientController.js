const axios = require("axios");
const FormData = require("form-data");
const bcrypt = require("bcrypt");

const get_one_patient = (req, res) => {
  res.status(200).json(req.patient);
};

const create_one_patient = async (req, res) => {
  let patient_id;
  let medical_folder_id;
  const data = JSON.parse(req.body.data);
  console.log(data);
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "request data is required." });
  }
  try {
    //encrypt the password
    data.password = await bcrypt.hash(data.password, 10);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  const formData = new FormData();
  const { file } = req.files;
  formData.append("file", file.data, {
    filename: file.name,
    contentType: file.mimetype,
  });
  try {
    const response = await axios.post(
      `http://127.0.0.1:5003/api/patients`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    patient_id = response.data.createdPatient._id;
    console.log(response.data);
  } catch (err) {
    if (!err.response?.status) return res.sendStatus(500);
    return res.status(err.response.status).json(err.response.data);
  }

  try {
    const response1 = await axios.post(
      "http://127.0.0.1:5004/upload/medicalFolders",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    medical_folder_id = response1.data.file.id;
    const data_medicalFolder = {
      patient: patient_id,
      medicalFolder_content: medical_folder_id,
    };
    try {
      const response2 = await axios.post(
        `http://localhost:5002/api/medicalFolders`,
        data_medicalFolder,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      medical_folder_id = response2.data.MedicalFolder._id;
    } catch (err) {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    }
  } catch (err) {
    if (!err.response?.status) return res.sendStatus(500);
    return res.status(err.response.status).json(err.response.data);
  }
  try {
    const response3 = await axios.put(
      `http://127.0.0.1:5003/api/patients/${patient_id}`,
      {
        medical_folder: medical_folder_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.status(201).json(response3.data);
  } catch (err) {
    if (!err.response?.status) return res.sendStatus(500);
    return res.status(err.response.status).json(err.response.data);
  }
};

const update_one_patient_id = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "request body is required." });
  }
  axios
    .put(`http://127.0.0.1:5003/api/patients/${req.params.idP}`, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const update_image_patient_id = async (req, res) => {
  const file_id = req.patient?.image ? req.patient.image : null;
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
        `http://127.0.0.1:5003/api/patients/${req.params.idP}`,
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

const display_image_patient_id = (req, res) => {
  const file_id = req.patient?.image ? req.patient.image : null;
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
    res.status(404).json({ message: "this patient does not have an image." });
  }
};

module.exports = {
  get_one_patient,
  update_image_patient_id,
  update_one_patient_id,
  create_one_patient,
  display_image_patient_id,
};
