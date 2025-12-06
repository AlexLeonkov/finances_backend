import { Request, Response, NextFunction } from 'express';
import { fail } from './response';

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  fail(res, message, statusCode);
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  fail(res, `Route ${req.originalUrl} not found`, 404);
}

