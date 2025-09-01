import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.ts';
import { verifyAccessToken } from '../services/token.service.ts';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = (req.cookies && req.cookies['access_token']) as string | undefined;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : cookieToken;
    if (!token) throw new AppError('Unauthorized', 401);
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    return next(new AppError(err?.message || 'Unauthorized', 401));
  }
}
