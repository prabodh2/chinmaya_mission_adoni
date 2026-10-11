import crypto from 'crypto';
import Registration from '../models/Registration.js';
import BulkBatch from '../models/BulkBatch.js';
import { generateRegistrationId } from '../utils/registrationIdGenerator.js';
import { syncRegistrationToGoogleSheets } from '../config/googleSheets.js';

/**
 * Generate unique, unguessable entry pass identifier
 * Example: PASS-CMA2026IN01-A7E4D9
 */
export const generateEntryPassId = (registrationId) => {
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `PASS-${registrationId}-${randomSuffix}`;
};

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
   * Create an Individual Registration (or delegates to Group Registration if a friend is included)
   * Format: CMA + YEAR + IN + INDEX (e.g. CMA2026IN01)
   */
  async createIndividualRegistration(data, userId = null) {
    // If friend data is provided, route through group registration
    if (data.friend && typeof data.friend === 'object' && Object.keys(data.friend).length > 0) {
      return this.createGroupRegistration(data.primary || data, data.friend, userId);
    }

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
      throw new Error('Full Name is required.');
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
    const entryPassId = generateEntryPassId(registrationId);

    const registration = new Registration({
      registrationId,
      registrationYear: year,
      registrationIndex: index,
      userId,
      registeredBy: userId,
      entryPassId,
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
   * Create a Group Registration (Primary User + Friend)
   * Atomically registers two distinct participants linked by a unique groupId.
   * Both participants receive distinct sequential registration IDs and unique entry pass IDs.
   */
  async createGroupRegistration(primaryData, friendData, userId = null) {
    // 1. Validate Primary Participant
    const primaryName = (primaryData.fullName || primaryData.name || '').trim();
    if (!primaryName) {
      throw new Error('Participant 1 (Your) Full Name is required.');
    }
    const primaryPhone = sanitizePhone(primaryData.contactNumber || primaryData.phone || '');
    if (primaryPhone.length !== 10 || !/^[6-9]/.test(primaryPhone)) {
      throw new Error('Participant 1 (Your) valid 10-digit mobile number starting with 6-9 is required.');
    }
    const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const rawPrimarySize = (primaryData.tShirtSize || primaryData.size || 'M').toUpperCase();
    const primarySize = validSizes.includes(rawPrimarySize) ? rawPrimarySize : 'M';
    const parsedPrimaryAge = primaryData.age ? parseInt(primaryData.age, 10) : null;
    const primaryStandard = primaryData.standard ? String(primaryData.standard).trim() : null;
    const primaryProfession = primaryData.profession ? String(primaryData.profession).trim() : null;
    const primaryInstitution = (primaryData.institutionName || primaryData.schoolName || 'N/A').trim();

    // 2. Validate Friend Participant
    const friendName = (friendData.fullName || friendData.name || '').trim();
    if (!friendName) {
      throw new Error("Participant 2 (Friend's) Full Name is required.");
    }
    const friendPhone = sanitizePhone(friendData.contactNumber || friendData.phone || '');
    if (friendPhone.length !== 10 || !/^[6-9]/.test(friendPhone)) {
      throw new Error("Participant 2 (Friend's) valid 10-digit mobile number starting with 6-9 is required.");
    }
    const rawFriendSize = (friendData.tShirtSize || friendData.size || 'M').toUpperCase();
    const friendSize = validSizes.includes(rawFriendSize) ? rawFriendSize : 'M';
    const parsedFriendAge = friendData.age ? parseInt(friendData.age, 10) : null;
    const friendStandard = friendData.standard ? String(friendData.standard).trim() : null;
    const friendProfession = friendData.profession ? String(friendData.profession).trim() : null;
    const friendInstitution = (friendData.institutionName || friendData.schoolName || 'N/A').trim();

    // 3. Duplicate check for either participant in recent 15 seconds
    const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000);
    const existingRecentPrimary = await Registration.findOne({
      fullName: primaryName,
      contactNumber: primaryPhone,
      createdAt: { $gte: fifteenSecondsAgo },
    });
    if (existingRecentPrimary && existingRecentPrimary.groupId) {
      const existingFriend = await Registration.findOne({
        groupId: existingRecentPrimary.groupId,
        groupRole: 'friend',
      });
      if (existingFriend) {
        return {
          isGroup: true,
          groupId: existingRecentPrimary.groupId,
          primary: existingRecentPrimary,
          friend: existingFriend,
          participants: [existingRecentPrimary, existingFriend],
        };
      }
    }

    // 4. Generate unique group booking ID
    const groupYear = new Date().getFullYear();
    const groupRandom = crypto.randomBytes(3).toString('hex').toUpperCase();
    const groupId = `GRP-${groupYear}-${Date.now().toString(36).toUpperCase()}-${groupRandom}`;

    // 5. Atomically allocate 2 sequential registration IDs
    const idGen1 = await generateRegistrationId('individual');
    const idGen2 = await generateRegistrationId('individual');

    const entryPassId1 = generateEntryPassId(idGen1.registrationId);
    const entryPassId2 = generateEntryPassId(idGen2.registrationId);

    // 6. Build Participant 1 (Primary)
    const reg1 = new Registration({
      registrationId: idGen1.registrationId,
      registrationYear: idGen1.year,
      registrationIndex: idGen1.index,
      userId,
      registeredBy: userId,
      groupId,
      groupRole: 'primary',
      entryPassId: entryPassId1,
      fullName: primaryName,
      age: isNaN(parsedPrimaryAge) ? null : parsedPrimaryAge,
      standard: primaryStandard,
      profession: primaryProfession,
      isStudent: Boolean(primaryData.isStudent),
      institutionName: primaryInstitution,
      contactNumber: primaryPhone,
      tShirtSize: primarySize,
      registrationType: 'individual',
      institutionType: 'OTHER',
      status: 'CONFIRMED',
    });

    // 7. Build Participant 2 (Friend - distinct participant, no automatic login account)
    const reg2 = new Registration({
      registrationId: idGen2.registrationId,
      registrationYear: idGen2.year,
      registrationIndex: idGen2.index,
      userId: null,
      registeredBy: userId,
      groupId,
      groupRole: 'friend',
      entryPassId: entryPassId2,
      fullName: friendName,
      age: isNaN(parsedFriendAge) ? null : parsedFriendAge,
      standard: friendStandard,
      profession: friendProfession,
      isStudent: Boolean(friendData.isStudent),
      institutionName: friendInstitution,
      contactNumber: friendPhone,
      tShirtSize: friendSize,
      registrationType: 'individual',
      institutionType: 'OTHER',
      status: 'CONFIRMED',
    });

    // 8. Atomic save: save reg1 first, then reg2. If reg2 fails, rollback reg1.
    await reg1.save();
    try {
      await reg2.save();
    } catch (saveErr) {
      console.error('[Group Registration Rollback] Removing reg1 due to reg2 failure:', saveErr.message);
      await Registration.findByIdAndDelete(reg1._id).catch(() => {});
      throw new Error(`Failed to save friend registration: ${saveErr.message}`);
    }

    // 9. Sync both to Google Sheets in background
    syncRegistrationToGoogleSheets(reg1).catch(() => {});
    syncRegistrationToGoogleSheets(reg2).catch(() => {});

    return {
      isGroup: true,
      groupId,
      primary: reg1,
      friend: reg2,
      participants: [reg1, reg2],
    };
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
    const entryPassId = generateEntryPassId(registrationId);

    const registration = new Registration({
      registrationId,
      registrationYear: year,
      registrationIndex: index,
      userId,
      registeredBy: userId,
      entryPassId,
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
      const entryPassId = generateEntryPassId(registrationId);

      const reg = new Registration({
        registrationId,
        registrationYear: regYear,
        registrationIndex: regIndex,
        userId,
        registeredBy: userId,
        entryPassId,
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
   * Get single registration by registrationId, entryPassId, or _id
   */
  async getRegistrationById(id) {
    if (!id) return null;
    const cleaned = String(id).trim();
    let reg = await Registration.findOne({
      $or: [
        { registrationId: cleaned.toUpperCase() },
        { entryPassId: cleaned.toUpperCase() },
      ],
    });
    if (!reg && cleaned.match(/^[0-9a-fA-F]{24}$/)) {
      reg = await Registration.findById(cleaned);
    }
    return reg;
  },

  /**
   * Verify an Entry Pass by registration ID or entry pass ID.
   * Returns safe participant and event details for display / QR scanning.
   */
  async verifyEntryPass(passIdentifier) {
    if (!passIdentifier) {
      throw new Error('Entry pass identifier is required.');
    }
    const reg = await this.getRegistrationById(passIdentifier);
    if (!reg) {
      return {
        isValid: false,
        message: 'Invalid entry pass. No registration found.',
      };
    }

    const isConfirmed = reg.status === 'CONFIRMED';
    return {
      isValid: isConfirmed,
      status: reg.status,
      registrationId: reg.registrationId,
      entryPassId: reg.entryPassId || `PASS-${reg.registrationId}`,
      fullName: reg.fullName,
      tShirtSize: reg.tShirtSize,
      isStudent: reg.isStudent,
      institutionName: reg.institutionName,
      standard: reg.standard,
      profession: reg.profession,
      contactNumber: reg.contactNumber ? `+91 ${reg.contactNumber.replace(/^\+?91/, '').slice(-4).padStart(10, '•')}` : '—',
      groupId: reg.groupId || null,
      groupRole: reg.groupRole || null,
      event: 'ANTI-DRUG MOVEMENT MARATHON RUN 2026',
      date: 'Sunday, 20 December 2026',
      venue: 'Chinmaya Mission Adoni, Andhra Pradesh',
      message: isConfirmed ? 'Entry pass verified and active.' : `Entry pass is ${reg.status}.`,
    };
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
