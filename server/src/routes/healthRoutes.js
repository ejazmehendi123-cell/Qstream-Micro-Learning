import { Router } from 'express';
import { checkHealth, checkServices } from '../controllers/healthController.js';

const router = Router();

router.get('/', checkHealth);
router.get('/services', checkServices);

export default router;
