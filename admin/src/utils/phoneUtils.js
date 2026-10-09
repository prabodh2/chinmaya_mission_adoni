export const formatPhoneInput = (value) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
};

export const sanitizePhone = (phone) => {
  if (!phone) return '';
  let clean = String(phone).replace(/\D/g, '');
  if (clean.startsWith('91') && clean.length > 10) {
    clean = clean.slice(2);
  }
  return clean;
};
