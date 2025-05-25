/**
 * Security Tests
 * 
 * This module contains security tests for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import request from 'supertest';
import { app } from '../../index';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

describe('Security Tests', () => {
  describe('Authentication', () => {
    it('should reject requests without authentication', async () => {
      // Attempt to access protected endpoint without token
      const response = await request(app)
        .get('/api/v1/quantum/states');
      
      // Assert unauthorized response
      expect(response.status).toBe(401);
    });
    
    it('should reject requests with invalid token', async () => {
      // Attempt to access protected endpoint with invalid token
      const response = await request(app)
        .get('/api/v1/quantum/states')
        .set('Authorization', 'Bearer invalid-token');
      
      // Assert unauthorized response
      expect(response.status).toBe(401);
    });
    
    it('should reject requests with expired token', async () => {
      // Create expired token
      const expiredToken = jwt.sign(
        { id: '1', email: 'test@example.com', role: 'user' },
        config.jwtSecret,
        { expiresIn: '0s' }
      );
      
      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Attempt to access protected endpoint with expired token
      const response = await request(app)
        .get('/api/v1/quantum/states')
        .set('Authorization', `Bearer ${expiredToken}`);
      
      // Assert unauthorized response
      expect(response.status).toBe(401);
    });
  });
  
  describe('Authorization', () => {
    it('should reject requests with insufficient permissions', async () => {
      // Create token with user role
      const userToken = jwt.sign(
        { id: '1', email: 'test@example.com', role: 'user' },
        config.jwtSecret
      );
      
      // Attempt to access admin-only endpoint
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`);
      
      // Assert forbidden response
      expect(response.status).toBe(403);
    });
  });
  
  describe('Input Validation', () => {
    it('should reject requests with invalid input', async () => {
      // Create valid token
      const token = jwt.sign(
        { id: '1', email: 'test@example.com', role: 'user' },
        config.jwtSecret
      );
      
      // Attempt to create quantum state with invalid input
      const response = await request(app)
        .post('/api/v1/quantum/states')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Missing required properties
        });
      
      // Assert bad request response
      expect(response.status).toBe(400);
    });
    
    it('should sanitize input to prevent injection attacks', async () => {
      // Create valid token
      const token = jwt.sign(
        { id: '1', email: 'test@example.com', role: 'user' },
        config.jwtSecret
      );
      
      // Attempt to create quantum state with potentially malicious input
      const response = await request(app)
        .post('/api/v1/quantum/states')
        .set('Authorization', `Bearer ${token}`)
        .send({
          properties: {
            name: '<script>alert("XSS")</script>',
            type: 'quantum',
          },
        });
      
      // Assert successful response (input should be sanitized)
      expect(response.status).toBe(201);
      
      // Check that the script tag was sanitized
      expect(response.body.data.state.properties.name).not.toBe('<script>alert("XSS")</script>');
    });
  });
  
  describe('Rate Limiting', () => {
    it('should limit request rate', async () => {
      // Create valid token
      const token = jwt.sign(
        { id: '1', email: 'test@example.com', role: 'user' },
        config.jwtSecret
      );
      
      // Make multiple requests in quick succession
      const requests = Array(20).fill(0).map(() => 
        request(app)
          .get('/api/v1/quantum/states')
          .set('Authorization', `Bearer ${token}`)
      );
      
      // Execute requests
      const responses = await Promise.all(requests);
      
      // Check if any responses were rate limited
      const rateLimitedResponses = responses.filter(response => response.status === 429);
      
      // Assert that rate limiting was applied
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
  
  describe('CORS', () => {
    it('should have proper CORS headers', async () => {
      // Send request with Origin header
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000');
      
      // Assert CORS headers
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});