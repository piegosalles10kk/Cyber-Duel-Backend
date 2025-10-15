const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberduel';
    
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('🔍 Connection String:', process.env.MONGODB_URI ? 'Using .env' : 'Using default');
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err.message);
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB Reconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB Connection Closed (App Termination)');
  process.exit(0);
});

module.exports = dbConnect;