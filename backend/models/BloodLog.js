const mongoose = require('mongoose');

const BloodLogSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      required: true,
      trim: true
    },
    units: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['received', 'dispensed']
    },
    dest: {
      type: String,
      required: true,
      trim: true
    },
    time: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodLog', BloodLogSchema);
