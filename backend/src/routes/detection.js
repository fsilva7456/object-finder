const express = require('express');
const router = express.Router();
const detectionController = require('../controllers/detection');

router.post('/analyze', detectionController.analyzeImage);
router.get('/results/:id', detectionController.getDetectionResults);
router.get('/history', detectionController.getDetectionHistory);

module.exports = router;