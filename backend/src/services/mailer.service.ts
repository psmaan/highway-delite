import nodemailer from 'nodemailer';
import { env } from '../config/env.ts';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
});

export async function sendOtpEmail(to: string, code: string) {
  const info = await transporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: 'Your HD App OTP',
    text: `Your OTP is ${code}. It expires in 5 minutes.`,
    html: `<p>Your OTP is <strong>${code}</strong>. It expires in 5 minutes.</p>`
  });
  return info;
}
