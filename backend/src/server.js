const { app, logger } = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
    logger.info(`Health check available at http://localhost:${PORT}/health`);
});

process.on('unhandledRejection', (err) => {
    logger.error('Unhandled rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err);
    process.exit(1);
});
