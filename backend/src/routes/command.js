const express = require('express');
const router = express.Router();
const commandController = require('../controllers/command');

router.post('/send', commandController.sendCommand);
router.get('/status', commandController.getCommandStatus);
router.get('/history', commandController.getCommandHistory);

module.exports = router;