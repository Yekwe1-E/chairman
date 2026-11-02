const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

// ── Startup Guards ───────────────────────────────────────────────────────────
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not set. Exiting.');
  process.exit(1);
}

const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/auth');
const houseRoutes = require('./routes/houses');
const flockRoutes = require('./routes/flocks');
const activityRoutes = require('./routes/activities');
const mortalityRoutes = require('./routes/mortality');
const eggRoutes = require('./routes/eggs');
const feedRoutes = require('./routes/feed');
const medicationRoutes = require('./routes/medications');
const vaccinationRoutes = require('./routes/vaccinations');
const inventoryRoutes = require('./routes/inventory');
const equipmentRoutes = require('./routes/equipment');
const expenseRoutes = require('./routes/expenses');
const salesRoutes = require('./routes/sales');
const customerRoutes = require('./routes/customers');
const supplierRoutes = require('./routes/suppliers');
const reportRoutes = require('./routes/reports');
const notificationRoutes = require('./routes/notifications');
const auditRoutes = require('./routes/audit');

const app = express();

// ── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false // Disabled so inline scripts in frontend HTML work
}));

// ── CORS ─────────────────────────────────────────────────────────────────────
// CORS: if FRONTEND_URL env var is set, restrict to that origin only.
// If not set (default), allow all origins — works on any Render/local URL.
app.use(cors(
  process.env.FRONTEND_URL
    ? { origin: process.env.FRONTEND_URL, credentials: true }
    : {}
));

// ── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many registration attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// ── Static Serving for Frontend ───────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Rate limiters applied before route handlers ───────────────────────────────
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', registerLimiter);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/flocks', flockRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/mortality', mortalityRoutes);
app.use('/api/eggs', eggRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit', auditRoutes);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Automated Poultry Farm Management System (APFMS)',
    timestamp: new Date().toISOString()
  });
});

// ── SPA Fallback ──────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found.' });
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🐔 APFMS Server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard UI: http://localhost:${PORT}/dashboard.html`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================================`);
});

module.exports = app;
