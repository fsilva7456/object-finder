import React, { useState, useEffect } from 'react';
import apiService from './services/api';

function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);

  // Check system health on mount
  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    try {
      const health = await apiService.fetchSystemHealth();
      setSystemHealth(health);
    } catch (error) {
      console.error('Health check failed:', error);
      setSystemHealth({ status: 'error', error: error.message });
    }
  };

  const fetchTelemetryData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.fetchTelemetry();
      setTelemetry(data);
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch telemetry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Object Finder</h1>
        
        {/* System Health Status */}
        <div className="system-status">
          <p>System Status: 
            <span style={{ color: systemHealth?.status === 'ok' ? 'green' : 'red' }}>
              {systemHealth?.status || 'Checking...'}
            </span>
          </p>
        </div>

        {/* Telemetry Section */}
        <div className="telemetry-section">
          <button 
            onClick={fetchTelemetryData}
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Get Telemetry'}
          </button>

          {error && (
            <div className="error-message">
              Error: {error}
            </div>
          )}

          {telemetry && !error && (
            <div className="telemetry-data">
              <h3>Telemetry Data</h3>
              <pre>
                {JSON.stringify(telemetry, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;