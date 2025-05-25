/**
 * Quantum Transaction Manager
 * 
 * This module provides a transaction manager for quantum operations,
 * ensuring ACID properties across quantum state changes.
 * 
 * @version 1.0.0
 */

import { v4 as uuidv4 } from 'uuid';
import { QuantumState, QuantumStateManager } from '../QuantumStateManager';
import { QuantumCoherenceVerifier } from '../QuantumCoherenceVerifier';

/**
 * Transaction status
 */
export enum TransactionStatus {
  PENDING = 'pending',
  COMMITTED = 'committed',
  ROLLED_BACK = 'rolled_back',
  FAILED = 'failed',
}

/**
 * Transaction operation type
 */
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  SYNCHRONIZE = 'synchronize',
  ENTANGLE = 'entangle',
  DISENTANGLE = 'disentangle',
  TRANSFORM = 'transform',
}

/**
 * Transaction operation
 */
export interface TransactionOperation {
  type: OperationType;
  stateId: string;
  data?: any;
  targetStateId?: string;
}

/**
 * Transaction
 */
export interface Transaction {
  id: string;
  operations: TransactionOperation[];
  status: TransactionStatus;
  timestamp: number;
  completedTimestamp?: number;
  coherenceScore?: number;
}

/**
 * Transaction result
 */
export interface TransactionResult {
  transaction: Transaction;
  success: boolean;
  states: QuantumState[];
  error?: string;
}

/**
 * Quantum Transaction Manager
 */
export class QuantumTransactionManager {
  private stateManager: QuantumStateManager;
  private coherenceVerifier: QuantumCoherenceVerifier;
  private transactions: Map<string, Transaction>;
  private stateSnapshots: Map<string, Map<string, QuantumState>>;
  
  /**
   * Constructor
   */
  constructor() {
    this.stateManager = new QuantumStateManager();
    this.coherenceVerifier = new QuantumCoherenceVerifier();
    this.transactions = new Map();
    this.stateSnapshots = new Map();
  }
  
  /**
   * Begin a new transaction
   */
  public beginTransaction(): Transaction {
    const transaction: Transaction = {
      id: uuidv4(),
      operations: [],
      status: TransactionStatus.PENDING,
      timestamp: Date.now(),
    };
    
    this.transactions.set(transaction.id, transaction);
    this.stateSnapshots.set(transaction.id, new Map());
    
    return transaction;
  }
  
  /**
   * Add operation to transaction
   */
  public addOperation(transactionId: string, operation: TransactionOperation): Transaction {
    const transaction = this.transactions.get(transactionId);
    
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }
    
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new Error(`Transaction ${transactionId} is not pending`);
    }
    
    // Take snapshot of state before operation
    const state = this.stateManager.getState(operation.stateId);
    
    if (state && !this.stateSnapshots.get(transactionId)?.has(operation.stateId)) {
      this.stateSnapshots.get(transactionId)?.set(operation.stateId, { ...state });
    }
    
    // If operation involves a target state, take snapshot of that too
    if (operation.targetStateId) {
      const targetState = this.stateManager.getState(operation.targetStateId);
      
      if (targetState && !this.stateSnapshots.get(transactionId)?.has(operation.targetStateId)) {
        this.stateSnapshots.get(transactionId)?.set(operation.targetStateId, { ...targetState });
      }
    }
    
    // Add operation to transaction
    transaction.operations.push(operation);
    
    return transaction;
  }
  
  /**
   * Commit transaction
   */
  public commitTransaction(transactionId: string): TransactionResult {
    const transaction = this.transactions.get(transactionId);
    
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }
    
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new Error(`Transaction ${transactionId} is not pending`);
    }
    
    try {
      // Execute operations
      const states: QuantumState[] = [];
      
      for (const operation of transaction.operations) {
        let state: QuantumState | null = null;
        
        switch (operation.type) {
          case OperationType.CREATE:
            state = this.stateManager.createState(operation.data);
            break;
            
          case OperationType.UPDATE:
            state = this.stateManager.updateState(operation.stateId, operation.data);
            break;
            
          case OperationType.DELETE:
            this.stateManager.deleteState(operation.stateId);
            break;
            
          case OperationType.SYNCHRONIZE:
            if (!operation.targetStateId) {
              throw new Error('Target state ID is required for synchronize operation');
            }
            
            const sourceState = this.stateManager.getState(operation.stateId);
            const targetState = this.stateManager.getState(operation.targetStateId);
            
            if (!sourceState || !targetState) {
              throw new Error('Source or target state not found');
            }
            
            this.stateManager.synchronizeStates(sourceState, targetState);
            state = this.stateManager.getState(operation.stateId);
            break;
            
          case OperationType.ENTANGLE:
            if (!operation.targetStateId) {
              throw new Error('Target state ID is required for entangle operation');
            }
            
            this.stateManager.entangleStates(
              operation.stateId,
              operation.targetStateId,
              operation.data?.type,
              operation.data?.strength
            );
            state = this.stateManager.getState(operation.stateId);
            break;
            
          case OperationType.DISENTANGLE:
            if (operation.targetStateId) {
              this.stateManager.disentangleStates(operation.stateId, operation.targetStateId);
            } else {
              this.stateManager.disentangleAllStates(operation.stateId);
            }
            state = this.stateManager.getState(operation.stateId);
            break;
            
          case OperationType.TRANSFORM:
            state = this.stateManager.transformState(operation.stateId, operation.data);
            break;
        }
        
        if (state) {
          states.push(state);
        }
      }
      
      // Verify quantum coherence
      const coherenceResult = this.verifyTransactionCoherence(transaction, states);
      
      // Update transaction status
      transaction.status = TransactionStatus.COMMITTED;
      transaction.completedTimestamp = Date.now();
      transaction.coherenceScore = coherenceResult.coherenceScore;
      
      return {
        transaction,
        success: true,
        states,
      };
    } catch (error) {
      // Rollback transaction
      this.rollbackTransaction(transactionId);
      
      return {
        transaction: this.transactions.get(transactionId) as Transaction,
        success: false,
        states: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  /**
   * Rollback transaction
   */
  public rollbackTransaction(transactionId: string): Transaction {
    const transaction = this.transactions.get(transactionId);
    
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }
    
    // Restore state snapshots
    const snapshots = this.stateSnapshots.get(transactionId);
    
    if (snapshots) {
      for (const [stateId, state] of snapshots.entries()) {
        this.stateManager.restoreState(stateId, state);
      }
    }
    
    // Update transaction status
    transaction.status = TransactionStatus.ROLLED_BACK;
    transaction.completedTimestamp = Date.now();
    
    return transaction;
  }
  
  /**
   * Get transaction
   */
  public getTransaction(transactionId: string): Transaction | undefined {
    return this.transactions.get(transactionId);
  }
  
  /**
   * Get all transactions
   */
  public getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values());
  }
  
  /**
   * Verify transaction coherence
   */
  private verifyTransactionCoherence(transaction: Transaction, states: QuantumState[]): { isCoherent: boolean; coherenceScore: number } {
    // If no states were affected, return default coherence
    if (states.length === 0) {
      return { isCoherent: true, coherenceScore: 1.0 };
    }
    
    // Verify coherence of each state
    const coherenceScores: number[] = [];
    
    for (const state of states) {
      const snapshot = this.stateSnapshots.get(transaction.id)?.get(state.id);
      
      if (snapshot) {
        const result = this.coherenceVerifier.verifyCoherence(state, snapshot);
        coherenceScores.push(result.coherenceScore);
      }
    }
    
    // Calculate average coherence score
    const averageCoherenceScore = coherenceScores.reduce((sum, score) => sum + score, 0) / coherenceScores.length;
    
    return {
      isCoherent: averageCoherenceScore >= 0.9,
      coherenceScore: averageCoherenceScore,
    };
  }
}