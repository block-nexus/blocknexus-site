// Jest setup file
// This file runs before each test file

// Mock Next.js environment
process.env.NODE_ENV = 'test';

// Suppress console errors in tests (optional - remove if you want to see them)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
