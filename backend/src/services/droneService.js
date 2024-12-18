const logger = require('../utils/logger');

class DroneService {
    constructor() {
        this.connected = false;
        this.lastCommand = null;
        this.simulatedBattery = 85;
    }

    async getTelemetry() {
        logger.debug('DroneService: Getting telemetry data');
        
        // Simulate varying battery level
        this.simulatedBattery = Math.max(0, Math.min(100, 
            this.simulatedBattery + (Math.random() > 0.7 ? -1 : 0)));

        return {
            battery: this.simulatedBattery,
            position: { x: 123.45, y: 67.89, z: 10.5 },
            orientation: { roll: 0, pitch: 2, yaw: 178 },
            status: 'hovering',
            timestamp: new Date().toISOString(),
            connected: this.connected
        };
    }

    async sendCommand(command) {
        logger.debug('DroneService: Sending command', { command });
        
        // Simulate command validation and processing
        if (!command || !command.type) {
            throw new Error('Invalid command format');
        }

        this.lastCommand = {
            ...command,
            timestamp: new Date().toISOString(),
            status: 'accepted'
        };

        // Simulate random command failure
        if (Math.random() < 0.1) {
            throw new Error('Command failed: Simulated random failure');
        }

        return {
            commandId: `cmd-${Date.now()}`,
            status: 'accepted',
            timestamp: new Date().toISOString()
        };
    }

    async getFrame() {
        logger.debug('DroneService: Getting camera frame');
        
        // Simulate frame capture delay
        await new Promise(resolve => setTimeout(resolve, 100));

        return {
            frameId: `frame-${Date.now()}`,
            timestamp: new Date().toISOString(),
            format: 'jpeg',
            resolution: { width: 1280, height: 720 },
            data: Buffer.from('Simulated image data') // In real implementation, this would be actual image data
        };
    }

    async getLastCommand() {
        return this.lastCommand;
    }
}

// Export singleton instance
module.exports = new DroneService();