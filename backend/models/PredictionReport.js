const mongoose = require('mongoose');

const PredictionReportSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    TEM: { type: Number, required: true },
    TMAX: { type: Number, required: true },
    Tm: { type: Number, required: true },
    SLP: { type: Number, required: true },
    H: { type: Number, required: true },
    PP: { type: Number, required: true },
    VV: { type: Number, required: true },
    V: { type: Number, required: true },
    VM: { type: Number, required: true },
    Week: { type: Number, required: true },
    prediction: {
      type: String,
      required: true,
    },
    risk_level_code: {
      type: Number,
      required: true,
    },
    recommendation: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      default: 'MOH Officer',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PredictionReport', PredictionReportSchema);
