import RegistrationCounter from '../models/RegistrationCounter.js';

/**
 * Registration ID Generator Utility
 * 
 * Generates unique, sequential registration IDs in the format:
 *   CMA + YEAR + TYPE_CODE + ZERO_PADDED_INDEX
 * 
 * Examples:
 *   CMA2026IN01  (1st individual registration in 2026)
 *   CMA2026SC01  (1st school/college registration in 2026)
 *   CMA2026IN100 (100th individual registration in 2026)
 * 
 * TYPE_CODE mapping:
 *   individual / IN / FORM          → IN  (counter key: 'individual')
 *   school_college / SC / SCHOOL_COLLEGE → SC  (counter key: 'school_college')
 * 
 * Uses MongoDB atomic findOneAndUpdate with $inc to safely increment
 * the counter, preventing race conditions and duplicate IDs.
 * 
 * Deleted registration IDs are never reused — the counter only increments.
 */

const NORMALIZED_TYPE_MAP = {
  individual: { code: 'IN', counterType: 'individual' },
  IN: { code: 'IN', counterType: 'individual' },
  FORM: { code: 'IN', counterType: 'individual' },
  school_college: { code: 'SC', counterType: 'school_college' },
  SC: { code: 'SC', counterType: 'school_college' },
  SCHOOL_COLLEGE: { code: 'SC', counterType: 'school_college' },
};

/**
 * Generate the next registration ID for a given type.
 * 
 * @param {'individual' | 'school_college' | 'IN' | 'SC' | 'FORM' | 'SCHOOL_COLLEGE'} type
 * @param {number} [year] - Registration year (defaults to current year)
 * @returns {Promise<{ registrationId: string, year: number, index: number, normalizedType: string }>}
 */
export const generateRegistrationId = async (type, year) => {
  const mapping = NORMALIZED_TYPE_MAP[type];
  if (!mapping) {
    throw new Error(`Invalid registration type: ${type}. Must be 'individual' or 'school_college'.`);
  }

  const registrationYear = year || new Date().getFullYear();
  const { code: typeCode, counterType } = mapping;

  // Atomically increment the counter — upsert creates it if it doesn't exist
  const counter = await RegistrationCounter.findOneAndUpdate(
    { year: registrationYear, type: counterType },
    { $inc: { lastIndex: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const index = counter.lastIndex;

  // Zero-pad to at least 2 digits (01, 02, ..., 09, 10, 11, ..., 99, 100, 101)
  const paddedIndex = String(index).padStart(2, '0');

  const registrationId = `CMA${registrationYear}${typeCode}${paddedIndex}`;

  return {
    registrationId,
    year: registrationYear,
    index,
    normalizedType: counterType,
  };
};

/**
 * Get the current counter value without incrementing.
 * Useful for admin display.
 * 
 * @param {'individual' | 'school_college' | 'IN' | 'SC'} type
 * @param {number} [year]
 * @returns {Promise<number>}
 */
export const getCurrentIndex = async (type, year) => {
  const mapping = NORMALIZED_TYPE_MAP[type];
  if (!mapping) return 0;
  const registrationYear = year || new Date().getFullYear();
  const counter = await RegistrationCounter.findOne({
    year: registrationYear,
    type: mapping.counterType,
  });
  return counter ? counter.lastIndex : 0;
};
