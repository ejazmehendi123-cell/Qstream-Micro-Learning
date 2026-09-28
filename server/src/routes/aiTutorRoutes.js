import { Router } from 'express';
import { handleTutorChat } from '../controllers/aiTutorController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { aiRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

router.post('/tutor', aiRateLimiter, optionalAuth, handleTutorChat);

export default router;
