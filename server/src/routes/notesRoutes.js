import { Router } from 'express';
import { getNotesByModuleId } from '../controllers/notesController.js';
import { validateParamsId } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/:moduleId', validateParamsId('moduleId', 'Module ID'), getNotesByModuleId);

export default router;
