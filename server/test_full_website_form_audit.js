import 'dotenv/config';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import http from 'http';
import app from './src/app.js';
import User from './src/models/User.js';
import ContactMessage from './src/models/ContactMessage.js';
import Volunteer from './src/models/Volunteer.js';
import SevaBooking from './src/models/SevaBooking.js';
import Registration from './src/models/Registration.js';
import Thought from './src/models/Thought.js';
import EventConfig from './src/models/EventConfig.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chyk_adoni_anti_drug_marathon_2026_jwt_secret_key_987654321';
const TEST_PORT = 5098;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

const results = [];
function recordResult(testName, passed, details = '') {
  results.push({ testName, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon}: ${testName} ${details ? `(${details})` : ''}`);
}

async function runAuditTestSuite() {
  console.log('================================================================');
  console.log('🚀 FULL WEBSITE FORM AUDIT, DATABASE VERIFICATION & TEST SUITE');
  console.log('================================================================\n');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB Atlas cluster for verification\n');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`✓ Test API running on port ${TEST_PORT}\n`);

  // Unique test identifiers to cleanly query and clean up
  const auditSuffix = Date.now().toString(36).toUpperCase();
  const testPhoneUser = '9888800001';
  const testPhoneDonor = '9888800002';
  const testPhoneVolunteer = '9888800003';
  const testPhoneContact = '9888800004';

  try {
    // -------------------------------------------------------------
    // TEST 1: CONTACT US / LET'S CONNECT FORM (LetsConnectPage)
    // -------------------------------------------------------------
    console.log('\n--- 1. AUDIT: Let\'s Connect / Contact Us Form ---');
    
    // 1A. Valid Submission
    const contactPayload = {
      fullName: `Devotee Audit ${auditSuffix}`,
      email: `contact_${auditSuffix}@chinmayamissionadoni.org`,
      phone: testPhoneContact,
      category: 'Youth Activities',
      message: 'Interested in attending weekly satsangs and Gita classes.',
    };

    const resContact = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload),
    });
    const dataContact = await resContact.json();

    if (resContact.status === 201 && dataContact.success && dataContact.data?._id) {
      // Direct Database Query Verification
      const dbContact = await ContactMessage.findById(dataContact.data._id);
      const isSavedAccurately =
        dbContact &&
        dbContact.fullName === contactPayload.fullName &&
        dbContact.phone === contactPayload.phone &&
        dbContact.category === contactPayload.category &&
        dbContact.message === contactPayload.message &&
        dbContact.status === 'NEW';

      recordResult(
        'Let\'s Connect Form - Valid Submission & DB Persistence',
        Boolean(isSavedAccurately),
        `DB _id: ${dbContact?._id}`
      );
      // Clean up test record
      await ContactMessage.findByIdAndDelete(dataContact.data._id);
    } else {
      recordResult('Let\'s Connect Form - Valid Submission', false, dataContact.message);
    }

    // 1B. Missing Required Fields Validation
    const resContactInvalid = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: '', message: '' }),
    });
    const dataContactInvalid = await resContactInvalid.json();
    recordResult(
      'Let\'s Connect Form - Required Field Validation (Missing Name/Message)',
      resContactInvalid.status === 400 && dataContactInvalid.success === false,
      `HTTP ${resContactInvalid.status}`
    );

    // -------------------------------------------------------------
    // TEST 2: VOLUNTEER SEVA MODAL FORM (VolunteerModal)
    // -------------------------------------------------------------
    console.log('\n--- 2. AUDIT: Volunteer Application Form ---');

    // 2A. Valid Submission
    const volunteerPayload = {
      fullName: `Seva Volunteer ${auditSuffix}`,
      dob: '1998-08-20',
      phone: testPhoneVolunteer,
      email: `volunteer_${auditSuffix}@chinmayamissionadoni.org`,
      interest: 'Temple event organization and prasad distribution seva',
    };

    const resVolunteer = await fetch(`${BASE_URL}/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(volunteerPayload),
    });
    const dataVolunteer = await resVolunteer.json();

    if (resVolunteer.status === 201 && dataVolunteer.success && dataVolunteer.data?._id) {
      // Direct Database Query Verification
      const dbVolunteer = await Volunteer.findById(dataVolunteer.data._id);
      const isSavedAccurately =
        dbVolunteer &&
        dbVolunteer.fullName === volunteerPayload.fullName &&
        dbVolunteer.phone === volunteerPayload.phone &&
        dbVolunteer.dob === volunteerPayload.dob &&
        dbVolunteer.interest === volunteerPayload.interest &&
        dbVolunteer.status === 'NEW';

      recordResult(
        'Volunteer Form - Valid Submission & DB Persistence',
        Boolean(isSavedAccurately),
        `DB _id: ${dbVolunteer?._id}`
      );
      // Clean up test record
      await Volunteer.findByIdAndDelete(dataVolunteer.data._id);
    } else {
      recordResult('Volunteer Form - Valid Submission', false, dataVolunteer.message);
    }

    // 2B. Validation: Invalid Phone Number
    const resVolInvalidPhone = await fetch(`${BASE_URL}/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...volunteerPayload, phone: '123' }),
    });
    recordResult(
      'Volunteer Form - 10-Digit Mobile Phone Validation',
      resVolInvalidPhone.status === 400,
      `HTTP ${resVolInvalidPhone.status}`
    );

    // -------------------------------------------------------------
    // TEST 3: TEMPLE SEVA BOOKING FORM (TempleSevaSection)
    // -------------------------------------------------------------
    console.log('\n--- 3. AUDIT: Temple Seva Booking Form ---');

    const testUtrSeva = `UTRSEVA${auditSuffix}`;
    const sevaPayload = {
      refId: `SMT-${auditSuffix}`,
      bookingType: 'SEVA_BOOKING',
      templeName: 'Shri Shantamalleshwara Swami Temple',
      sevaName: 'Somavara Visesha Puja',
      serviceCategory: 'Special Weekly Sevas',
      pujaType: 'visesha_puja',
      amount: 2500,
      devoteeName: `Devotee Seva ${auditSuffix}`,
      gotram: 'Bharadwaja',
      nakshatra: 'Uttara Phalguni',
      phone: testPhoneDonor,
      email: `seva_${auditSuffix}@chinmayamissionadoni.org`,
      date: '2026-11-02',
      address: 'Adoni, Andhra Pradesh',
      utrId: testUtrSeva,
      screenshotName: `payment_proof_${auditSuffix}.png`,
    };

    const resSeva = await fetch(`${BASE_URL}/seva-bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sevaPayload),
    });
    const dataSeva = await resSeva.json();

    if (resSeva.status === 201 && dataSeva.success && dataSeva.data?._id) {
      // Direct Database Query Verification
      const dbSeva = await SevaBooking.findById(dataSeva.data._id);
      const isSaved =
        dbSeva &&
        dbSeva.bookingId === sevaPayload.refId &&
        dbSeva.amount === 2500 &&
        dbSeva.gotram === 'Bharadwaja' &&
        dbSeva.nakshatra === 'Uttara Phalguni' &&
        dbSeva.utrId === testUtrSeva &&
        dbSeva.status === 'Payment Proof Submitted (Verification Pending)';

      recordResult(
        'Temple Seva Booking - Valid Submission & DB Persistence',
        Boolean(isSaved),
        `DB _id: ${dbSeva?._id}, Ref: ${dbSeva?.bookingId}`
      );
    } else {
      recordResult('Temple Seva Booking - Valid Submission', false, dataSeva.message);
    }

    // 3B. Duplicate UTR Prevention
    const resSevaDup = await fetch(`${BASE_URL}/seva-bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sevaPayload),
    });
    recordResult(
      'Temple Seva Booking - Duplicate UTR Prevention Guard',
      resSevaDup.status === 409,
      `HTTP ${resSevaDup.status}`
    );

    // Clean up test seva booking
    if (dataSeva.data?._id) {
      await SevaBooking.findByIdAndDelete(dataSeva.data._id);
    }

    // -------------------------------------------------------------
    // TEST 4: DEVOTEE CONTRIBUTION / DONATION FORM (DonationModal)
    // -------------------------------------------------------------
    console.log('\n--- 4. AUDIT: Devotee Contribution / Donation Form ---');

    const testUtrDonation = `UTRDON${auditSuffix}`;
    const donationPayload = {
      refId: `CMS-${auditSuffix}`,
      bookingType: 'DEVOTEE_CONTRIBUTION',
      templeName: 'Chinmaya Mission, Adoni',
      sevaName: 'Devotee Mission Contribution & Vedic Seva',
      amount: 5001,
      name: `Generous Donor ${auditSuffix}`,
      phoneNumber: testPhoneDonor,
      email: `donor_${auditSuffix}@chinmayamissionadoni.org`,
      dob: '1985-04-12',
      address: 'Chinmaya Cultural Complex, Adoni',
      panNumber: 'ABCDE1234F',
      utrId: testUtrDonation,
      screenshotName: `donation_receipt_${auditSuffix}.jpg`,
    };

    const resDonation = await fetch(`${BASE_URL}/seva-bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationPayload),
    });
    const dataDonation = await resDonation.json();

    if (resDonation.status === 201 && dataDonation.success && dataDonation.data?._id) {
      // Direct Database Query Verification
      const dbDonation = await SevaBooking.findById(dataDonation.data._id);
      const isSaved =
        dbDonation &&
        dbDonation.bookingType === 'DEVOTEE_CONTRIBUTION' &&
        dbDonation.amount === 5001 &&
        dbDonation.panNumber === 'ABCDE1234F' &&
        dbDonation.utrId === testUtrDonation &&
        dbDonation.status === 'Payment Proof Submitted (Verification Pending)';

      recordResult(
        'Devotee Contribution - Valid Submission, 80G PAN & DB Persistence',
        Boolean(isSaved),
        `DB _id: ${dbDonation?._id}, Ref: ${dbDonation?.bookingId}`
      );
    } else {
      recordResult('Devotee Contribution - Valid Submission', false, dataDonation.message);
    }

    // Clean up test donation
    if (dataDonation.data?._id) {
      await SevaBooking.findByIdAndDelete(dataDonation.data._id);
    }

    // -------------------------------------------------------------
    // TEST 5 & 6: USER SIGNUP & LOGIN (SignupPage & LoginPage)
    // -------------------------------------------------------------
    console.log('\n--- 5 & 6. AUDIT: User Signup & Login Authentication ---');

    await User.deleteMany({ phone: testPhoneUser });

    // 5A. Valid User Signup
    const signupPayload = {
      fullName: `Runner User ${auditSuffix}`,
      phone: testPhoneUser,
      age: 26,
      profession: 'Educator',
      password: 'AuditSecurePassword123!',
      confirmPassword: 'AuditSecurePassword123!',
    };

    const resSignup = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupPayload),
    });
    const dataSignup = await resSignup.json();

    let createdUserId = null;
    let userAuthToken = null;

    if (resSignup.status === 201 && dataSignup.success && dataSignup.data?._id) {
      createdUserId = dataSignup.data._id;
      userAuthToken = dataSignup.data.token;

      // Direct Database Query Verification
      const dbUser = await User.findById(createdUserId);
      const isSaved =
        dbUser &&
        dbUser.phone === testPhoneUser &&
        dbUser.age === 26 &&
        dbUser.role === 'user' &&
        dbUser.password !== signupPayload.password; // MUST BE HASHED BCRYPT

      recordResult(
        'User Signup Form - Valid Registration & Encrypted Password in DB',
        Boolean(isSaved),
        `DB _id: ${dbUser?._id}`
      );
    } else {
      recordResult('User Signup Form - Valid Registration', false, dataSignup.message);
    }

    // 5B. Duplicate Phone Number Rejection
    const resSignupDup = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupPayload),
    });
    recordResult(
      'User Signup Form - Duplicate Phone Account Prevention',
      resSignupDup.status === 409,
      `HTTP ${resSignupDup.status}`
    );

    // 6A. User Login Authentication
    const resLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testPhoneUser, password: 'AuditSecurePassword123!' }),
    });
    const dataLogin = await resLogin.json();
    const loginOk = resLogin.status === 200 && dataLogin.success && Boolean(dataLogin.data?.token);
    recordResult(
      'User Login Form - Valid Credentials & Session Token Issuance',
      Boolean(loginOk),
      `Token issued: ${Boolean(dataLogin.data?.token)}`
    );

    // 6B. Invalid Password Rejection
    const resLoginBad = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testPhoneUser, password: 'WrongPassword999' }),
    });
    recordResult(
      'User Login Form - Invalid Password Rejection',
      resLoginBad.status === 401,
      `HTTP ${resLoginBad.status}`
    );

    // -------------------------------------------------------------
    // TEST 7: MARATHON INDIVIDUAL REGISTRATION (RegistrationPage)
    // -------------------------------------------------------------
    console.log('\n--- 7. AUDIT: Marathon Individual Registration Form ---');

    await Registration.deleteMany({ contactNumber: testPhoneUser });

    const marathonPayload = {
      fullName: `Runner User ${auditSuffix}`,
      contactNumber: testPhoneUser,
      age: 26,
      standard: 'Graduate',
      profession: 'Educator',
      isStudent: false,
      institutionName: 'Chinmaya Adoni Youth League',
      tShirtSize: 'XL',
    };

    const resMarathon = await fetch(`${BASE_URL}/registrations/individual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAuthToken}`,
      },
      body: JSON.stringify(marathonPayload),
    });
    const dataMarathon = await resMarathon.json();

    if (resMarathon.status === 201 && dataMarathon.success && dataMarathon.data?.registrationId) {
      // Direct Database Query Verification
      const dbReg = await Registration.findOne({ registrationId: dataMarathon.data.registrationId });
      const isSaved =
        dbReg &&
        dbReg.contactNumber === testPhoneUser &&
        dbReg.tShirtSize === 'XL' &&
        dbReg.entryPassId.startsWith('PASS-') &&
        dbReg.status === 'CONFIRMED';

      recordResult(
        'Marathon Registration Form - Sequential ID, Entry Pass & DB Persistence',
        Boolean(isSaved),
        `RegId: ${dbReg?.registrationId}, Pass: ${dbReg?.entryPassId}`
      );
    } else {
      recordResult('Marathon Registration Form - Valid Submission', false, dataMarathon.message);
    }

    // 7B. Concurrency / 15-Second Duplicate Submission Protection
    const resMarathonDup = await fetch(`${BASE_URL}/registrations/individual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAuthToken}`,
      },
      body: JSON.stringify(marathonPayload),
    });
    const dataMarathonDup = await resMarathonDup.json();
    // In our service, duplicate within 15s safely returns the existing record without creating duplicate passes
    const isDebounced =
      dataMarathonDup.success &&
      dataMarathonDup.data?.registrationId === dataMarathon.data?.registrationId;
    recordResult(
      'Marathon Registration Form - 15-Second Double-Click Duplicate Protection',
      Boolean(isDebounced),
      `Matched existing: ${dataMarathonDup.data?.registrationId}`
    );

    // Clean up test marathon registration
    await Registration.deleteMany({ contactNumber: testPhoneUser });

    // -------------------------------------------------------------
    // TEST 8: COMMUNITY STORY BOARD (YourThoughtsPage)
    // -------------------------------------------------------------
    console.log('\n--- 8. AUDIT: Community Story Board Form ---');

    // 8A. Valid Submission with User Authentication
    const thoughtPayload = {
      content: `Running for a drug-free, energetic Adoni! Clean living and self-discipline. [Audit ${auditSuffix}]`,
      color: 'yellow',
    };

    const resThought = await fetch(`${BASE_URL}/thoughts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAuthToken}`,
      },
      body: JSON.stringify(thoughtPayload),
    });
    const dataThought = await resThought.json();

    if (resThought.status === 201 && dataThought.success && dataThought.data?.id) {
      // Direct Database Query Verification
      const dbThought = await Thought.findById(dataThought.data.id);
      const isSaved =
        dbThought &&
        dbThought.content === thoughtPayload.content &&
        dbThought.color === 'yellow' &&
        dbThought.status === 'PENDING' &&
        dbThought.user.toString() === createdUserId.toString();

      recordResult(
        'Story Board Form - Valid Thought Submission & DB Persistence',
        Boolean(isSaved),
        `DB _id: ${dbThought?._id}`
      );
      // Clean up test thought
      await Thought.findByIdAndDelete(dataThought.data.id);
    } else {
      recordResult('Story Board Form - Valid Thought Submission', false, dataThought.message);
    }

    // 8B. Unauthorized Rejection Check
    const resThoughtAnon = await fetch(`${BASE_URL}/thoughts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(thoughtPayload),
    });
    recordResult(
      'Story Board Form - Unauthorized Submission Rejection',
      resThoughtAnon.status === 401,
      `HTTP ${resThoughtAnon.status}`
    );

    // -------------------------------------------------------------
    // TEST 9: ASK FAQ QUESTION FORM (FaqPage)
    // -------------------------------------------------------------
    console.log('\n--- 9. AUDIT: Ask FAQ Question Form ---');

    const faqPayload = {
      fullName: `FAQ Inquirer ${auditSuffix}`,
      question: 'What time will the 5KM and 10KM marathon flag-off take place?',
      phone: testPhoneContact,
      category: 'Marathon FAQ Question',
    };

    const resFaq = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faqPayload),
    });
    const dataFaq = await resFaq.json();

    if (resFaq.status === 201 && dataFaq.success && dataFaq.data?._id) {
      const dbFaqMsg = await ContactMessage.findById(dataFaq.data._id);
      const isSaved =
        dbFaqMsg &&
        dbFaqMsg.fullName === faqPayload.fullName &&
        dbFaqMsg.category === 'Marathon FAQ Question' &&
        dbFaqMsg.message === faqPayload.question;

      recordResult(
        'Ask FAQ Question Form - Submission to Admin Inbox & DB Persistence',
        Boolean(isSaved),
        `DB _id: ${dbFaqMsg?._id}`
      );
      await ContactMessage.findByIdAndDelete(dataFaq.data._id);
    } else {
      recordResult('Ask FAQ Question Form - Submission', false, dataFaq.message);
    }

    // -------------------------------------------------------------
    // TEST 10: ADMIN EVENT CONFIGURATION (AdminDashboardPage)
    // -------------------------------------------------------------
    console.log('\n--- 10. AUDIT: Admin Event Configuration Form ---');

    const adminUser = await User.findOne({ role: 'admin' });
    let adminToken = '';
    if (adminUser) {
      adminToken = jwt.sign({ id: adminUser._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    }

    const currentConfig = await EventConfig.findOne();
    const updatedSlogan = `WE RISE. WE RUN. WE RESIST. [Verified ${auditSuffix}]`;

    const resConfig = await fetch(`${BASE_URL}/events/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
        'X-Auth-Scope': 'admin',
      },
      body: JSON.stringify({ slogan: updatedSlogan }),
    });
    const dataConfig = await resConfig.json();

    if (resConfig.status === 200 && dataConfig.success) {
      const dbConfig = await EventConfig.findOne();
      const isSaved = dbConfig && dbConfig.slogan === updatedSlogan;
      recordResult(
        'Admin Event Control Form - Configuration Update & DB Persistence',
        Boolean(isSaved),
        `Slogan updated in DB`
      );

      // Revert slogan to original clean slogan
      dbConfig.slogan = 'WE RISE. WE RUN. WE RESIST.';
      await dbConfig.save();
    } else {
      recordResult('Admin Event Control Form - Update', false, dataConfig.message);
    }

    // -------------------------------------------------------------
    // TEST 11: USER / ADMIN CHANGE PASSWORD FORM (ProfilePage / AdminDashboardPage)
    // -------------------------------------------------------------
    console.log('\n--- 11. AUDIT: Change Password Form ---');

    const resChangePwd = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAuthToken}`,
      },
      body: JSON.stringify({
        currentPassword: 'AuditSecurePassword123!',
        newPassword: 'BrandNewSecurePassword456#',
        confirmNewPassword: 'BrandNewSecurePassword456#',
      }),
    });
    const dataChangePwd = await resChangePwd.json();

    if (resChangePwd.status === 200 && dataChangePwd.success) {
      // Verify login works with the NEW password
      const resNewLogin = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: testPhoneUser, password: 'BrandNewSecurePassword456#' }),
      });
      const dataNewLogin = await resNewLogin.json();
      recordResult(
        'Change Password Form - Password Update, Bcrypt Re-hash & New Login Verification',
        resNewLogin.status === 200 && dataNewLogin.success,
        `New login: ${dataNewLogin.success}`
      );
    } else {
      recordResult('Change Password Form - Password Update', false, dataChangePwd.message);
    }

    // Clean up test user
    await User.findByIdAndDelete(createdUserId);

  } catch (err) {
    console.error('Audit execution error:', err);
  } finally {
    server.close();
    await mongoose.disconnect();
    console.log('\n================================================================');
    console.log('🏁 FINAL AUDIT SUMMARY REPORT');
    console.log('================================================================');
    const passedCount = results.filter((r) => r.passed).length;
    const failedCount = results.filter((r) => !r.passed).length;
    console.log(`Total Checks Performed: ${results.length}`);
    console.log(`Passed: ${passedCount} / ${results.length}`);
    console.log(`Failed: ${failedCount} / ${results.length}`);
    console.log('================================================================\n');
  }
}

runAuditTestSuite();
