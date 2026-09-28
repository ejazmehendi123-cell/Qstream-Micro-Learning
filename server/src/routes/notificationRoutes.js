import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../controllers/notificationController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validateParamsId } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/', optionalAuth, getNotifications);
router.patch('/read-all', optionalAuth, markAllAsRead);
router.patch('/:id/read', validateParamsId('id', 'Notification ID'), optionalAuth, markAsRead);
router.delete('/:id', validateParamsId('id', 'Notification ID'), optionalAuth, deleteNotification);

export default router;
