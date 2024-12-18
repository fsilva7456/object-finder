// Jest setup file
process.env.NODE_ENV = 'test';
process.env.PORT = 3001; // Use different port for testing

// Setup logging mocks
jest.mock('../src/utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn()
}));