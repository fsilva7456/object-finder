const logger = require('../utils/logger');
const config = require('../utils/config');

class YOLOv8Service {
    constructor() {
        this.inferenceEndpoint = process.env.YOLO_ENDPOINT || 'http://localhost:8000/predict';
        this.lastInference = null;
    }

    async runInference(frameBase64) {
        try {
            logger.info('YOLOv8Service: Starting inference');

            if (!frameBase64) {
                throw new Error('No frame data provided');
            }

            // In production, this would be a real API call
            // const response = await fetch(this.inferenceEndpoint, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ image: frameBase64 })
            // });
            // 
            // if (!response.ok) {
            //     throw new Error(`Inference API error: ${response.statusText}`);
            // }
            // 
            // const result = await response.json();

            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Simulate detection results
            const result = {
                id: `inf-${Date.now()}`,
                timestamp: new Date().toISOString(),
                objects: [
                    {
                        class: 'person',
                        confidence: 0.92,
                        bbox: [100, 200, 300, 400]
                    },
                    {
                        class: 'car',
                        confidence: 0.87,
                        bbox: [50, 150, 250, 350]
                    }
                ],
                processingTime: 0.15
            };

            this.lastInference = result;
            logger.info('YOLOv8Service: Inference completed successfully', {
                detectionId: result.id,
                objectsFound: result.objects.length
            });

            return result;

        } catch (error) {
            logger.error('YOLOv8Service: Inference failed', {
                error: error.message,
                endpoint: this.inferenceEndpoint
            });
            throw error;
        }
    }

    async getLastInferenceResult() {
        return this.lastInference;
    }

    // Helper method to validate frame data
    validateFrame(frameBase64) {
        if (!frameBase64) return false;
        try {
            // Check if it's a valid base64 string
            return Buffer.from(frameBase64, 'base64').toString('base64') === frameBase64;
        } catch {
            return false;
        }
    }
}

// Export singleton instance
module.exports = new YOLOv8Service();