const verifyRoles = (allowedRole) => {
  return (req, res, next) => {
    console.log(req.role);
    if (!req || !req.role) return res.sendStatus(401);
    if (req.role !== allowedRole) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
