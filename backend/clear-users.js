import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function clearUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Drop the entire users collection (this will remove all indexes too)
    await usersCollection.drop();
    console.log('✅ Users collection dropped successfully!');
    
    console.log('✅ You can now register users without errors');
    
  } catch (error) {
    if (error.message.includes('ns not found')) {
      console.log('Users collection does not exist - that\'s fine!');
    } else {
      console.error('❌ Error clearing users:', error);
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

clearUsers();
