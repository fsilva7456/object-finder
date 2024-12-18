const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetry');

router.post('/data', telemetryController.receiveTelemetry);
router.get('/status', telemetryController.getSystemStatus);
router.get('/history', telemetryController.getTelemetryHistory);

module.exports = router;