const axios = require("axios");

const verify_admin_exist = (req, res, next) => {
  axios
    .get(`http://127.0.0.1:5010/api/admins/${req.params.id}`)
    .then((response) => {
      const admin_id = response.data._id;
      if (req._id !== admin_id) return res.sendStatus(401);
      next();
    })
    .catch((err) => {
      if (!err.response?.status) return res.sendStatus(500);
      return res.status(err.response.status).json(err.response.data);
    });
};

module.exports = verify_admin_exist;
