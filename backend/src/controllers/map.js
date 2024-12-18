const logger = require('../utils/logger');
const nerfService = require('../services/nerfService');
const droneService = require('../services/droneService');

const getMapData = async (req, res, next) => {
    try {
        logger.info('Map controller: retrieving map data');
        
        const lastMap = await nerfService.getLastMap();
        if (!lastMap) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'No map data available'
            });
        }

        res.json(lastMap);
    } catch (error) {
        logger.error('Error retrieving map data:', error);
        next(error);
    }
};

const updateMap = async (req, res, next) => {
    try {
        logger.info('Map controller: starting map generation');

        const { frames } = req.body;

        // If no frames provided, try to get one from the drone
        let framesToProcess = frames;
        if (!framesToProcess) {
            logger.debug('No frames provided, capturing from drone');
            const frame = await droneService.getFrame();
            framesToProcess = [frame.data.toString('base64')];
        }

        // Validate input
        if (!Array.isArray(framesToProcess)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Frames must be provided as an array'
            });
        }

        // Generate map
        const mapResult = await nerfService.generateMap(framesToProcess);

        res.json({
            message: 'Map updated successfully',
            mapId: mapResult.mapId,
            timestamp: mapResult.timestamp,
            metadata: mapResult.metadata
        });

    } catch (error) {
        logger.error('Error updating map:', {
            error: error.message,
            stack: error.stack
        });

        // Handle specific errors
        if (error.message.includes('No frames provided')) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'No valid frames provided for map generation'
            });
        }

        if (error.message.includes('NeRF API error')) {
            return res.status(503).json({
                error: 'Service Unavailable',
                message: 'Map generation service is currently unavailable'
            });
        }

        next(error);
    }
};

const getMarkers = async (req, res, next) => {
    try {
        logger.info('Map controller: retrieving markers');
        
        // In future: implement actual marker storage and retrieval
        res.json({
            markers: [],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Error retrieving markers:', error);
        next(error);
    }
};

module.exports = {
    getMapData,
    updateMap,
    getMarkers
};