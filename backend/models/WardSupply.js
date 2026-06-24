const mongoose = require('mongoose');

const WardSupplySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Diagnostic', 'Therapeutic', 'Preventative', 'Equipment'],
      trim: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0
    },
    minTarget: {
      type: Number,
      required: true,
      default: 10
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WardSupply', WardSupplySchema);
