const User = require('../models/User');

// Usage: verifyRole(['admin']) or verifyRole(['owner', 'admin'])
const verifyRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const email = req.decoded?.email;
      const user = await User.findOne({ email });

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).send({ message: 'Forbidden access' });
      }

      req.currentUser = user;
      next();
    } catch (error) {
      res.status(500).send({ message: 'Server error checking role' });
    }
  };
};

module.exports = verifyRole;
