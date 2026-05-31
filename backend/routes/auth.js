const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/* ==========================================
   ROUTE 1: REGISTER A NEW USER
   POST /api/auth/register
========================================== */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, dashboardType } = req.body; // ← add dashboardType

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already registered with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      dashboardType  // ← add this
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

/* ==========================================
   ROUTE 2: LOGIN USER
   POST /api/auth/login
========================================== */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // ← Replace your if/else password check with this
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, dashboardType: user.dashboardType }, // ← from DB, not hardcoded
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      dashboardType: user.dashboardType,  // ← from DB
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

module.exports = router;


// MOH dahboard - passwor  moh123 - moh@clinova.com
// PHI dahboard - password phi123 - phi@clinova.com
// Hospital bashboard - password hospital123 - hospital@clinova.com