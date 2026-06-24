const mongoose = require('mongoose');

const DengueContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['prevention', 'safety', 'help'],
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String, // Stored as Base64 data string
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DengueContent', DengueContentSchema);
