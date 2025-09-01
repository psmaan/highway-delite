import jwt from 'jsonwebtoken';
import { env } from '../config/env.ts';

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, env.REFRESH_SECRET, { expiresIn: env.REFRESH_EXPIRES_IN });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.REFRESH_SECRET) as JwtPayload;
}
