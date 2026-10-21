import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { isDBConnected } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate client dist directory across multiple potential runtime environments
const candidateDistPaths = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
  path.resolve(__dirname, '../public'),
  path.resolve(__dirname, '../dist'),
  path.resolve(process.cwd(), 'dist'),
];

const clientDistPath = candidateDistPaths.find(
  (p) => fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))
);
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
import thoughtRoutes from './routes/thoughtRoutes.js';
import webContentRoutes from './routes/webContentRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import sevaBookingRoutes from './routes/sevaBookingRoutes.js';
import siteSettingsRoutes from './routes/siteSettingsRoutes.js';

const app = express();

// Trust reverse proxies (Vercel, Render, Hostinger Nginx / LiteSpeed)
app.set('trust proxy', 1);

// Security Headers & CORS
app.use(helmet({ crossOriginResourcePolicy: false }));

// Merge env origins with hardcoded ones (sanitizing trailing slashes)
const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim().replace(/\/+$/, '')).filter(Boolean)
  : [];

const allowedOriginsSet = new Set([
  'https://chinmayamissionadoni.org',
  'https://www.chinmayamissionadoni.org',
  'https://marathon.chinmayamissionadoni.org',
  'https://chinmaya-mission-adoni.vercel.app',
  'https://chinmaya-mission-adoni-nine.vercel.app',
  'https://chinmaya-mission-adoni-admin.vercel.app',
  'https://marathon-chinmaya-mission-adoni.vercel.app',
  'https://marathon-chinmaya-mission-adoni.netlify.app',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
  'http://localhost:3001',
  ...envOrigins,
]);

// Regex: allow ALL Vercel & Netlify preview/production URLs for this project
const vercelPreviewPattern = /^https:\/\/chinmaya-mission-adoni(-[a-z0-9]+)*\.vercel\.app$/;
const vercelAdminPattern = /^https:\/\/chinmaya-mission-adoni-admin(-[a-z0-9]+)*\.vercel\.app$/;
const vercelMarathonPattern = /^https:\/\/(chinmaya-)?marathon(-[a-z0-9]+)*\.vercel\.app$/;
const netlifyPattern = /^https:\/\/.*(chinmaya|marathon).*\.netlify\.app$/;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, Render health checks)
    if (!origin) return callback(null, true);
    const sanitized = origin.replace(/\/+$/, '');
    // Allow exact matches
    if (allowedOriginsSet.has(sanitized)) return callback(null, true);
    // Allow all Vercel & Netlify deployments for this project
    if (
      vercelPreviewPattern.test(sanitized) ||
      vercelAdminPattern.test(sanitized) ||
      vercelMarathonPattern.test(sanitized) ||
      netlifyPattern.test(sanitized)
    ) {
      return callback(null, true);
    }
    // In development, allow everything
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Auth-Scope',
    'x-auth-scope',
    'Accept',
    'Origin',
  ],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Production Health & Load Balancer Readiness Check
const healthHandler = (req, res) => {
  const dbStatus = isDBConnected();
  const statusCode = dbStatus ? 200 : 503;

  res.status(statusCode).json({
    status: dbStatus ? 'ok' : 'degraded',
    dbConnected: dbStatus,
    event: 'ANTI-DRUG MOVEMENT MARATHON RUN 2026',
    organizers: 'Chinmaya Mission, Adoni & Chinmaya Yuva Kendra, Adoni',
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    timestamp: new Date().toISOString(),
  });
};

app.get(['/api/health', '/health'], healthHandler);

// When running without client dist, fallback root to health check
if (!clientDistPath) {
  app.get('/', healthHandler);
}

// Mount API Routes (under /api/* and fallback for root when standalone)
const routes = [
  { path: 'auth', router: authRoutes },
  { path: 'users', router: userRoutes },
  { path: 'community-services', router: communityServiceRoutes },
  { path: 'registrations', router: registrationRoutes },
  { path: 'events', router: eventRoutes },
  { path: 'banners', router: bannerRoutes },
  { path: 'activities', router: activityRoutes },
  { path: 'faqs', router: faqRoutes },
  { path: 'content', router: contentRoutes },
  { path: 'admin', router: adminRoutes },
  { path: 'contact', router: contactRoutes },
  { path: 'homepage', router: homepageRoutes },
  { path: 'footer', router: footerRoutes },
  { path: 'media', router: mediaRoutes },
  { path: 'thoughts', router: thoughtRoutes },
  { path: 'admin/content', router: webContentRoutes },
  { path: 'volunteers', router: volunteerRoutes },
  { path: 'seva-bookings', router: sevaBookingRoutes },
  { path: 'site-settings', router: siteSettingsRoutes },
  { path: 'site-status', router: siteSettingsRoutes },
];

routes.forEach(({ path: routePath, router }) => {
  app.use(`/api/${routePath}`, router);
  // Only mount at root if client dist is not being served to prevent collision with SPA
  if (!clientDistPath) {
    app.use(`/${routePath}`, router);
  }
});

// Serve client static build files
if (clientDistPath) {
  app.use(
    express.static(clientDistPath, {
      maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
      index: false,
    })
  );
}

// Global API 404 handler
app.all(['/api', '/api/*'], (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
    errorCode: 'ROUTE_NOT_FOUND',
  });
});

// Single Page Application (SPA) Catch-all for Client Routing
if (clientDistPath) {
  const indexHtmlPath = path.join(clientDistPath, 'index.html');
  app.get('*', (req, res, next) => {
    // If request has a file extension and wasn't matched by express.static, return 404
    const ext = path.extname(req.path);
    if (ext && ext !== '.html') {
      return res.status(404).send('Asset not found');
    }

    res.sendFile(indexHtmlPath, (err) => {
      if (err) {
        next(err);
      }
    });
  });
}

// Global 404 Route for remaining unhandled requests
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
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
