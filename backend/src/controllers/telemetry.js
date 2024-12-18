const logger = require('../utils/logger');
const droneService = require('../services/droneService');

const receiveTelemetry = async (req, res, next) => {
    try {
        logger.info('Telemetry controller: receiving data', { dataType: req.body.type });
        
        // Store received telemetry data (implement storage later)
        res.json({ message: 'Telemetry data received' });
    } catch (error) {
        logger.error('Error processing telemetry data:', error);
        next(error);
    }
};

const getSystemStatus = async (req, res, next) => {
    try {
        logger.info('Telemetry controller: getting system status');
        
        const telemetry = await droneService.getTelemetry();
        
        res.json({
            status: 'operational',
            telemetry,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Error getting system status:', error);
        next(error);
    }
};

const getTelemetryHistory = async (req, res, next) => {
    try {
        logger.info('Telemetry controller: retrieving telemetry history');
        
        // In future: implement actual telemetry history storage and retrieval
        res.json({
            history: [],
            startTime: req.query.startTime,
            endTime: req.query.endTime
        });
    } catch (error) {
        logger.error('Error retrieving telemetry history:', error);
        next(error);
    }
};

module.exports = {
    receiveTelemetry,
    getSystemStatus,
    getTelemetryHistory
};