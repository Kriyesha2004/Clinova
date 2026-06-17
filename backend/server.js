const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🍃 Connected seamlessly to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('Clinova Backend API is running...');
});

// Import Auth Routes (We will make this in Step 5)
app.use('/api/auth', require('./routes/auth'));

// Import Alerts Routes
app.use('/api/alerts', require('./routes/alerts'));

// Import Messages Routes
app.use('/api/messages', require('./routes/messages'));

// Import City Visits Routes
app.use('/api/city-visits', require('./routes/cityVisits'));

// Import Complaints Routes
app.use('/api/complaints', require('./routes/complaints'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});