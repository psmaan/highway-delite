import { Schema, model, Document } from 'mongoose';

export interface INote extends Document {
  user: string; // ObjectId as string
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  content: { type: String, required: true, maxlength: 2000 }
}, { timestamps: true });

export const Note = model<INote>('Note', noteSchema);
