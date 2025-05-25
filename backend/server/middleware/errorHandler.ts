/**
 * Error Handler Middleware
 * 
 * This middleware handles errors in the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Custom error class
 */
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle development errors
 */
const handleDevelopmentError = (err: AppError, req: Request, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Handle production errors
 */
const handleProductionError = (err: AppError, req: Request, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  
  // Programming or other unknown error: don't leak error details
  logger.error('ERROR 💥', err);
  
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

/**
 * Handle MongoDB duplicate key error
 */
const handleDuplicateKeyError = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  
  return new AppError(message, 400);
};

/**
 * Handle MongoDB validation error
 */
const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  
  return new AppError(message, 400);
};

/**
 * Handle JWT error
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

/**
 * Handle JWT expired error
 */
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401);
};

/**
 * Error handler middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  // Log error
  logger.error(`${err.statusCode} - ${err.message}`, {
    error: err,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });
  
  // Handle specific errors
  let error = { ...err };
  error.message = err.message;
  
  if (error.code === 11000) error = handleDuplicateKeyError(error);
  if (error.name === 'ValidationError') error = handleValidationError(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  
  // Send response based on environment
  if (config.isDevelopment) {
    handleDevelopmentError(error, req, res);
  } else {
    handleProductionError(error, req, res);
  }
};

export default errorHandler;