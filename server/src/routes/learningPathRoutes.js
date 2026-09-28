import { Router } from 'express';
import {
  getAllLearningPaths,
  getLearningPathById,
  getPathProgress
} from '../controllers/learningPathController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validateParamsId } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/', getAllLearningPaths);
router.get('/:id', validateParamsId('id', 'Learning Path ID'), optionalAuth, getLearningPathById);
router.get('/:id/progress', validateParamsId('id', 'Learning Path ID'), optionalAuth, getPathProgress);

export default router;
