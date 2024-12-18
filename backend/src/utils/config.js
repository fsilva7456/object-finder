const config = {
    // Server configuration
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Security
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    
    // API configuration
    API_PREFIX: process.env.API_PREFIX || '/api/v1',
    
    // Other configurations can be added here
    MAX_REQUEST_SIZE: process.env.MAX_REQUEST_SIZE || '50mb'
};

// Validate required configurations
const validateConfig = () => {
    // Add validation for required environment variables here
    // Example: if (!process.env.REQUIRED_VAR) throw new Error('REQUIRED_VAR is required');
};

// Run validation
validateConfig();

module.exports = config;