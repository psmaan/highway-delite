import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { User } from '../models/User.ts';
import { Otp } from '../models/Otp.ts';
import { generateOtp, hashOtp } from '../utils/otp.util.ts';
import { sendOtpEmail } from '../services/mailer.service.ts';
import { AppError } from '../utils/errors.ts';
import { signAccessToken, signRefreshToken } from '../services/token.service.ts';
import { env } from '../config/env.ts';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

// Request OTP for signup
export async function requestSignupOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({
      name: z.string().min(2).max(80),
      dob: z.string().optional(),
      email: z.string().email()
    });
    const { name, email, dob } = schema.parse(req.body);

    // remove existing signup OTPs
    await Otp.deleteMany({ email, purpose: 'signup' });

    const code = generateOtp();
    const codeHash = hashOtp(code);
    await Otp.create({ email, codeHash, purpose: 'signup', expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

    await sendOtpEmail(email, code);
    return res.json({ message: 'OTP sent' });
  } catch (err) {
    next(err);
  }
}

// Verify signup OTP and create user + set tokens
export async function verifySignupOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({
      name: z.string().min(2).max(80),
      dob: z.string().optional(),
      email: z.string().email(),
      otp: z.string().length(6)
    });
    const { name, dob, email, otp } = schema.parse(req.body);

    const rec = await Otp.findOne({ email, purpose: 'signup' });
    if (!rec) throw new AppError('OTP not found or expired', 400);
    if (rec.codeHash !== hashOtp(otp)) throw new AppError('Incorrect OTP', 400);

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email, dob, provider: 'email' });

    await Otp.deleteMany({ email, purpose: 'signup' });

    const payload = { id: user.id, email: user.email, name: user.name };
    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);

    res.cookie('access_token', access, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 15
    });
    res.cookie('refresh_token', refresh, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    // send tokens in JSON too (dev-friendly)
    res.json({
      user: payload,
      accessToken: access,
      refreshToken: refresh
    });
  } catch (err) {
    next(err);
  }
}

// Request login OTP (only if user exists and provider=email)
export async function requestLoginOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({ email: z.string().email() });
    const { email } = schema.parse(req.body);

    const user = await User.findOne({ email, provider: 'email' });
    if (!user) throw new AppError('No email signup found. Use sign up or Google login', 404);

    await Otp.deleteMany({ email, purpose: 'login' });
    const code = generateOtp();
    await Otp.create({ email, codeHash: hashOtp(code), purpose: 'login', expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
    await sendOtpEmail(email, code);
    res.json({ message: 'OTP sent' });
  } catch (err) {
    next(err);
  }
}

// Verify login OTP
export async function verifyLoginOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({ email: z.string().email(), otp: z.string().length(6) });
    const { email, otp } = schema.parse(req.body);

    const rec = await Otp.findOne({ email, purpose: 'login' });
    if (!rec) throw new AppError('OTP not found or expired', 400);
    if (rec.codeHash !== hashOtp(otp)) throw new AppError('Incorrect OTP', 400);

    const user = await User.findOne({ email, provider: 'email' });
    if (!user) throw new AppError('User not found', 404);

    await Otp.deleteMany({ email, purpose: 'login' });

    const payload = { id: user.id, email: user.email, name: user.name };
    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);

    // inside verifyLoginOtp — replace the final res.json(...)
    res.cookie('access_token', access, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 15
    });
    res.cookie('refresh_token', refresh, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.json({
      user: {
        name: user.name,
        email: user.email,
      },
      accessToken: access,
      refreshToken: refresh
    });

  } catch (err) {
    next(err);
  }
}

// Google sign-in
export async function googleSignIn(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({ credential: z.string().min(10) });
    const { credential } = schema.parse(req.body);

    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.name) throw new AppError('Invalid Google token', 400);

    let user = await User.findOne({ email: payload.email });
    if (!user) user = await User.create({ name: payload.name, email: payload.email, provider: 'google' });

    const claims = { id: user.id, email: user.email, name: user.name };
    const access = signAccessToken(claims);
    const refresh = signRefreshToken(claims);

    res.cookie('access_token', access, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 1000 * 60 * 15 });
    res.cookie('refresh_token', refresh, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 });

    res.json({ user: claims });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.json({ message: 'Signed out' });
}
