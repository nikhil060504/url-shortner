import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Get current indexes
    const indexes = await usersCollection.indexes();
    console.log('Current indexes:', indexes);

    // Check if username_1 index exists
    const usernameIndex = indexes.find(index => index.name === 'username_1');
    
    if (usernameIndex) {
      console.log('Found problematic username_1 index. Dropping it...');
      await usersCollection.dropIndex('username_1');
      console.log('✅ Successfully dropped username_1 index');
    } else {
      console.log('No username_1 index found');
    }

    // Optionally, clear all users with null username (if any exist)
    const result = await usersCollection.deleteMany({ username: null });
    console.log(`Deleted ${result.deletedCount} users with null username`);

    console.log('✅ Database fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

fixDatabase();

