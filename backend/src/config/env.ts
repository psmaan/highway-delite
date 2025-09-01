import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/notesapp',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'changeme',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REFRESH_SECRET: process.env.REFRESH_SECRET || 'changeme2',
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || '7d',
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,
  MAIL_FROM: process.env.MAIL_FROM || 'HD <no-reply@hd.local>',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!
};
