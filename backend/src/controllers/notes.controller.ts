import express from 'express';
import type { Request, Response, NextFunction } from "express";
import { Note } from "../models/note.ts";
import { AppError } from "../utils/errors.ts";

// Get all notes for logged-in user
export const getNotes = async (req: any, res: Response, next: NextFunction) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ notes });
  } catch (err) {
    next(err);
  }
};

// Create new note
export const createNote = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    if (!content) throw new AppError("Content is required", 400);

    const note = await Note.create({
      user: req.user.id,
      content,
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

// Delete a note
export const deleteNote = async (req: any, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) throw new AppError("Note not found or not authorized", 404);

    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};
