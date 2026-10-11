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
import userRoutes from './routes/userRoutes.js';
import communityServiceRoutes from './routes/communityServiceRoutes.js';

const app = express();


// Security Headers & CORS
app.use(helmet({ crossOriginResourcePolicy: false }));

// Merge env origins with hardcoded ones
const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [];

const allowedOriginsSet = new Set([
  'https://chinmayamissionadoni.org',
  'https://www.chinmayamissionadoni.org',
  'https://marathon.chinmayamissionadoni.org',
  'https://chinmaya-mission-adoni.vercel.app',
  'https://chinmaya-mission-adoni-admin.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
  'http://localhost:3001',
  ...envOrigins,
]);

// Regex: allow ALL Vercel preview/production URLs for this project (website, admin, and marathon subdomain)
const vercelPreviewPattern = /^https:\/\/chinmaya-mission-adoni(-[a-z0-9]+)*\.vercel\.app$/;
const vercelAdminPattern = /^https:\/\/chinmaya-mission-adoni-admin(-[a-z0-9]+)*\.vercel\.app$/;
const vercelMarathonPattern = /^https:\/\/(chinmaya-)?marathon(-[a-z0-9]+)*\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, Render health checks)
      if (!origin) return callback(null, true);
      // Allow exact matches
      if (allowedOriginsSet.has(origin)) return callback(null, true);
      // Allow all Vercel preview deployments for this project (website, admin & marathon)
      if (
        vercelPreviewPattern.test(origin) ||
        vercelAdminPattern.test(origin) ||
        vercelMarathonPattern.test(origin)
      ) {
        return callback(null, true);
      }
      // In development, allow everything
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
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
app.use('/api/users', userRoutes);
app.use('/api/community-services', communityServiceRoutes);
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
