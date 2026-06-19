const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER NEW ACCOUNT ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, company } = req.body;

    // Check if user account already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address.' });
    }

    // Hash the password securely using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Instantiate and save data mapping configuration
    user = new User({
      email,
      password: hashedPassword,
      role,
      company: role === 'hr' ? company : null
    });

    await user.save();
    res.status(201).json({ success: true, message: 'Account initialized successfully!' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server processing error during registration.', error: error.message });
  }
});

// 2. SIGN IN VALIDATION ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Verify user exists and role choice checks out
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials provided.' });
    }

    if (user.role !== role) {
      return res.status(400).json({ success: false, message: 'Selected role does not match account identity metadata.' });
    }

    // Compare encrypted passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password. Please try again.' });
    }

    // Generate web signature security token (JWT)
    const token = jwt.sign({ id: user._id, role: user.role }, 'JWT_SECRET_PASSPHRASE', { expiresIn: '24h' });

    res.status(200).json({
      success: true,
      message: `Welcome back, logged in successfully as ${role}.`,
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server processing error during authentication.', error: error.message });
  }
});

module.exports = router;