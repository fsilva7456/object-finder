const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class ApiService {
    // ... (previous methods remain the same)

    async fetchMapData() {
        try {
            const response = await fetch(`${API_URL}/map/data`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching map data:', error);
            throw error;
        }
    }

    async updateMap() {
        try {
            const response = await fetch(`${API_URL}/map/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating map:', error);
            throw error;
        }
    }
}

export default new ApiService();