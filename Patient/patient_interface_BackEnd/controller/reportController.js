const axios = require("axios");

const get_reports_patient_id = (req, res) => {
  axios
    .get(`http://localhost:5005/api/reports/patients/${req.params.idP}`)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      res.status(err.response.status).json(err.response.data);
    });
};

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

module.exports = {
  get_reports_patient_id,
  download_report_id,
};
