const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUUID(id) {
  if (!id || typeof id !== 'string') return false;
  if (id === 'undefined' || id === 'null' || id.trim() === '') return false;
  return UUID_REGEX.test(id.trim());
}

export function validateIdentifier(id, name = 'ID') {
  if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
    return {
      isValid: false,
      message: `Invalid ${name}: identifier cannot be undefined, null, or empty.`
    };
  }
  return { isValid: true };
}

export function sanitizeSearchQuery(query) {
  if (!query || typeof query !== 'string') return '';
  return query.trim().replace(/[%_]/g, '');
}
