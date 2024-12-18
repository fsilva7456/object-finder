const config = {
    // ... (previous config remains)

    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET || 'your-secure-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    
    // Command access configuration
    ALLOWED_COMMAND_ROLES: ['admin', 'operator']
};

const validateConfig = () => {
    if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be set in production environment');
    }
};

validateConfig();

module.exports = config;