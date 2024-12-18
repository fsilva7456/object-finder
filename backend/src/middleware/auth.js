const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const logger = require('../utils/logger');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        logger.warn('Authentication failed: No token provided');
        return res.status(401).json({ 
            error: 'Unauthorized', 
            message: 'Authentication token is required' 
        });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        logger.warn('Authentication failed: Invalid token format');
        return res.status(401).json({ 
            error: 'Unauthorized', 
            message: 'Invalid token format' 
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        // Check if the token has required roles for command access
        if (!decoded.roles || 
            !decoded.roles.some(role => config.ALLOWED_COMMAND_ROLES.includes(role))) {
            logger.warn('Authentication failed: Insufficient permissions', {
                userId: decoded.sub,
                roles: decoded.roles
            });
            return res.status(403).json({ 
                error: 'Forbidden', 
                message: 'Insufficient permissions for command access' 
            });
        }

        // Add decoded token to request for use in routes
        req.user = decoded;
        
        logger.debug('Authentication successful', { 
            userId: decoded.sub,
            roles: decoded.roles 
        });
        
        next();
    } catch (error) {
        logger.error('Authentication failed: Invalid token', { 
            error: error.message,
            token: token.substring(0, 10) + '...' // Log only part of token for debugging
        });
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Unauthorized', 
                message: 'Token has expired' 
            });
        }
        
        return res.status(401).json({ 
            error: 'Unauthorized', 
            message: 'Invalid token' 
        });
    }
};

module.exports = authenticateJWT;