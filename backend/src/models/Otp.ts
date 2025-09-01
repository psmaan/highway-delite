import { Schema, model, Document } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  codeHash: string;
  purpose: 'signup' | 'login';
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true, index: true },
  codeHash: { type: String, required: true },
  purpose: { type: String, enum: ['signup', 'login'], required: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// TTL to auto-delete expired docs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = model<IOtp>('Otp', otpSchema);
