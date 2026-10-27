import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️  MONGO_URI not set. Running without database persistence.');
    return false;
  }
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected:', mongoose.connection.host);
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.warn('   Running in demo mode without database persistence.');
    return false;
  }
};

export default connectDB;
