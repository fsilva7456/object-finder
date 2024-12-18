const http = require('http');
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');
const WebSocketServer = require('./websocket');

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer(server);

// Start server
server.listen(config.PORT, () => {
    logger.info(`Server started in ${config.NODE_ENV} mode on port ${config.PORT}`);
    logger.info(`Health check available at http://localhost:${config.PORT}/health`);
    logger.info(`WebSocket server enabled for real-time telemetry`);
});

// Handle process events
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err);
    process.exit(1);
});

// Graceful shutdown
const shutdown = () => {
    logger.info('Shutting down server...');
    server.close(() => {
        logger.info('Server shutdown complete');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);