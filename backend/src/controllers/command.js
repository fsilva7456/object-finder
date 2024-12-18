const logger = require('../utils/logger');

const sendCommand = async (req, res, next) => {
    try {
        logger.info('Command controller: sending command', { command: req.body.command });
        res.json({ message: 'Command sent successfully', id: 'cmd-' + Date.now() });
    } catch (error) {
        next(error);
    }
};

const getCommandStatus = async (req, res, next) => {
    try {
        logger.info('Command controller: getting command status', { commandId: req.query.id });
        res.json({ status: 'pending' });
    } catch (error) {
        next(error);
    }
};

const getCommandHistory = async (req, res, next) => {
    try {
        logger.info('Command controller: retrieving command history');
        res.json({ commands: [] });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendCommand,
    getCommandStatus,
    getCommandHistory
};