const jwt = require('jsonwebtoken');
const { User } = require('../models/associations');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Combined middleware for admin authentication
const authenticateAdmin = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {
      adminMiddleware(req, res, next);
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

module.exports = { 
  authMiddleware, 
  adminMiddleware, 
  authenticateAdmin 
};
