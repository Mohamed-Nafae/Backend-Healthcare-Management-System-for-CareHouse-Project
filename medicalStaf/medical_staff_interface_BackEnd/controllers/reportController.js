const axios = require("axios");
const FormData = require("form-data");

const download_report_id = async (req, res) => {
  const report_id = req.params.idR;
  if (!req.patient.medical_reports.includes(report_id)) {
    return res
      .status(403)
      .json({ message: "this patient does not have this report!" });
  }
  try {
    const response = await axios.get(
      `http://localhost:5005/api/reports/${report_id}`
    );
    try {
      const response2 = await axios.get(
        `http://127.0.0.1:5004/files/reports/${response.data.report_content}`,
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

//create_one_report_in_doctor_id_in_patient_id_in_medicalFolder_id
const create_one_report = async (req, res) => {
  const patient_id = req.patient._id;
  const medical_folder_id = req.patient.medical_folder;
  const doctor_id = req.medicalStaff._id;
  const formData = new FormData();
  const { file } = req.files;
  let report_content;
  let report_id;

  formData.append("file", file.data, {
    filename: file.name,
    contentType: file.mimetype,
  });

  try {
    const response1 = await axios.post(
      "http://127.0.0.1:5004/upload/reports",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    report_content = response1.data.file.id;
    const data_report = {
      patient: patient_id,
      doctor: doctor_id,
      report_content: report_content,
    };

    const response2 = await axios.post(
      `http://localhost:5005/api/reports`,
      data_report,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    report_id = response2.data.report._id;
    const response3 = await axios.put(
      `http://127.0.0.1:5003/api/patients/${patient_id}`,
      {
        medical_reports: report_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response4 = await axios.put(
      `http://127.0.0.1:5002/api/medicalFolders/${medical_folder_id}`,
      {
        reports: report_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response5 = await axios.post(
      `http://127.0.0.1:5007/api/doctors/${doctor_id}/reports/${report_id}`
    );
    return res.status(201).json(response2.data);
  } catch (err) {
    console.log(err.message);
    if (!err.response?.status) return res.sendStatus(500);
    return res.status(err.response.status).json(err.response.data);
  }
};

module.exports = {
  download_report_id,
  create_one_report,
};
