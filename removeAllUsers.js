// Make sure to run 'npm install bcrypt'
// Designed to test if the User.js works correctly with MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User'); 
const { Session } = require('./models/Session');

async function test() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    console.log('🗑️  Removing all users...');
    const userResult = await User.deleteMany({});
    console.log(`✅ Removed ${userResult.deletedCount} users`);

    console.log('🗑️  Removing all sessions...');
    const sessionResult = await Session.deleteMany({});
    console.log(`✅ Removed ${sessionResult.deletedCount} sessions`);

    console.log('🔌 Closing MongoDB connection...');
    mongoose.connection.close();
    console.log('✅ Database cleanup completed successfully!');
  } catch (err) {
    console.error('❌ Error during database cleanup:', err);
    mongoose.connection.close();
  }
}
 
test();
