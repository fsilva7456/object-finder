import { useState, useEffect, useCallback } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

export function useDroneData() {
    const [telemetry, setTelemetry] = useState(null);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [ws, setWs] = useState(null);

    const connect = useCallback(() => {
        try {
            const socket = new WebSocket(WS_URL);

            socket.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);
                setError(null);
            };

            socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'telemetry') {
                        setTelemetry(message.data);
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };

            socket.onerror = (event) => {
                console.error('WebSocket error:', event);
                setError('Connection error');
            };

            socket.onclose = () => {
                console.log('WebSocket disconnected');
                setIsConnected(false);
                // Attempt to reconnect after 5 seconds
                setTimeout(connect, 5000);
            };

            setWs(socket);

            // Cleanup function
            return () => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.close();
                }
            };
        } catch (err) {
            console.error('Error creating WebSocket connection:', err);
            setError('Failed to connect');
            // Attempt to reconnect after 5 seconds
            setTimeout(connect, 5000);
        }
    }, []);

    useEffect(() => {
        const cleanup = connect();
        return () => {
            cleanup?.();
            if (ws?.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [connect]);

    return {
        telemetry,
        error,
        isConnected
    };
}