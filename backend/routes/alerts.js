const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// GET all alerts for PHI Dashboard
router.get('/phi', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 }).limit(50);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET alert by ID
router.get('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new alert from MOH
router.post('/send', async (req, res) => {
  const { level, message, details, sentBy } = req.body;

  // Validate required fields
  if (!level || !message) {
    return res.status(400).json({ message: 'Level and message are required' });
  }

  try {
    const newAlert = new Alert({
      level,
      message,
      sentBy: sentBy || 'MOH',
      details: details || {},
      timestamp: new Date(),
    });

    const savedAlert = await newAlert.save();
    res.status(201).json({
      message: 'Alert sent successfully',
      alert: savedAlert,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH - Mark alert as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { readBy: userId } }, // Add userId to readBy if not already present
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({
      message: 'Alert marked as read',
      alert,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE alert
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET alerts filtered by level
router.get('/filter/level/:level', async (req, res) => {
  try {
    const alerts = await Alert.find({ level: req.params.level }).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
