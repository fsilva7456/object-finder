const express = require('express');
const router = express.Router();
const mapController = require('../controllers/map');

router.get('/data', mapController.getMapData);
router.post('/update', mapController.updateMap);
router.get('/markers', mapController.getMarkers);

module.exports = router;