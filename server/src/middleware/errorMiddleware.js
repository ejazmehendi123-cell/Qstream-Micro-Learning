import { sendError } from '../utils/responseUtil.js';

export function errorHandler(err, req, res, next) {
  console.error(`[Server Error] ${req.method} ${req.url}:`, err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? err : null);
}

export function notFoundHandler(req, res) {
  return sendError(res, `API route not found: ${req.method} ${req.originalUrl}`, 404);
}
