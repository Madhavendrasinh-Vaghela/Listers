// routes/admin.js
const router = require('express').Router();
const User = require('../models/user.model');
const EmailLog = require('../models/emailLog.model');
const auth = require('../middleware/auth');

// Middleware to check if user is an admin
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Admin resource. Access denied.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (Protected by auth and adminAuth)
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all email logs (Protected by auth and adminAuth)
router.get('/email-logs', [auth, adminAuth], async (req, res) => {
  try {
    const logs = await EmailLog.find().sort({ createdAt: -1 }); // Newest first
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;