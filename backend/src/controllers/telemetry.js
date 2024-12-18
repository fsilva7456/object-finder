const logger = require('../utils/logger');

const receiveTelemetry = async (req, res, next) => {
    try {
        logger.info('Telemetry controller: receiving data', { dataType: req.body.type });
        res.json({ message: 'Telemetry data received' });
    } catch (error) {
        next(error);
    }
};

const getSystemStatus = async (req, res, next) => {
    try {
        logger.info('Telemetry controller: getting system status');
        res.json({ status: 'operational' });
    } catch (error) {
        next(error);
    }
};

const getTelemetryHistory = async (req, res, next) => {
    try {
        logger.info('Telemetry controller: retrieving telemetry history');
        res.json({ history: [] });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    receiveTelemetry,
    getSystemStatus,
    getTelemetryHistory
};