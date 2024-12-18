const express = require('express');
const router = express.Router();
const commandController = require('../controllers/command');
const authenticateJWT = require('../middleware/auth');

// Secure all command routes with JWT authentication
router.use(authenticateJWT);

router.post('/send', commandController.sendCommand);
router.get('/status', commandController.getCommandStatus);
router.get('/history', commandController.getCommandHistory);

module.exports = router;