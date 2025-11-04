// Seed admin user with 250 random items
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const { Loot, generateItem } = require('./models/lootModel');

async function seedAdminInventory() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clean up existing data first
    console.log('🧹 Cleaning up existing data...');
    
    // Delete all existing loot items
    const deleteResult = await Loot.deleteMany({});
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing loot items`);
    
    // Reset all user inventories to empty arrays
    const updateResult = await User.updateMany({}, { $set: { inventory: [] } });
    console.log(`📝 Reset inventories for ${updateResult.modifiedCount} users`);

    // 1. Get the user with username admin
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      console.error('❌ Admin user not found');
      return;
    }
    console.log('✅ Found admin user:', adminUser.username);

    // 2. Create 250 random items and collect their IDs
    const itemIds = [];
    console.log('🎲 Generating 250 random items...');

    for (let i = 0; i < 250; i++) {
      // Generate a random item
      const itemData = generateItem();
      
      // Save the item to the database
      const savedItem = await Loot.create(itemData);
      
      // Add the item's ID to our array
      itemIds.push(savedItem._id);
      
      // Log progress every 50 items
      if ((i + 1) % 50 === 0) {
        console.log(`📦 Created ${i + 1}/250 items`);
      }
    }

    console.log('✅ All 250 items created successfully');

    // 3. Set the user's inventory to this array
    await User.updateOne(
      { _id: adminUser._id },
      { $set: { inventory: itemIds } }
    );

    console.log('✅ Admin user inventory updated with 250 items');
    console.log(`📊 Total items in admin inventory: ${itemIds.length}`);

    mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (err) {
    console.error('❌ Error:', err);
    mongoose.connection.close();
  }
}

seedAdminInventory();
