const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.isSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user && user.role === 'superAdmin') {
      return next();
    }
    res.status(403).json({ message: 'Forbidden: Super admin access required' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying super admin role' });
  }
};
