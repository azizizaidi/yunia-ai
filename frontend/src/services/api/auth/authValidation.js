/**
 * Authentication Validation Functions
 * Handles validation logic for authentication
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and messages
 */
export const validatePassword = (password) => {
  const result = {
    isValid: true,
    messages: []
  };

  if (password.length < 6) {
    result.isValid = false;
    result.messages.push('Password must be at least 6 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    result.messages.push('Password should contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    result.messages.push('Password should contain at least one number');
  }

  return result;
};

/**
 * Validate user registration data
 * @param {Object} userData - User data to validate
 * @returns {Object} Validation result
 */
export const validateRegistrationData = (userData) => {
  const result = {
    isValid: true,
    messages: []
  };

  // Validate required fields
  if (!userData.name || userData.name.trim().length < 2) {
    result.isValid = false;
    result.messages.push('Name must be at least 2 characters long');
  }

  if (!userData.email || !validateEmail(userData.email)) {
    result.isValid = false;
    result.messages.push('Please enter a valid email address');
  }

  if (!userData.password) {
    result.isValid = false;
    result.messages.push('Password is required');
  } else {
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      result.isValid = false;
      result.messages.push(...passwordValidation.messages);
    }
  }

  return result;
};
