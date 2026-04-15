const axios = require("axios");

const get_one_medicalFolder_id_info = (req, res) => {
  const medical_folder_id = req.patient.medical_folder;
  if (!medical_folder_id) {
    return res
      .status(403)
      .json({ message: "this patient does not have a medical folder!" });
  }
  axios
    .get(`http://localhost:5002/api/medicalFolders/${medical_folder_id}`)
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

const download_medicalFolder_patient_id = async (req, res) => {
  const medical_folder_id = req.patient.medical_folder;
  if (!medical_folder_id) {
    return res
      .status(403)
      .json({ message: "this patient does not have a medical folder!" });
  }
  try {
    const response = await axios.get(
      `http://localhost:5002/api/medicalFolders/${medical_folder_id}`
    );
    try {
      const response2 = await axios.get(
        `http://127.0.0.1:5004/files/medicalFolders/${response.data.medicalFolder_content}`,
        {
          responseType: "stream",
        }
      );
      const contentDisposition = response2.headers["content-disposition"];
      const filename = contentDisposition
        .split("filename=")[1]
        .replace(/"/g, "");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader("Content-Type", "application/pdf");

      return response2.data.pipe(res);
    } catch (err) {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    }
  } catch (err) {
    if (!err.response?.status) return res.sendStatus(500);
    return res.status(err.response.status).json(err.response.data);
  }
};

module.exports = {
  download_medicalFolder_patient_id,
  get_one_medicalFolder_id_info,
};
