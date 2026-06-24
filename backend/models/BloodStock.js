const mongoose = require('mongoose');

const BloodStockSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    units: {
      type: Number,
      required: true,
      default: 0
    },
    max: {
      type: Number,
      required: true,
      default: 50
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodStock', BloodStockSchema);
