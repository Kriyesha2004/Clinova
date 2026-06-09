const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['CRITICAL', 'WARNING', 'INFO'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    sentBy: {
      type: String,
      enum: ['MOH', 'SYSTEM'],
      required: true,
    },
    readBy: {
      type: [String], // Array of user IDs who have read this alert
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    details: {
      userId: String,
      action: String,
      location: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', AlertSchema);
