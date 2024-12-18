import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import apiService from '../services/api';

function Scene() {
    const cubeRef = useRef();

    useEffect(() => {
        // Rotate the cube slowly
        const interval = setInterval(() => {
            if (cubeRef.current) {
                cubeRef.current.rotation.y += 0.01;
            }
        }, 16);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Environment setup */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Grid 
                renderOrder={-1}
                position={[0, -1, 0]}
                infiniteGrid
                cellSize={1}
                cellThickness={0.5}
                cellColor="#6f6f6f"
                sectionSize={3}
                sectionThickness={1}
                sectionColor="#9d4b4b"
                fadeDistance={30}
                fadeStrength={1}
            />

            {/* Placeholder cube */}
            <mesh ref={cubeRef} position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#4d4dff" />
            </mesh>
        </>
    );
}

const MapView = () => {
    const [mapData, setMapData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMapData();
    }, []);

    const fetchMapData = async () => {
        try {
            const data = await apiService.fetchMapData();
            setMapData(data);
            setError(null);
        } catch (error) {
            console.error('Failed to load map data:', error);
            setError('Failed to load map');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMap = async () => {
        try {
            setLoading(true);
            await apiService.updateMap();
            await fetchMapData(); // Refresh map data
        } catch (error) {
            console.error('Failed to update map:', error);
            setError('Failed to update map');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="map-view">
            <div className="map-header">
                <h2>3D Map View</h2>
                <button 
                    onClick={handleUpdateMap}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Map'}
                </button>
            </div>

            <div className="map-container">
                {error && (
                    <div className="error-overlay">
                        {error}
                        <button onClick={fetchMapData}>Retry</button>
                    </div>
                )}

                <Canvas
                    camera={{ position: [5, 5, 5], fov: 50 }}
                    style={{ background: '#1a1a1a' }}
                >
                    <Scene />
                    <OrbitControls 
                        enableDamping 
                        dampingFactor={0.05} 
                        rotateSpeed={0.5}
                        maxDistance={20}
                        minDistance={2}
                    />
                </Canvas>

                {mapData && (
                    <div className="map-info">
                        <p>Resolution: {mapData.resolution}m/voxel</p>
                        <p>Last Updated: {new Date(mapData.timestamp).toLocaleString()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapView;