const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Simple in-memory sessions (replace with Redis/DB in production)
const sessions = new Map();

// Generate simple session token
function generateSessionToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'seeker' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    // Create session
    const token = generateSessionToken();
    sessions.set(token, { userId: user._id.toString(), createdAt: Date.now() });
    
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    // Create session
    const token = generateSessionToken();
    sessions.set(token, { userId: user._id.toString(), createdAt: Date.now() });
    
    console.log('✅ Session created:', token);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export sessions for middleware
module.exports.sessions = sessions;
