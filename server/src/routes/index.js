import { Router } from 'express';
import authRoutes from './authRoutes.js';
import learningPathRoutes from './learningPathRoutes.js';
import moduleRoutes from './moduleRoutes.js';
import notesRoutes from './notesRoutes.js';
import quizRoutes from './quizRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import revisionRoutes from './revisionRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import leaderboardRoutes from './leaderboardRoutes.js';
import searchRoutes from './searchRoutes.js';
import aiTutorRoutes from './aiTutorRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/learning-paths', learningPathRoutes);
router.use('/modules', moduleRoutes);
router.use('/notes', notesRoutes);
router.use('/quizzes', quizRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/revision', revisionRoutes);
router.use('/certificates', certificateRoutes);
router.use('/notifications', notificationRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/search', searchRoutes);
router.use('/ai', aiTutorRoutes);

export default router;
