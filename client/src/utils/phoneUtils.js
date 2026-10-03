/**
 * Utility functions for 10-digit Indian phone number formatting with automatic +91 prefixing.
 */

export const formatPhoneInput = (val) => {
  if (!val) return '';
  
  // Extract digits
  let digits = val.replace(/\D/g, '');

  // If user typed/pasted with leading +91 or 91
  if (digits.startsWith('91')) {
    if (digits.length > 10 || val.trim().startsWith('+91')) {
      digits = digits.slice(2);
    }
  }

  // Limit to max 10 digits
  digits = digits.slice(0, 10);

  if (!digits) return '';

  return `+91 ${digits}`;
};

export const getCleanPhoneNumber = (val) => {
  if (!val) return '';
  let digits = val.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length > 10) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 10);
};
