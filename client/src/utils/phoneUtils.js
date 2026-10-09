/**
 * Utility functions for 10-digit Indian phone number formatting.
 * Formats ONLY the 10 local digits cleanly without duplicate country codes.
 */

export const formatPhoneInput = (val) => {
  if (!val) return '';

  // Extract digits only
  let digits = val.toString().replace(/\D/g, '');

  // If user pasted or typed leading country code (+91 or 91) with > 10 digits
  if (digits.startsWith('91') && digits.length > 10) {
    digits = digits.slice(2);
  }

  // Limit to maximum 10 digits
  digits = digits.slice(0, 10);

  if (!digits) return '';

  // Return formatted as: XXXXX XXXXX (e.g. 98765 43210)
  if (digits.length > 5) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return digits;
};

export const getCleanPhoneNumber = (val) => {
  if (!val) return '';
  let digits = val.toString().replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length > 10) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 10);
};
