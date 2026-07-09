const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = [
      { name: 'MOH Admin', email: 'moh@clinova.com', password: 'moh123', dashboardType: 'moh' },
      { name: 'PHI Admin', email: 'phi@clinova.com', password: 'phi123', dashboardType: 'phi' },
      { name: 'Hospital Admin', email: 'hospital@clinova.com', password: 'hospital123', dashboardType: 'hospital' }
    ];

    for (const u of users) {
      const existingUser = await User.findOne({ email: u.email });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        const newUser = new User({
          name: u.name,
          email: u.email,
          password: hashedPassword,
          dashboardType: u.dashboardType
        });
        await newUser.save();
        console.log(`Seeded user: ${u.email}`);
      } else {
        console.log(`User already exists: ${u.email}`);
      }
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
