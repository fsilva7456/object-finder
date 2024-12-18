import React, { useState, useEffect } from 'react';
import apiService from './services/api';
import { useDroneData } from './hooks/useDroneData';
import DroneControls from './components/DroneControls';
import LiveFeed from './components/LiveFeed';
import MapView from './components/MapView';

function App() {
    const [systemHealth, setSystemHealth] = useState(null);
    const { telemetry, error: wsError, isConnected } = useDroneData();

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

    return (
        <div className="App">
            <header className="App-header">
                <h1>Object Finder</h1>
                
                {/* System Health Status */}
                <div className="system-status">
                    <p>
                        System Status: 
                        <span style={{ color: systemHealth?.status === 'ok' ? 'green' : 'red' }}>
                            {systemHealth?.status || 'Checking...'}
                        </span>
                    </p>
                    <p>
                        WebSocket: 
                        <span style={{ color: isConnected ? 'green' : 'red' }}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </p>
                </div>

                <div className="main-content">
                    <div className="left-panel">
                        {/* Live Feed Section */}
                        <section className="feed-section">
                            <LiveFeed />
                        </section>

                        {/* Map View Section */}
                        <section className="map-section">
                            <MapView />
                        </section>
                    </div>

                    <div className="right-panel">
                        {/* Controls Section */}
                        <section className="controls-section">
                            <DroneControls />

                            {/* Live Telemetry Section */}
                            <div className="telemetry-section">
                                <h2>Live Telemetry</h2>
                                
                                {wsError && (
                                    <div className="error-message">
                                        Error: {wsError}
                                    </div>
                                )}

                                {telemetry && (
                                    <div className="telemetry-data">
                                        <pre>
                                            {JSON.stringify(telemetry, null, 2)}
                                        </pre>
                                    </div>
                                )}

                                <div className="telemetry-status">
                                    Last Update: {telemetry?.timestamp ? 
                                        new Date(telemetry.timestamp).toLocaleTimeString() : 
                                        'Waiting...'}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;