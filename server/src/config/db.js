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

    // Drop stale/legacy email_1 index from users collection if present to prevent duplicate null errors
    try {
      const usersCol = conn.connection.collection('users');
      const indexes = await usersCol.indexes();
      const emailIdx = indexes.find((i) => i.name === 'email_1' || (i.key && i.key.email));
      if (emailIdx) {
        await usersCol.dropIndex(emailIdx.name);
        console.log(`[MongoDB] Cleaned up legacy '${emailIdx.name}' index on users collection.`);
      }
    } catch (idxErr) {
      // Ignore if collection doesn't exist yet or index is already absent
    }

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
