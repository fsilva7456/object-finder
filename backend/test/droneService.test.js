const droneService = require('../src/services/droneService');

describe('DroneService', () => {
    describe('getTelemetry', () => {
        it('should return telemetry data with required fields', async () => {
            const telemetry = await droneService.getTelemetry();
            
            // Check structure
            expect(telemetry).toHaveProperty('battery');
            expect(telemetry).toHaveProperty('position');
            expect(telemetry).toHaveProperty('orientation');
            expect(telemetry).toHaveProperty('status');
            expect(telemetry).toHaveProperty('timestamp');
            
            // Type checks
            expect(typeof telemetry.battery).toBe('number');
            expect(telemetry.battery).toBeGreaterThanOrEqual(0);
            expect(telemetry.battery).toBeLessThanOrEqual(100);
            
            expect(typeof telemetry.position.x).toBe('number');
            expect(typeof telemetry.position.y).toBe('number');
            expect(typeof telemetry.position.z).toBe('number');
            
            expect(typeof telemetry.orientation.roll).toBe('number');
            expect(typeof telemetry.orientation.pitch).toBe('number');
            expect(typeof telemetry.orientation.yaw).toBe('number');
            
            expect(typeof telemetry.status).toBe('string');
            expect(new Date(telemetry.timestamp)).toBeInstanceOf(Date);
        });

        it('should simulate battery drain over multiple calls', async () => {
            const firstReading = await droneService.getTelemetry();
            
            // Force multiple readings to trigger battery simulation
            for (let i = 0; i < 10; i++) {
                await droneService.getTelemetry();
            }
            
            const lastReading = await droneService.getTelemetry();
            
            // Battery should either stay same or decrease
            expect(lastReading.battery).toBeLessThanOrEqual(firstReading.battery);
        });
    });
});