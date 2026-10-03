import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anti_drug_marathon_2026';
    
    mongoose.connection.on('connected', () => {
      console.log('[MongoDB] Connection established successfully.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB Error]:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB Warning] Disconnected from MongoDB cluster.');
    });

    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: true,
    });

    console.log(`[MongoDB] Connected to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      console.error('[MongoDB Fatal] Database connection required in production mode.');
    }
    return false;
  }
};

export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};
