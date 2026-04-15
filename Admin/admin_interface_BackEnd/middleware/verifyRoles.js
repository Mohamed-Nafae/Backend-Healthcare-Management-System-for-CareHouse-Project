const verifyRoles = (req, res, next) => {
  if (!req || !req.role) return res.sendStatus(401);

  if (req.role !== 5168) return res.sendStatus(401);
  next();
};

module.exports = verifyRoles;
