import React, { useState, useEffect } from 'react';
import apiService from './services/api';
import DroneControls from './components/DroneControls';
import LiveFeed from './components/LiveFeed';
import MapView from './components/MapView';

function App() {
    // ... (previous state and functions remain the same)

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

                            {/* Telemetry Section */}
                            <div className="telemetry-section">
                                <h2>Telemetry</h2>
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
                                        <pre>
                                            {JSON.stringify(telemetry, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;