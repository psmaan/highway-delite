import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.ts';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message, details: err.details || undefined });
  }
  // zod validation errors might arrive here
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
}
