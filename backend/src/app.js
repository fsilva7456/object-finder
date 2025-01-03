const express = require('express');
const morgan = require('morgan');
const config = require('./utils/config');
const logger = require('./utils/logger');

// Import routes
const commandRouter = require('./routes/command');
const telemetryRouter = require('./routes/telemetry');
const detectionRouter = require('./routes/detection');
const mapRouter = require('./routes/map');

const app = express();

// Middleware
app.use(morgan('dev', { stream: logger.stream }));
app.use(express.json({ limit: config.MAX_REQUEST_SIZE }));
app.use(express.urlencoded({ extended: true, limit: config.MAX_REQUEST_SIZE }));

// Routes
app.use(`${config.API_PREFIX}/command`, commandRouter);
app.use(`${config.API_PREFIX}/telemetry`, telemetryRouter);
app.use(`${config.API_PREFIX}/detection`, detectionRouter);
app.use(`${config.API_PREFIX}/map`, mapRouter);

// Basic health check route
app.get('/health', (req, res) => {
    logger.debug('Health check requested');
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', { 
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });

    res.status(500).json({
        error: 'Internal server error',
        message: config.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    logger.warn('Route not found', {
        path: req.path,
        method: req.method,
        ip: req.ip
    });
    
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

module.exports = app;