const logger = require('../utils/logger');
const droneService = require('../services/droneService');

const sendCommand = async (req, res, next) => {
    try {
        const command = req.body;
        logger.info('Command controller: sending command', { command });

        // Validate command structure
        if (!command || !command.type) {
            const error = new Error('Invalid command format');
            error.status = 400;
            throw error;
        }

        const result = await droneService.sendCommand(command);
        
        res.json({
            message: 'Command sent successfully',
            commandId: result.commandId,
            status: result.status,
            timestamp: result.timestamp
        });
    } catch (error) {
        logger.error('Error sending command:', error);
        
        // If it's a validation error, send 400, otherwise pass to global error handler
        if (error.status === 400) {
            res.status(400).json({
                error: 'Bad Request',
                message: error.message
            });
        } else {
            next(error);
        }
    }
};

const getCommandStatus = async (req, res, next) => {
    try {
        const commandId = req.query.id;
        logger.info('Command controller: getting command status', { commandId });

        // Get last command for now (implement proper command tracking later)
        const lastCommand = await droneService.getLastCommand();
        
        if (!lastCommand) {
            res.status(404).json({
                error: 'Not Found',
                message: 'Command not found'
            });
            return;
        }

        res.json({
            commandId,
            status: lastCommand.status,
            timestamp: lastCommand.timestamp,
            command: lastCommand
        });
    } catch (error) {
        logger.error('Error getting command status:', error);
        next(error);
    }
};

const getCommandHistory = async (req, res, next) => {
    try {
        logger.info('Command controller: retrieving command history');
        
        // In future: implement actual command history storage and retrieval
        res.json({
            commands: [],
            startTime: req.query.startTime,
            endTime: req.query.endTime
        });
    } catch (error) {
        logger.error('Error retrieving command history:', error);
        next(error);
    }
};

module.exports = {
    sendCommand,
    getCommandStatus,
    getCommandHistory
};