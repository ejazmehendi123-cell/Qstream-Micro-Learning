import { Router } from 'express';
import { generateQuiz, getQuizById, submitQuiz } from '../controllers/quizController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validateParamsId } from '../middleware/validationMiddleware.js';
import { aiRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

router.post('/generate', aiRateLimiter, optionalAuth, generateQuiz);
router.get('/:id', validateParamsId('id', 'Quiz ID'), getQuizById);
router.post('/:id/submit', validateParamsId('id', 'Quiz ID'), optionalAuth, submitQuiz);

export default router;
