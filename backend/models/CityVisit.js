const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Delayed'],
    default: 'Pending'
  },
  photo: {
    type: String, // Base64 string data or URL
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const CityVisitSchema = new mongoose.Schema(
  {
    weekStart: {
      type: String, // 'YYYY-MM-DD' representing Monday of that week
      required: true,
      unique: true
    },
    visits: [VisitSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('CityVisit', CityVisitSchema);
