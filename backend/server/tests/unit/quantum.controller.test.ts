/**
 * Quantum Controller Tests
 * 
 * This module contains unit tests for the quantum state controller.
 * 
 * @version 1.0.0
 */

import { Request, Response } from 'express';
import * as quantumController from '../../controllers/quantum.controller';
import { AppError } from '../../middleware/errorHandler';
import { QuantumStateManager } from '../../../interdimensional/quantum/QuantumStateManager';
import { QuantumCoherenceVerifier } from '../../../interdimensional/quantum/QuantumCoherenceVerifier';

// Mock dependencies
jest.mock('../../../interdimensional/quantum/QuantumStateManager');
jest.mock('../../../interdimensional/quantum/QuantumCoherenceVerifier');
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Quantum Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let mockQuantumStateManager: jest.Mocked<QuantumStateManager>;
  let mockQuantumCoherenceVerifier: jest.Mocked<QuantumCoherenceVerifier>;
  
  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'user',
      },
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    next = jest.fn();
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock quantum state manager
    mockQuantumStateManager = new QuantumStateManager() as jest.Mocked<QuantumStateManager>;
    (QuantumStateManager as jest.Mock).mockImplementation(() => mockQuantumStateManager);
    
    // Setup mock quantum coherence verifier
    mockQuantumCoherenceVerifier = new QuantumCoherenceVerifier() as jest.Mocked<QuantumCoherenceVerifier>;
    (QuantumCoherenceVerifier as jest.Mock).mockImplementation(() => mockQuantumCoherenceVerifier);
  });
  
  describe('getAllStates', () => {
    it('should return all quantum states', async () => {
      // Arrange
      const mockStates = [
        { id: '1', properties: { name: 'State 1' } },
        { id: '2', properties: { name: 'State 2' } },
      ];
      
      mockQuantumStateManager.getAllStates = jest.fn().mockReturnValue(mockStates);
      
      // Act
      await quantumController.getAllStates(req as Request, res as Response, next);
      
      // Assert
      expect(mockQuantumStateManager.getAllStates).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: mockStates.length,
        data: {
          states: mockStates,
        },
      });
      expect(next).not.toHaveBeenCalled();
    });
    
    it('should handle errors', async () => {
      // Arrange
      const error = new Error('Test error');
      mockQuantumStateManager.getAllStates = jest.fn().mockImplementation(() => {
        throw error;
      });
      
      // Act
      await quantumController.getAllStates(req as Request, res as Response, next);
      
      // Assert
      expect(mockQuantumStateManager.getAllStates).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  
  describe('getStateById', () => {
    it('should return quantum state by ID', async () => {
      // Arrange
      const mockState = { id: '1', properties: { name: 'State 1' } };
      req.params = { id: '1' };
      
      mockQuantumStateManager.getState = jest.fn().mockReturnValue(mockState);
      
      // Act
      await quantumController.getStateById(req as Request, res as Response, next);
      
      // Assert
      expect(mockQuantumStateManager.getState).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          state: mockState,
        },
      });
      expect(next).not.toHaveBeenCalled();
    });
    
    it('should return 404 if state not found', async () => {
      // Arrange
      req.params = { id: '999' };
      
      mockQuantumStateManager.getState = jest.fn().mockReturnValue(null);
      
      // Act
      await quantumController.getStateById(req as Request, res as Response, next);
      
      // Assert
      expect(mockQuantumStateManager.getState).toHaveBeenCalledWith('999');
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(next.mock.calls[0][0].message).toBe('Quantum state with ID 999 not found');
    });
  });
  
  describe('createState', () => {
    it('should create a new quantum state', async () => {
      // Arrange
      const mockProperties = { name: 'New State', type: 'quantum' };
      const mockState = { id: '1', properties: mockProperties };
      req.body = { properties: mockProperties };
      
      mockQuantumStateManager.createState = jest.fn().mockReturnValue(mockState);
      
      // Act
      await quantumController.createState(req as Request, res as Response, next);
      
      // Assert
      expect(mockQuantumStateManager.createState).toHaveBeenCalledWith(mockProperties);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          state: mockState,
        },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});