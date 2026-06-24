const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['PHI', 'MOH', 'hospital'],
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
    attachments: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
