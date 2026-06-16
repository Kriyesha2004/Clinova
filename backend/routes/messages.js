const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET all messages
router.get('/all', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET messages for MOH (all messages)
router.get('/moh/inbox', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });
    const unreadCount = await Message.countDocuments({ read: false });
    res.json({ messages, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET messages by sender (PHI or MOH)
router.get('/from/:sender', async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.params.sender }).sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new message
router.post('/send', async (req, res) => {
  const { sender, senderName, senderId, message, attachments } = req.body;

  if (!sender || !message || !senderName) {
    return res.status(400).json({ message: 'Sender, senderName, and message are required' });
  }

  try {
    const newMessage = new Message({
      sender,
      senderName,
      senderId,   // ✅ now accepts any string like "phi-001"
      message,
      attachments: attachments || [],
      timestamp: new Date(),
    });

    const savedMessage = await newMessage.save();
    res.status(201).json({
      message: 'Message sent successfully',
      data: savedMessage,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH mark all messages as read
router.patch('/mark-all/read', async (req, res) => {
  try {
    await Message.updateMany({ read: false }, { read: true });
    res.json({ message: 'All messages marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH mark message as read
router.patch('/:id/read', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// DELETE a message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted', data: message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
