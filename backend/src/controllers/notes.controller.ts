import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Note } from '../models/Note.ts';
import { AppError } from '../utils/errors.ts';

export async function getNotes(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ notes });
  } catch (err) {
    next(err);
  }
}

export async function createNote(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = z.object({ content: z.string().min(1).max(2000) });
    const { content } = schema.parse(req.body);
    const userId = (req as any).user.id;
    const note = await Note.create({ user: userId, content });
    res.status(201).json({ note });
  } catch (err) {
    next(err);
  }
}

export async function deleteNote(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, user: userId });
    if (!note) throw new AppError('Note not found', 404);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}
