import { Router } from 'express';
import { getUserAnalytics, getTopicAnalytics } from '../controllers/analyticsController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, getUserAnalytics);
router.get('/topics', optionalAuth, getTopicAnalytics);

export default router;
