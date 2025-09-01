import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { env } from './config/env.ts';
import authRoutes from './routes/auth.routes.ts';
import notesRoutes from './routes/notes.routes.ts';
import { errorHandler } from './middleware/error.middleware.ts';

export const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.use(errorHandler);
