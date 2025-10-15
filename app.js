const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const dbConnect = require('./config/dbConnect');

const app = express();

// Database Connection
dbConnect();

// Rate Limiter
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: { success: false, error: 'Too many requests, please try again later' }
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use('/api/', limiter);

// Routes
app.use('/api/v1', require('./routes'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CyberDuel API is running', 
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
    version: '1.0.0'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    error: config.nodeEnv === 'production' ? 'Internal server error' : err.message 
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 CyberDuel API Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api/v1`);
});

module.exports = app;