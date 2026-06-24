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
  .then(async () => {
    console.log('🍃 Connected seamlessly to MongoDB');
    // Seed initial dengue content if empty
    try {
      const DengueContent = require('./models/DengueContent');
      const count = await DengueContent.countDocuments();
      if (count === 0) {
        console.log('🌱 Seeding initial dengue resources...');
        await DengueContent.insertMany([
          {
            title: "How to Prevent Dengue",
            category: "prevention",
            content: "Dengue fever is a mosquito-borne tropical disease caused by the dengue virus. Prevention is our best shield. Follow these simple and effective ways to prevent dengue:\n\n1. Eliminate Standing Water: Weekly inspect and clean flower pots, gutters, tires, pet water bowls, and any containers that hold stagnant water where Aedes mosquitoes breed.\n2. Use Mosquito Repellent: Apply insect repellent containing DEET, Picaridin, or IR3535 to exposed skin when going outdoors.\n3. Wear Protective Clothing: Wear long-sleeved shirts, long pants, socks, and shoes, especially during early morning and late afternoon when mosquitoes are most active.\n4. Screen Your Home: Keep doors and windows closed or fit them with screens to keep mosquitoes outside. Use mosquito nets while sleeping.",
            image: ""
          },
          {
            title: "Is Your Area Infected? How to Stay Safe",
            category: "safety",
            content: "If you reside in or are visiting an active dengue transmission zone, extra precautions are necessary to safeguard yourself and your family:\n\n1. Avoid Outdoor Activities at Peak Times: Limit outdoor exposure during dawn and dusk, which are the peak biting times for Aedes mosquitoes.\n2. Indoor Insecticide Sprays: Use household aerosol insecticides or mosquito coils in indoor areas to clear adult mosquitoes.\n3. Community Cleanup Drives: Participate in or organize neighborhood cleanups to clear potential breeding sites from public spaces and empty land plots.\n4. Stay Updated on Alerts: Regularly check MOH alerts and live risk index to know which areas are high-risk zones.",
            image: ""
          },
          {
            title: "Basic Help & Symptoms Guidelines",
            category: "help",
            content: "Early detection and proper care can save lives. If you suspect dengue, watch closely for symptoms and take immediate action:\n\n1. Common Symptoms: Sudden high fever, severe headache, pain behind the eyes, joint and muscle pain, fatigue, nausea, vomiting, and skin rash (typically appearing 2-5 days after fever onset).\n2. Warning Signs (Seek Emergency Care Immediately): Severe abdominal pain, persistent vomiting, bleeding from gums or nose, blood in urine or stool, difficulty breathing, or extreme lethargy.\n3. Dos and Don'ts:\n   - DO: Rest completely and drink plenty of fluids (water, coconut water, ORS) to prevent dehydration.\n   - DO: Take paracetamol for fever and pain relief.\n   - AVOID: Non-steroidal anti-inflammatory drugs (NSAIDs) like aspirin, ibuprofen, or diclofenac, as they can worsen bleeding tendencies.\n4. Contact Information: Dial 1990 for emergency ambulance services, or call your nearest MOH office / public health clinic for assistance.",
            image: ""
          }
        ]);
        console.log('✅ Seeding completed.');
      }
    } catch (err) {
      console.error('❌ Error seeding database:', err);
    }
  })
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

// Import Dengue Content Routes
app.use('/api/dengue-content', require('./routes/dengueContent'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});