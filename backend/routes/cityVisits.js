const express = require('express');
const router = express.Router();
const CityVisit = require('../models/CityVisit');

// Helper to get current week's Monday as YYYY-MM-DD (local time)
function getMonday(d) {
  d = new Date(d);
  const day = d.getDay();
  // If Sunday (0), subtract 6 days. Otherwise, subtract (day - 1) days.
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  const monday = new Date(d.setDate(diff));
  
  const yyyy = monday.getFullYear();
  let mm = monday.getMonth() + 1;
  let dd = monday.getDate();
  
  if (mm < 10) mm = '0' + mm;
  if (dd < 10) dd = '0' + dd;
  
  return `${yyyy}-${mm}-${dd}`;
}

const DEFAULT_CITIES = [
  'Colombo Municipal Council',
  'Kolonnawa',
  'Kaduwela',
  'Nugegoda',
  'Maharagama',
  'Dehiwala',
  'Moratuwa',
  'Homagama'
];

// GET active week's schedule
router.get('/current', async (req, res) => {
  try {
    const mondayStr = getMonday(new Date());
    let doc = await CityVisit.findOne({ weekStart: mondayStr });
    
    if (!doc) {
      // Look for the most recent week's record
      const lastDoc = await CityVisit.findOne().sort({ weekStart: -1 });
      
      let visits;
      if (lastDoc && lastDoc.visits && lastDoc.visits.length > 0) {
        // Inherit the cities from the last week's route
        visits = lastDoc.visits.map((v) => ({
          city: v.city,
          status: 'Pending',
          photo: '',
          updatedAt: new Date()
        }));
      } else {
        // First-time setup, load default list of Colombo-area cities
        visits = DEFAULT_CITIES.map((city) => ({
          city,
          status: 'Pending',
          photo: '',
          updatedAt: new Date()
        }));
      }
      
      doc = new CityVisit({
        weekStart: mondayStr,
        visits
      });
      await doc.save();
    }
    
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST update a specific city visit
router.post('/update', async (req, res) => {
  const { weekStart, city, status, photo } = req.body;
  
  if (!weekStart || !city) {
    return res.status(400).json({ message: 'weekStart and city are required' });
  }
  
  try {
    let doc = await CityVisit.findOne({ weekStart });
    if (!doc) {
      return res.status(404).json({ message: 'Weekly schedule not found' });
    }
    
    const visitIndex = doc.visits.findIndex((v) => v.city === city);
    if (visitIndex === -1) {
      // If city does not exist in active schedule, add it
      doc.visits.push({
        city,
        status: status || 'Pending',
        photo: photo || '',
        updatedAt: new Date()
      });
    } else {
      // Update existing city visit details
      if (status !== undefined) doc.visits[visitIndex].status = status;
      if (photo !== undefined) doc.visits[visitIndex].photo = photo;
      doc.visits[visitIndex].updatedAt = new Date();
    }
    
    await doc.save();
    res.json({ message: 'City visit updated successfully', data: doc });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all weekly reports for MOH
router.get('/reports', async (req, res) => {
  try {
    const docs = await CityVisit.find().sort({ weekStart: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
