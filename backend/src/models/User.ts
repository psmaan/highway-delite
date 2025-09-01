import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  dob?: string;
  provider: 'email' | 'google';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  dob: { type: String },
  provider: { type: String, enum: ['email', 'google'], required: true }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
