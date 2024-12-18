const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class ApiService {
    async fetchTelemetry() {
        try {
            const response = await fetch(`${API_URL}/telemetry/status`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching telemetry:', error);
            throw error;
        }
    }

    async fetchSystemHealth() {
        try {
            const response = await fetch(`${API_URL.replace('/api/v1', '')}/health`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching system health:', error);
            throw error;
        }
    }
}

// Export singleton instance
export default new ApiService();