const logger = require('../utils/logger');
const droneService = require('../services/droneService');

const sendCommand = async (req, res, next) => {
    try {
        const command = req.body;
        logger.info('Command controller: sending command', { 
            command,
            userId: req.user.sub,
            roles: req.user.roles
        });

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
        logger.error('Error sending command:', {
            error: error.message,
            userId: req.user.sub,
            command: req.body
        });
        
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

// ... (rest of the controller methods remain the same)

module.exports = {
    sendCommand,
    getCommandStatus,
    getCommandHistory
};