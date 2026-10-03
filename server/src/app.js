import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { isDBConnected } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';

const app = express();

// Security Headers & CORS
app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : true;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Production Health & Load Balancer Readiness Check
app.get('/api/health', (req, res) => {
  const dbStatus = isDBConnected();
  const statusCode = dbStatus ? 200 : 503;

  res.status(statusCode).json({
    status: dbStatus ? 'ok' : 'degraded',
    dbConnected: dbStatus,
    event: 'ANTI-DRUG MOVEMENT MARATHON RUN 2026',
    organizers: 'Chinmaya Mission Adoni & Chinmaya Yuva Kendra Adoni',
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/media', mediaRoutes);

// Global 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
    errorCode: 'ROUTE_NOT_FOUND',
  });
});

// Production Safe Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Express Error]:', err.stack || err.message);
  
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    success: false,
    message: isProduction && !err.isPublic ? 'An internal server error occurred' : err.message || 'Internal Server Error',
    errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR',
  });
});

export default app;
