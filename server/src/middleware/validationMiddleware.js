import { isValidUUID, validateIdentifier } from '../utils/validatorUtil.js';
import { sendError } from '../utils/responseUtil.js';

export function validateParamsId(paramName = 'id', label = 'ID') {
  return (req, res, next) => {
    const value = req.params[paramName];
    const validation = validateIdentifier(value, label);
    if (!validation.isValid) {
      return sendError(res, validation.message, 400);
    }
    next();
  };
}

export function validateUUID(paramName = 'id', label = 'ID') {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!value || value === 'undefined' || value === 'null') {
      return sendError(res, `Invalid or missing ${label}. Got '${value}'.`, 400);
    }
    // Check UUID format or slug format
    if (!isValidUUID(value) && !/^[a-z0-9-_]+$/i.test(value)) {
      return sendError(res, `Invalid format for ${label}: '${value}'`, 400);
    }
    next();
  };
}

export function validateBody(fields = []) {
  return (req, res, next) => {
    const missing = [];
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }
    if (missing.length > 0) {
      return sendError(res, `Missing required body fields: ${missing.join(', ')}`, 400);
    }
    next();
  };
}
