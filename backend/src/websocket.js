const WebSocket = require('ws');
const logger = require('./utils/logger');
const droneService = require('./services/droneService');

class WebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Set();
        this.telemetryInterval = null;
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws, req) => {
            const clientIp = req.socket.remoteAddress;
            logger.info('New WebSocket connection', { clientIp });

            // Add client to set
            this.clients.add(ws);

            // Start telemetry broadcast if this is the first client
            if (this.clients.size === 1) {
                this.startTelemetryBroadcast();
            }

            // Handle client disconnection
            ws.on('close', () => {
                logger.info('Client disconnected', { clientIp });
                this.clients.delete(ws);

                // Stop telemetry broadcast if no clients are connected
                if (this.clients.size === 0) {
                    this.stopTelemetryBroadcast();
                }
            });

            // Handle client errors
            ws.on('error', (error) => {
                logger.error('WebSocket client error:', { error: error.message, clientIp });
            });

            // Send initial telemetry
            this.sendTelemetry(ws);
        });

        this.wss.on('error', (error) => {
            logger.error('WebSocket server error:', error);
        });
    }

    async sendTelemetry(client) {
        try {
            const telemetry = await droneService.getTelemetry();
            const message = JSON.stringify({
                type: 'telemetry',
                data: telemetry,
                timestamp: new Date().toISOString()
            });

            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        } catch (error) {
            logger.error('Error sending telemetry:', error);
        }
    }

    broadcast(message) {
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }

    startTelemetryBroadcast() {
        if (!this.telemetryInterval) {
            logger.info('Starting telemetry broadcast');
            this.telemetryInterval = setInterval(() => {
                this.clients.forEach(client => this.sendTelemetry(client));
            }, 1000); // Send telemetry every second
        }
    }

    stopTelemetryBroadcast() {
        if (this.telemetryInterval) {
            logger.info('Stopping telemetry broadcast');
            clearInterval(this.telemetryInterval);
            this.telemetryInterval = null;
        }
    }
}

module.exports = WebSocketServer;