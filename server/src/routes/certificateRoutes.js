import { Router } from 'express';
import {
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  generateCertificate
} from '../controllers/certificateController.js';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';
import { validateParamsId } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/', optionalAuth, getUserCertificates);
router.post('/generate', requireAuth, generateCertificate);
router.get('/verify/:token', validateParamsId('token', 'Verification Token'), verifyCertificate);
router.get('/:id', validateParamsId('id', 'Certificate ID'), getCertificateById);

export default router;
