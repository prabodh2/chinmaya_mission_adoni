import Registration from '../models/Registration.js';
import BulkBatch from '../models/BulkBatch.js';
import { generateRegistrationId } from '../utils/registrationIdGenerator.js';
import { syncRegistrationToGoogleSheets } from '../config/googleSheets.js';

/**
 * Clean and normalize a 10-digit Indian phone number
 */
const sanitizePhone = (phone) => {
  if (!phone) return '';
  let clean = String(phone).replace(/\D/g, '');
  if (clean.startsWith('91') && clean.length > 10) {
    clean = clean.slice(2);
  }
  return clean;
};

/**
 * Normalize registration type filter for queries
 */
const normalizeTypeQuery = (type) => {
  if (!type || type === 'ALL' || type === 'all') return null;
  const upper = String(type).toUpperCase();
  if (upper === 'INDIVIDUAL' || upper === 'FORM' || upper === 'IN') {
    return {
      $or: [
        { registrationType: { $in: ['individual', 'FORM'] } },
        { registrationId: { $regex: /^CMA\d{4}IN/i } },
      ],
    };
  }
  if (upper === 'SCHOOL_COLLEGE' || upper === 'SCHOOL' || upper === 'COLLEGE' || upper === 'SC') {
    return {
      $or: [
        { registrationType: { $in: ['school_college', 'SCHOOL_COLLEGE'] } },
        { registrationId: { $regex: /^CMA\d{4}SC/i } },
      ],
    };
  }
  return null;
};

export const registrationService = {
  /**
   * Create an Individual Registration
   * Format: CMA + YEAR + IN + INDEX (e.g. CMA2026IN01)
   */
  async createIndividualRegistration(data, userId = null) {
    const {
      fullName,
      studentName,
      name,
      age,
      standard,
      profession,
      dateOfBirth,
      isStudent = true,
      institutionName,
      schoolName,
      school,
      contactNumber,
      parentPhone,
      phone,
      tShirtSize,
      size,
    } = data;

    const finalName = (fullName || studentName || name || '').trim();
    if (!finalName) {
      throw new Error('Student name is required.');
    }

    const rawPhone = contactNumber || parentPhone || phone || '';
    const cleanPhone = sanitizePhone(rawPhone);
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      throw new Error('Please provide a valid 10-digit Indian mobile number starting with 6-9.');
    }

    const rawSize = (tShirtSize || size || 'M').toUpperCase();
    const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const finalSize = validSizes.includes(rawSize) ? rawSize : 'M';

    const finalInstitution = (institutionName || schoolName || school || 'N/A').trim();
    const parsedAge = age ? parseInt(age, 10) : null;
    const finalStandard = standard ? String(standard).trim() : null;
    const finalProfession = profession ? String(profession).trim() : null;

    let parsedDob = null;
    if (dateOfBirth) {
      const d = new Date(dateOfBirth);
      if (!isNaN(d.getTime())) parsedDob = d;
    }

    // Duplicate submission guard (15 seconds window for exact same student & phone)
    const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000);
    const existingRecent = await Registration.findOne({
      fullName: finalName,
      contactNumber: cleanPhone,
      createdAt: { $gte: fifteenSecondsAgo },
    });
    if (existingRecent) {
      return existingRecent;
    }

    // Atomically generate sequential ID (e.g. CMA2026IN01)
    const { registrationId, year, index } = await generateRegistrationId('individual');

    const registration = new Registration({
      registrationId,
      registrationYear: year,
      registrationIndex: index,
      userId,
      fullName: finalName,
      age: isNaN(parsedAge) ? null : parsedAge,
      standard: finalStandard,
      profession: finalProfession,
      dateOfBirth: parsedDob,
      isStudent: Boolean(isStudent),
      institutionName: finalInstitution,
      contactNumber: cleanPhone,
      tShirtSize: finalSize,
      registrationType: 'individual',
      institutionType: 'OTHER',
      status: 'CONFIRMED',
    });

    await registration.save();

    // Trigger Google Sheets sync in background
    syncRegistrationToGoogleSheets(registration)
      .then(async (syncResult) => {
        try {
          registration.googleSheetsSync = syncResult;
          await registration.save();
        } catch (e) {}
      })
      .catch(() => {});

    return registration;
  },

  /**
   * Create a Single School / College Registration
   * Format: CMA + YEAR + SC + INDEX (e.g. CMA2026SC01)
   */
  async createSchoolCollegeRegistration(data, userId = null) {
    const {
      fullName,
      studentName,
      name,
      age,
      standard,
      institutionName,
      schoolName,
      school,
      institutionType = 'SCHOOL',
      contactNumber,
      parentPhone,
      phone,
      tShirtSize,
      size,
      contactPersonName,
      batchId = null,
      dateOfBirth,
    } = data;

    const finalName = (fullName || studentName || name || '').trim();
    if (!finalName) {
      throw new Error('Student name is required.');
    }

    const rawPhone = contactNumber || parentPhone || phone || '';
    const cleanPhone = sanitizePhone(rawPhone);
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      throw new Error('Please provide a valid 10-digit Indian mobile number.');
    }

    const rawSize = (tShirtSize || size || 'M').toUpperCase();
    const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const finalSize = validSizes.includes(rawSize) ? rawSize : 'M';

    const finalInstitution = (institutionName || schoolName || school || '').trim();
    if (!finalInstitution) {
      throw new Error('School/College name is required.');
    }

    const parsedAge = age ? parseInt(age, 10) : null;
    const finalStandard = standard ? String(standard).trim() : null;

    let parsedDob = null;
    if (dateOfBirth) {
      const d = new Date(dateOfBirth);
      if (!isNaN(d.getTime())) parsedDob = d;
    }

    // Atomically generate sequential ID (e.g. CMA2026SC01)
    const { registrationId, year, index } = await generateRegistrationId('school_college');

    const registration = new Registration({
      registrationId,
      registrationYear: year,
      registrationIndex: index,
      userId,
      fullName: finalName,
      age: isNaN(parsedAge) ? null : parsedAge,
      standard: finalStandard,
      dateOfBirth: parsedDob,
      isStudent: true,
      institutionName: finalInstitution,
      contactNumber: cleanPhone,
      tShirtSize: finalSize,
      registrationType: 'school_college',
      institutionType: institutionType === 'COLLEGE' ? 'COLLEGE' : 'SCHOOL',
      batchId,
      contactPersonName: contactPersonName ? contactPersonName.trim() : null,
      status: 'CONFIRMED',
    });

    await registration.save();

    // Background sync
    syncRegistrationToGoogleSheets(registration)
      .then(async (syncResult) => {
        try {
          registration.googleSheetsSync = syncResult;
          await registration.save();
        } catch (e) {}
      })
      .catch(() => {});

    return registration;
  },

  /**
   * Bulk Registration for School / College
   * Iterates through student rows and assigns sequential CMA...SC... IDs
   */
  async createBulkSchoolCollegeRegistrations({
    contactPersonName,
    phone,
    institutionType,
    institutionName,
    students,
    file,
    userId = null,
  }) {
    if (!contactPersonName || !phone || !institutionName) {
      throw new Error('Contact person name, phone number, and institution name are required.');
    }

    const cleanContactPhone = sanitizePhone(phone);
    if (cleanContactPhone.length !== 10 || !/^[6-9]/.test(cleanContactPhone)) {
      throw new Error('Please provide a valid 10-digit Indian contact phone number.');
    }

    if (!Array.isArray(students) || students.length === 0) {
      throw new Error('No student records provided for bulk registration.');
    }

    const year = new Date().getFullYear();
    const batchRandom = Math.floor(1000 + Math.random() * 9000);
    const batchId = `BATCH-${year}-${batchRandom}`;

    const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    let validCount = 0;
    let failedCount = 0;
    const createdRegistrations = [];

    for (const st of students) {
      const studentName = (
        st.fullName ||
        st.name ||
        st['Student Name'] ||
        st['student name'] ||
        st['Full Name'] ||
        st['FULL NAME'] ||
        ''
      ).trim();

      if (!studentName) {
        failedCount++;
        continue;
      }

      const stPhone = sanitizePhone(
        st.phone ||
        st.contactNumber ||
        st["Parent's Phone Number"] ||
        st['Parent Phone'] ||
        cleanContactPhone
      );
      const studentPhone = stPhone.length === 10 ? stPhone : cleanContactPhone;

      const rawSize = (st.tShirtSize || st.size || st['T-Shirt Size'] || 'M').toString().trim().toUpperCase();
      const studentSize = validSizes.includes(rawSize) ? rawSize : 'M';

      const studentAge = st.age || st['Age'] ? parseInt(st.age || st['Age'], 10) : null;
      const studentStandard = (st.standard || st['Standard / Class'] || st['Class'] || '').toString().trim() || null;
      const studentSchool = (st.school || st['School / College'] || institutionName).toString().trim();

      // Atomically generate sequential CMA...SC... ID
      const { registrationId, year: regYear, index: regIndex } = await generateRegistrationId('school_college');

      const reg = new Registration({
        registrationId,
        registrationYear: regYear,
        registrationIndex: regIndex,
        userId,
        fullName: studentName,
        age: isNaN(studentAge) ? null : studentAge,
        standard: studentStandard,
        isStudent: true,
        institutionName: studentSchool || institutionName.trim(),
        contactNumber: studentPhone,
        tShirtSize: studentSize,
        registrationType: 'school_college',
        institutionType: institutionType === 'COLLEGE' ? 'COLLEGE' : 'SCHOOL',
        batchId,
        contactPersonName: contactPersonName.trim(),
        status: 'CONFIRMED',
      });

      await reg.save();
      createdRegistrations.push(reg);
      validCount++;

      // Background Google Sheets sync
      syncRegistrationToGoogleSheets(reg)
        .then(async (syncResult) => {
          try {
            reg.googleSheetsSync = syncResult;
            await reg.save();
          } catch (e) {}
        })
        .catch(() => {});
    }

    // Save BulkBatch metadata record
    const bulkBatch = new BulkBatch({
      batchId,
      institutionName: institutionName.trim(),
      institutionType: institutionType === 'COLLEGE' ? 'COLLEGE' : 'SCHOOL',
      contactPersonName: contactPersonName.trim(),
      phone: cleanContactPhone,
      totalStudents: students.length,
      validRecords: validCount,
      failedRecords: failedCount,
      fileName: file ? file.originalname : `Batch_${batchId}.csv`,
      fileMimeType: file ? file.mimetype : 'text/csv',
      fileSize: file ? file.size : 0,
      fileData: file && file.buffer ? file.buffer.toString('base64') : null,
    });

    await bulkBatch.save();

    return {
      batchId,
      totalStudents: students.length,
      validCount,
      failedCount,
      bulkBatch,
      createdRegistrations,
    };
  },

  /**
   * Query registrations with filters, search, and pagination
   */
  async getRegistrations({
    type,
    search,
    standard,
    size,
    institution,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    order = 'desc',
  } = {}) {
    const query = { status: 'CONFIRMED' };

    // Registration Type Filter (All, Individual, School/College)
    const typeCondition = normalizeTypeQuery(type);
    if (typeCondition) {
      Object.assign(query, typeCondition);
    }

    // Search across ID, Name, Phone, Institution, Standard
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      const searchConditions = [
        { registrationId: searchRegex },
        { fullName: searchRegex },
        { contactNumber: searchRegex },
        { institutionName: searchRegex },
        { standard: searchRegex },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    // Standard / Class Filter
    if (standard && standard !== 'ALL') {
      query.standard = standard.trim();
    }

    // T-Shirt Size Filter
    if (size && size !== 'ALL') {
      query.tShirtSize = size.toUpperCase();
    }

    // Institution Filter
    if (institution && institution !== 'ALL') {
      query.institutionName = new RegExp(institution.trim(), 'i');
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    const [items, total] = await Promise.all([
      Registration.find(query).sort(sortObj).skip(skip).limit(limitNum),
      Registration.countDocuments(query),
    ]);

    return {
      items,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
    };
  },

  /**
   * Get single registration by registrationId or _id
   */
  async getRegistrationById(id) {
    if (!id) return null;
    const cleaned = String(id).trim();
    let reg = await Registration.findOne({ registrationId: cleaned.toUpperCase() });
    if (!reg && cleaned.match(/^[0-9a-fA-F]{24}$/)) {
      reg = await Registration.findById(cleaned);
    }
    return reg;
  },

  /**
   * Update registration fields (Registration ID is immutable!)
   */
  async updateRegistration(id, updateData) {
    const reg = await this.getRegistrationById(id);
    if (!reg) {
      throw new Error(`Registration not found with ID: ${id}`);
    }

    // Only allow updating editable fields
    if (updateData.fullName !== undefined) reg.fullName = String(updateData.fullName).trim();
    if (updateData.age !== undefined) {
      const parsed = parseInt(updateData.age, 10);
      reg.age = isNaN(parsed) ? null : parsed;
    }
    if (updateData.standard !== undefined) {
      reg.standard = updateData.standard ? String(updateData.standard).trim() : null;
    }
    if (updateData.contactNumber !== undefined) {
      const phone = sanitizePhone(updateData.contactNumber);
      if (phone.length === 10) reg.contactNumber = phone;
    }
    if (updateData.institutionName !== undefined) {
      reg.institutionName = String(updateData.institutionName).trim();
    }
    if (updateData.tShirtSize !== undefined) {
      const sz = String(updateData.tShirtSize).toUpperCase();
      if (['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].includes(sz)) {
        reg.tShirtSize = sz;
      }
    }
    if (updateData.status !== undefined) {
      if (['CONFIRMED', 'CANCELLED'].includes(updateData.status)) {
        reg.status = updateData.status;
      }
    }
    if (updateData.dateOfBirth !== undefined) {
      const d = new Date(updateData.dateOfBirth);
      if (!isNaN(d.getTime())) reg.dateOfBirth = d;
    }

    await reg.save();
    return reg;
  },

  /**
   * Delete a registration record.
   * Atomic counter is NOT decremented, preserving ID sequence.
   */
  async deleteRegistration(id) {
    const cleaned = String(id).trim();
    const query = cleaned.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ registrationId: cleaned.toUpperCase() }, { _id: cleaned }] }
      : { registrationId: cleaned.toUpperCase() };

    const deleted = await Registration.findOneAndDelete(query);
    if (!deleted) {
      throw new Error(`Registration not found with ID: ${id}`);
    }
    return deleted;
  },

  /**
   * Dynamic Database Summary Calculation
   * Returns:
   * - totalRegistrations
   * - individualRegistrations
   * - schoolCollegeRegistrations
   * - classWise (dynamic counts per class)
   * - tshirtSizes (S, M, L, XL, ...)
   * - totalTshirts
   */
  async getSummary(year) {
    const baseMatch = { status: 'CONFIRMED' };
    if (year) {
      baseMatch.registrationYear = parseInt(year, 10);
    }

    // 1. Total registrations count
    const totalRegistrations = await Registration.countDocuments(baseMatch);

    // 2. Individual registrations count (FORM or individual or CMA...IN...)
    const individualRegistrations = await Registration.countDocuments({
      ...baseMatch,
      $or: [
        { registrationType: { $in: ['individual', 'FORM'] } },
        { registrationId: { $regex: /^CMA\d{4}IN/i } },
      ],
    });

    // 3. School / College registrations count (SCHOOL_COLLEGE or school_college or CMA...SC...)
    const schoolCollegeRegistrations = await Registration.countDocuments({
      ...baseMatch,
      $or: [
        { registrationType: { $in: ['school_college', 'SCHOOL_COLLEGE'] } },
        { registrationId: { $regex: /^CMA\d{4}SC/i } },
      ],
    });

    // 4. Dynamic T-Shirt Size Aggregation
    const sizeCounts = await Registration.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: '$tShirtSize',
          count: { $sum: 1 },
        },
      },
    ]);

    const tshirtSizes = {
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0,
      XXXL: 0,
    };

    let totalTshirts = 0;
    sizeCounts.forEach((item) => {
      if (item._id) {
        const sizeKey = String(item._id).trim().toUpperCase();
        if (Object.prototype.hasOwnProperty.call(tshirtSizes, sizeKey)) {
          tshirtSizes[sizeKey] = item.count;
        } else {
          tshirtSizes[sizeKey] = item.count;
        }
        totalTshirts += item.count;
      }
    });

    // 5. Dynamic Class-Wise Aggregation
    const classAggregation = await Registration.aggregate([
      {
        $match: {
          ...baseMatch,
          standard: { $nin: [null, '', 'N/A', 'NA'] },
        },
      },
      {
        $group: {
          _id: '$standard',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const classWise = {};
    classAggregation.forEach((item) => {
      if (item._id) {
        const cls = String(item._id).trim();
        classWise[cls] = item.count;
      }
    });

    return {
      totalRegistrations,
      individualRegistrations,
      schoolCollegeRegistrations,
      classWise,
      tshirtSizes: {
        S: tshirtSizes.S,
        M: tshirtSizes.M,
        L: tshirtSizes.L,
        XL: tshirtSizes.XL,
        XS: tshirtSizes.XS,
        XXL: tshirtSizes.XXL,
        XXXL: tshirtSizes.XXXL,
      },
      totalTshirts,
    };
  },

  /**
   * Fast counts summary
   */
  async getCounts() {
    const [total, individual, schoolCollege] = await Promise.all([
      Registration.countDocuments({ status: 'CONFIRMED' }),
      Registration.countDocuments({
        status: 'CONFIRMED',
        $or: [
          { registrationType: { $in: ['individual', 'FORM'] } },
          { registrationId: { $regex: /^CMA\d{4}IN/i } },
        ],
      }),
      Registration.countDocuments({
        status: 'CONFIRMED',
        $or: [
          { registrationType: { $in: ['school_college', 'SCHOOL_COLLEGE'] } },
          { registrationId: { $regex: /^CMA\d{4}SC/i } },
        ],
      }),
    ]);

    return { total, individual, schoolCollege };
  },
};

export default registrationService;
