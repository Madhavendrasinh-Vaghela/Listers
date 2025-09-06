// routes/users.js

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// ROUTE 1: Register a new user (handles POST requests at /api/users/register)
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and save the new user
    const newUser = new User({
      email: email,
      password: hashedPassword
    });
    const savedUser = await newUser.save();
    
    res.status(201).json({
        msg: "User registered successfully!",
        user: {
            id: savedUser.id,
            email: savedUser.email
        }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const jwt = require('jsonwebtoken'); // Make sure to require jsonwebtoken at the top

// ROUTE 2: Login an existing user (handles POST requests at /api/users/login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. Compare the submitted password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 4. If credentials are correct, create a JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;