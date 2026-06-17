const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// POST a new complaint/message
router.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    const newComplaint = new Complaint({
      name,
      email,
      message
    });

    const saved = await newComplaint.save();
    res.status(201).json({ message: 'Message submitted successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all complaints (accessed by PHI)
router.get('/all', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE/resolve a complaint
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Complaint.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json({ message: 'Complaint resolved and deleted successfully', data: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
