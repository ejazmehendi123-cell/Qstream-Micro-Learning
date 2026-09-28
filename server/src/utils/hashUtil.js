import crypto from 'crypto';

export function computeQuestionHash(text) {
  if (!text) return '';
  return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex');
}

export function generateVerificationToken(userId, pathId) {
  const payload = `${userId}:${pathId}:${Date.now()}`;
  return crypto.createHash('sha256').update(payload).digest('hex').substring(0, 32);
}

export function generateCertificateId() {
  const randomSuffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  const year = new Date().getFullYear();
  return `QSTRM-${year}-${randomSuffix}`;
}
