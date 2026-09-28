import { Router } from 'express';
import {
  getAllModules,
  getModuleById,
  updateModuleProgress
} from '../controllers/moduleController.js';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';
import { validateParamsId } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/', getAllModules);
router.get('/:id', validateParamsId('id', 'Module ID'), optionalAuth, getModuleById);
router.post('/:id/progress', validateParamsId('id', 'Module ID'), requireAuth, updateModuleProgress);

export default router;
