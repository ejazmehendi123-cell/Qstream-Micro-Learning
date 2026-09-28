import { Router } from 'express';
import { getMe, updateProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

router.use(authRateLimiter);
router.get('/me', requireAuth, getMe);
router.post('/profile', requireAuth, updateProfile);
router.patch('/profile', requireAuth, updateProfile);

export default router;
