/**
 * Data Validation Functions
 * Handles data validation and sanitization
 */

/**
 * Validate required fields in data object
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result
 */
export const validateRequiredFields = (data, requiredFields) => {
  const result = {
    isValid: true,
    missingFields: [],
    errors: []
  };

  requiredFields.forEach(field => {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      result.isValid = false;
      result.missingFields.push(field);
      result.errors.push(`Field '${field}' is required`);
    }
  });

  return result;
};

/**
 * Validate data types
 * @param {Object} data - Data object to validate
 * @param {Object} schema - Schema object with field types
 * @returns {Object} Validation result
 */
export const validateDataTypes = (data, schema) => {
  const result = {
    isValid: true,
    typeErrors: [],
    errors: []
  };

  Object.keys(schema).forEach(field => {
    if (data[field] !== undefined && data[field] !== null) {
      const expectedType = schema[field];
      const actualType = typeof data[field];

      if (expectedType === 'array' && !Array.isArray(data[field])) {
        result.isValid = false;
        result.typeErrors.push({ field, expected: 'array', actual: actualType });
        result.errors.push(`Field '${field}' should be an array`);
      } else if (expectedType !== 'array' && actualType !== expectedType) {
        result.isValid = false;
        result.typeErrors.push({ field, expected: expectedType, actual: actualType });
        result.errors.push(`Field '${field}' should be of type ${expectedType}`);
      }
    }
  });

  return result;
};

/**
 * Sanitize string data
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') {
    return str;
  }

  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL format
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate date format
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Validate numeric range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if value is within range
 */
export const isInRange = (value, min, max) => {
  return typeof value === 'number' && value >= min && value <= max;
};

/**
 * Sanitize object data
 * @param {Object} obj - Object to sanitize
 * @param {Array} allowedFields - Array of allowed field names
 * @returns {Object} Sanitized object
 */
export const sanitizeObject = (obj, allowedFields = null) => {
  const sanitized = {};

  Object.keys(obj).forEach(key => {
    // Skip if field is not in allowed list
    if (allowedFields && !allowedFields.includes(key)) {
      return;
    }

    const value = obj[key];

    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value, allowedFields);
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

/**
 * Validate array data
 * @param {Array} arr - Array to validate
 * @param {Function} itemValidator - Function to validate each item
 * @returns {Object} Validation result
 */
export const validateArray = (arr, itemValidator) => {
  const result = {
    isValid: true,
    invalidItems: [],
    errors: []
  };

  if (!Array.isArray(arr)) {
    result.isValid = false;
    result.errors.push('Expected an array');
    return result;
  }

  arr.forEach((item, index) => {
    const itemResult = itemValidator(item);
    if (!itemResult.isValid) {
      result.isValid = false;
      result.invalidItems.push({ index, errors: itemResult.errors });
      result.errors.push(`Item at index ${index} is invalid: ${itemResult.errors.join(', ')}`);
    }
  });

  return result;
};
