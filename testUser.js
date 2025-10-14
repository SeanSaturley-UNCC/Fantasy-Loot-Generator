// Make sure to run 'npm install bcrypt'
// Designed to test if the User.js works correctly with MongoDB
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User'); 

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // creates test user
    const user = new User({
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: hashedPassword
    });

    await user.save();
    console.log('✅ Test user created:', user);

    const found = await User.findOne({ email: 'test@example.com' });
    console.log('✅ User found:', found);

    // delete test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test user deleted');

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

test();
