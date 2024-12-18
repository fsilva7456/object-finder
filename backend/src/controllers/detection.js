const logger = require('../utils/logger');
const yolov8Service = require('../services/yolov8Service');
const droneService = require('../services/droneService');

const analyzeImage = async (req, res, next) => {
    try {
        logger.info('Detection controller: starting image analysis');

        // Get frame from drone if not provided in request
        let frameData = req.body.frame;
        if (!frameData) {
            logger.debug('No frame provided in request, getting from drone');
            const frame = await droneService.getFrame();
            frameData = frame.data.toString('base64');
        }

        // Validate frame data
        if (!yolov8Service.validateFrame(frameData)) {
            logger.warn('Invalid frame data received');
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Invalid frame data'
            });
        }

        // Run inference
        const detectionResults = await yolov8Service.runInference(frameData);

        res.json({
            detectionId: detectionResults.id,
            timestamp: detectionResults.timestamp,
            objects: detectionResults.objects,
            processingTime: detectionResults.processingTime
        });

    } catch (error) {
        logger.error('Error during image analysis:', {
            error: error.message,
            stack: error.stack
        });

        // If it's a specific error we know about, handle it accordingly
        if (error.message.includes('Inference API error')) {
            return res.status(503).json({
                error: 'Service Unavailable',
                message: 'Object detection service is currently unavailable'
            });
        }

        next(error);
    }
};

const getDetectionResults = async (req, res, next) => {
    try {
        const detectionId = req.params.id;
        logger.info('Detection controller: getting results', { detectionId });

        // For now, just return the last inference result
        const result = await yolov8Service.getLastInferenceResult();

        if (!result) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Detection results not found'
            });
        }

        res.json(result);

    } catch (error) {
        logger.error('Error retrieving detection results:', error);
        next(error);
    }
};

const getDetectionHistory = async (req, res, next) => {
    try {
        logger.info('Detection controller: retrieving detection history');

        // In future: implement actual detection history storage and retrieval
        res.json({
            history: [],
            startTime: req.query.startTime,
            endTime: req.query.endTime
        });
    } catch (error) {
        logger.error('Error retrieving detection history:', error);
        next(error);
    }
};

module.exports = {
    analyzeImage,
    getDetectionResults,
    getDetectionHistory
};