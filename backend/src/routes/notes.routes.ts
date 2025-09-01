import { Router } from 'express';
import * as notesCtrl from '../controllers/notes.controller.ts';
import { requireAuth } from '../middleware/auth.middleware.ts';

const router = Router();
router.use(requireAuth);

router.get('/', notesCtrl.getNotes);
router.post('/', notesCtrl.createNote);
router.delete('/:id', notesCtrl.deleteNote);

export default router;
