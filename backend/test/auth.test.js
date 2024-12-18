const jwt = require('jsonwebtoken');
const config = require('../src/utils/config');
const authenticateJWT = require('../src/middleware/auth');

describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let nextFunction;

    beforeEach(() => {
        mockReq = {
            headers: {}
        };
        mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    it('should return 401 if no token is provided', () => {
        authenticateJWT(mockReq, mockRes, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: 'Unauthorized',
            message: 'Authentication token is required'
        });
    });

    it('should return 401 for invalid token format', () => {
        mockReq.headers.authorization = 'Invalid-Format';
        
        authenticateJWT(mockReq, mockRes, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: 'Unauthorized',
            message: 'Invalid token format'
        });
    });

    it('should return 403 for insufficient permissions', () => {
        const token = jwt.sign(
            { sub: 'user123', roles: ['guest'] },
            config.JWT_SECRET
        );
        mockReq.headers.authorization = `Bearer ${token}`;

        authenticateJWT(mockReq, mockRes, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: 'Forbidden',
            message: 'Insufficient permissions for command access'
        });
    });

    it('should call next() for valid token with correct permissions', () => {
        const token = jwt.sign(
            { sub: 'user123', roles: ['admin'] },
            config.JWT_SECRET
        );
        mockReq.headers.authorization = `Bearer ${token}`;

        authenticateJWT(mockReq, mockRes, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
        expect(mockReq.user).toBeDefined();
        expect(mockReq.user.roles).toContain('admin');
    });
});
