/**
 * Auth API Integration Tests
 * 
 * This module contains integration tests for the authentication API endpoints.
 * 
 * @version 1.0.0
 */

import request from 'supertest';
import { app } from '../../index';
import { generateToken } from '../../middleware/auth';

// Mock dependencies
jest.mock('../../middleware/auth', () => ({
  generateToken: jest.fn().mockReturnValue('mock-token'),
  protect: jest.fn().mockImplementation((req, res, next) => {
    req.user = {
      id: '1',
      email: 'test@example.com',
      role: 'user',
    };
    next();
  }),
  restrictTo: jest.fn().mockImplementation(() => (req, res, next) => next()),
}));

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      // Arrange
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      };
      
      // Act
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);
      
      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        token: 'mock-token',
        data: {
          user: expect.objectContaining({
            email: 'user@example.com',
            name: 'John Doe',
            role: 'user',
          }),
        },
      });
      expect(generateToken).toHaveBeenCalled();
    });
    
    it('should return 400 if required fields are missing', async () => {
      // Arrange
      const userData = {
        email: 'user@example.com',
        // Missing password and name
      };
      
      // Act
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);
      
      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'fail',
        message: 'Please provide email, password and name',
      });
    });
  });
  
  describe('POST /api/v1/auth/login', () => {
    it('should login user', async () => {
      // Arrange
      const loginData = {
        email: 'user@example.com',
        password: 'password123',
      };
      
      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        token: 'mock-token',
        data: {
          user: expect.objectContaining({
            email: 'user@example.com',
            role: 'user',
          }),
        },
      });
      expect(generateToken).toHaveBeenCalled();
    });
    
    it('should return 400 if required fields are missing', async () => {
      // Arrange
      const loginData = {
        // Missing email and password
      };
      
      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData);
      
      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'fail',
        message: 'Please provide email and password',
      });
    });
  });
  
  describe('GET /api/v1/auth/me', () => {
    it('should return current user', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer mock-token');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: {
          user: expect.objectContaining({
            id: '1',
            email: 'test@example.com',
            role: 'user',
          }),
        },
      });
    });
  });
});