import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';
import { AppError } from '../utils/errors.ts';

export const validate = (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err: any) {
    next(new AppError('Validation error: ' + err.errors?.map((e: any) => e.message).join(', '), 400, err));
  }
};
