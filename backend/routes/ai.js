const express = require('express');
const router = express.Router();
const PredictionReport = require('../models/PredictionReport');

router.post('/predict', async (req, res) => {
  try {
    // Using 127.0.0.1 instead of localhost to prevent IPv6 resolution issues in Node 18+
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    
    const response = await fetch(`${aiServiceUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: 'AI Service Error', error: errorData });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying to AI service:', error);
    res.status(500).json({ message: 'Failed to communicate with AI Service', error: error.message });
  }
});

// POST /reports
router.post('/reports', async (req, res) => {
  try {
    const report = new PredictionReport(req.body);
    const saved = await report.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error saving prediction report:', error);
    res.status(500).json({ message: 'Failed to save prediction report', error: error.message });
  }
});

// GET /reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await PredictionReport.find().sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching prediction reports:', error);
    res.status(500).json({ message: 'Failed to fetch prediction reports', error: error.message });
  }
});

// DELETE /reports/:id
router.delete('/reports/:id', async (req, res) => {
  try {
    const deleted = await PredictionReport.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report deleted successfully', data: deleted });
  } catch (error) {
    console.error('Error deleting prediction report:', error);
    res.status(500).json({ message: 'Failed to delete prediction report', error: error.message });
  }
});

module.exports = router;
