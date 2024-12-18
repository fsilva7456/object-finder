const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

app.listen(config.PORT, () => {
    logger.info(`Server started in ${config.NODE_ENV} mode on port ${config.PORT}`);
    logger.info(`Health check available at http://localhost:${config.PORT}/health`);
});

process.on('unhandledRejection', (err) => {
    logger.error('Unhandled rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Performing graceful shutdown...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received. Performing graceful shutdown...');
    process.exit(0);
});