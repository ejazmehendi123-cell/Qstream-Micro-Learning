import { Router } from 'express';
import { getDueToday, completeRevision } from '../controllers/revisionController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validateParamsId } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/today', optionalAuth, getDueToday);
router.post('/:id/complete', validateParamsId('id', 'Revision ID'), optionalAuth, completeRevision);

export default router;
