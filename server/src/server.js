import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedInitialData } from './utils/seedData.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  await connectDB();
  await seedInitialData();

  server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🏃 ANTI-DRUG MOVEMENT MARATHON RUN 2026 BACKEND SERVER`);
    console.log(`📍 Location: Adoni, Andhra Pradesh, India`);
    console.log(`🏛️ Organizers: Chinmaya Mission & Chinmaya Yuva Kendra`);
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
  });
};

// Graceful Shutdown for Load Balancers, PM2, Docker, & Cloud Deployments
const gracefulShutdown = (signal) => {
  console.log(`\n[Server Shutdown] Received signal: ${signal}. Closing HTTP server gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('[Server Shutdown] HTTP server closed. Closing MongoDB connection...');
      try {
        await mongoose.connection.close(false);
        console.log('[Server Shutdown] MongoDB connection closed cleanly.');
        process.exit(0);
      } catch (err) {
        console.error('[Server Shutdown Error]:', err.message);
        process.exit(1);
      }
    });

    // Force shutdown after 10s if connections do not close cleanly
    setTimeout(() => {
      console.error('[Server Shutdown] Forcing shutdown after timeout.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer().catch((err) => {
  console.error('[Server Startup Failure]:', err.message);
});
