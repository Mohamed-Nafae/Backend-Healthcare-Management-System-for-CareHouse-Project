const verifyRoles = (req, res, next) => {
  if (!req || !req.role) return res.sendStatus(401);
  console.log(req.role);
  if (req.role !== 2002) return res.sendStatus(401);
  next();
};

module.exports = verifyRoles;
