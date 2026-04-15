const jwt = require("jsonwebtoken");
require("dotenv").config();

const verfyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    // invalid token
    req._id = decoded._id;
    req.email_address = decoded.email_address;
    req.role = decoded.role;
    next();
  });
};

module.exports = verfyJWT;
