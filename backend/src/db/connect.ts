import mongoose from 'mongoose';
import { env } from '../config/env.ts';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
  console.log('MongoDB connected');
}
