const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User session missing.'
      });
    }

    const userRole = req.user.role ? req.user.role.toLowerCase() : '';
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedAllowed.includes(userRole) && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Action requires one of the following roles: [${allowedRoles.join(', ')}]. Your role is '${req.user.role}'.`
      });
    }

    next();
  };
};

module.exports = { requireRole };
