const User = require('../models/User');
const { sessions } = require('../controllers/authController');

const protect = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  
  // Check if session exists
  const session = sessions.get(token);
  if (!session) {
    return res.status(401).json({ message: 'Invalid session' });
  }

  try {
    // Get user from session
    const user = await User.findById(session.userId).select('-password');
    if (!user) {
      sessions.delete(token); // Clean up invalid session
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// Optional auth - sets req.user if token exists, but doesn't reject if no token
const optionalAuth = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // No token, continue without user
  }

  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);
  
  if (session) {
    try {
      const user = await User.findById(session.userId).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (err) {
      console.error('Optional auth error:', err);
    }
  }
  
  next();
};

module.exports = protect;
module.exports.protect = protect;
module.exports.optionalAuth = optionalAuth;
