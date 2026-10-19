/**
 * Automated Verification Test Suite: Authentication, Accounts, Profile, & Database Integration
 * Chinmaya Mission Adoni
 * Tests:
 * 1. User Signup (success, missing fields, invalid email, duplicate phone 409, duplicate email 409)
 * 2. User Login & Sessions (valid phone+pwd, invalid pwd, nonexistent user, unauthenticated gate, token persistence)
 * 3. User Profile Management (fetch profile, update profile, reject conflicting duplicate phone/email, persistence)
 * 4. Password Management (wrong current pwd, mismatch confirm pwd, successful change, old pwd invalid, new pwd valid)
 * 5. Seva Booking Association & Authorization (user bookings isolation, activity integration)
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

const timestamp = Date.now().toString().slice(-6);
const testPhoneA = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
const testPhoneB = `97${Math.floor(10000000 + Math.random() * 90000000)}`;
const testEmailA = `devotee_a_${timestamp}@example.com`;
const testEmailB = `devotee_b_${timestamp}@example.com`;
const originalPassword = 'Password@123';
const updatedPassword = 'NewSecretPassword@456';

let tokenA = '';
let userIdA = '';
let tokenB = '';
let userIdB = '';
let testBookingId = '';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🕉️ CHINMAYA MISSION ADONI — AUTH & ACCOUNT TEST SUITE');
  console.log('======================================================\n');

  try {
    // -------------------------------------------------------------------------
    // 1. SIGNUP TESTS
    // -------------------------------------------------------------------------
    console.log('📋 1. TESTING USER SIGNUP');

    // 1.1 Successful Signup for User A
    const signupResA = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Prabodh Devotee A',
        email: testEmailA,
        phone: testPhoneA,
        password: originalPassword,
      }),
    });
    const signupDataA = await signupResA.json();
    assert(signupResA.status === 201, `New user registration status is 201 (got ${signupResA.status})`);
    assert(signupDataA.success === true, 'Signup response indicates success === true');
    assert(signupDataA.token && signupDataA.token.length > 20, 'JWT token returned on signup');
    assert(signupDataA.user && signupDataA.user.phone === testPhoneA, 'Registered user phone matches');
    assert(signupDataA.user && !signupDataA.user.password, 'Password hash is NOT exposed in response');

    tokenA = signupDataA.token || signupDataA.data?.token;
    userIdA = signupDataA.user?._id || signupDataA.data?._id;

    // 1.2 Missing Required Fields
    const missingRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Incomplete Devotee',
        email: 'incomplete@example.com',
        // missing phone and password
      }),
    });
    const missingData = await missingRes.json();
    assert(missingRes.status === 400, `Missing required fields rejected with 400 (got ${missingRes.status})`);
    assert(missingData.success === false, 'Error message returned for missing fields');

    // 1.3 Invalid Email Address
    const invalidEmailRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Invalid Email Devotee',
        email: 'not-an-email',
        phone: `91${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: originalPassword,
      }),
    });
    assert(invalidEmailRes.status === 400, `Invalid email address rejected with 400 (got ${invalidEmailRes.status})`);

    // 1.4 Duplicate Phone Number (Conflict 409)
    const dupPhoneRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Duplicate Phone Devotee',
        email: `unique_${timestamp}@example.com`,
        phone: testPhoneA, // Same phone as user A
        password: originalPassword,
      }),
    });
    assert(dupPhoneRes.status === 409, `Duplicate phone number rejected with 409 (got ${dupPhoneRes.status})`);

    // 1.5 Duplicate Email Address (Conflict 409)
    const dupEmailRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Duplicate Email Devotee',
        email: testEmailA, // Same email as user A
        phone: `99${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: originalPassword,
      }),
    });
    assert(dupEmailRes.status === 409, `Duplicate email address rejected with 409 (got ${dupEmailRes.status})`);

    // 1.6 Register User B for isolation tests
    const signupResB = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Prabodh Devotee B',
        email: testEmailB,
        phone: testPhoneB,
        password: originalPassword,
      }),
    });
    const signupDataB = await signupResB.json();
    tokenB = signupDataB.token || signupDataB.data?.token;
    userIdB = signupDataB.user?._id || signupDataB.data?._id;
    assert(signupResB.status === 201, 'User B registered successfully for isolation verification');

    // -------------------------------------------------------------------------
    // 2. LOGIN & SESSION TESTS
    // -------------------------------------------------------------------------
    console.log('\n📋 2. TESTING LOGIN & SESSION MANAGEMENT');

    // 2.1 Login with valid Phone + Password
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: testPhoneA,
        password: originalPassword,
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, `Login with phone and password returned 200 (got ${loginRes.status})`);
    assert(loginData.token && loginData.token.length > 20, 'Login returned valid JWT session token');
    assert(loginData.user && loginData.user._id === userIdA, 'Login user ID matches registered User A');

    // 2.2 Login with Invalid Password
    const wrongPwdRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: testPhoneA,
        password: 'CompletelyWrongPassword!',
      }),
    });
    assert(wrongPwdRes.status === 401, `Invalid password rejected with 401 (got ${wrongPwdRes.status})`);

    // 2.3 Login with Nonexistent Phone
    const nonExistentRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '9000000000',
        password: originalPassword,
      }),
    });
    assert(nonExistentRes.status === 401, `Nonexistent phone rejected with 401 (got ${nonExistentRes.status})`);

    // 2.4 Unauthenticated Access to Protected API
    const unauthProfileRes = await fetch(`${BASE_URL}/auth/profile`, {
      headers: { 'Content-Type': 'application/json' },
    });
    assert(unauthProfileRes.status === 401, `Unauthenticated request to /profile rejected with 401 (got ${unauthProfileRes.status})`);

    // 2.5 Authenticated Access to Protected API
    const authProfileRes = await fetch(`${BASE_URL}/auth/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
    });
    const profileDataA = await authProfileRes.json();
    assert(authProfileRes.status === 200, `Authenticated request to /profile returns 200 (got ${authProfileRes.status})`);
    assert(profileDataA.user && profileDataA.user.phone === testPhoneA, 'Profile phone matches User A');
    assert(profileDataA.user && profileDataA.user.email === testEmailA, 'Profile email matches User A');

    // -------------------------------------------------------------------------
    // 3. PROFILE EDITING & DATABASE SYNCHRONIZATION
    // -------------------------------------------------------------------------
    console.log('\n📋 3. TESTING PROFILE UPDATES & CONFLICT CHECKS');

    // 3.1 Update User A Profile (Name, Age)
    const updatedName = 'Sri Prabodh Devotee Updated';
    const updateProfileRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        fullName: updatedName,
        phone: testPhoneA,
        email: testEmailA,
        age: 29,
        profession: 'Software Architect & Seva Volunteer',
      }),
    });
    const updateProfileData = await updateProfileRes.json();
    assert(updateProfileRes.status === 200, `Profile update returns 200 (got ${updateProfileRes.status})`);
    assert(updateProfileData.user && updateProfileData.user.fullName === updatedName, 'Updated profile name returned in response');
    assert(updateProfileData.user && updateProfileData.user.age === 29, 'Updated age persisted in profile');

    // 3.2 Verify Persistence via New GET Request
    const verifyProfileRes = await fetch(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const verifyProfileData = await verifyProfileRes.json();
    assert(verifyProfileData.user?.fullName === updatedName, 'Updated profile persists in database on subsequent fetch');

    // 3.3 Reject Attempt to Steal User B's Phone
    const conflictPhoneRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        fullName: updatedName,
        phone: testPhoneB, // Belonging to User B
        email: testEmailA,
      }),
    });
    assert(conflictPhoneRes.status === 409, `Profile update with taken phone rejected with 409 (got ${conflictPhoneRes.status})`);

    // 3.4 Reject Attempt to Steal User B's Email
    const conflictEmailRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        fullName: updatedName,
        phone: testPhoneA,
        email: testEmailB, // Belonging to User B
      }),
    });
    assert(conflictEmailRes.status === 409, `Profile update with taken email rejected with 409 (got ${conflictEmailRes.status})`);

    // -------------------------------------------------------------------------
    // 4. CHANGE PASSWORD TESTS
    // -------------------------------------------------------------------------
    console.log('\n📋 4. TESTING CHANGE PASSWORD FUNCTIONALITY');

    // 4.1 Wrong Current Password
    const wrongOldPwdRes = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        currentPassword: 'WrongOldPassword123',
        newPassword: updatedPassword,
        confirmNewPassword: updatedPassword,
      }),
    });
    assert(wrongOldPwdRes.status === 400 || wrongOldPwdRes.status === 401, `Wrong current password rejected with 400/401 (got ${wrongOldPwdRes.status})`);

    // 4.2 Mismatched Confirmation Password
    const mismatchPwdRes = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        currentPassword: originalPassword,
        newPassword: updatedPassword,
        confirmNewPassword: 'DifferentPassword789',
      }),
    });
    assert(mismatchPwdRes.status === 400, `Mismatched confirmation password rejected with 400 (got ${mismatchPwdRes.status})`);

    // 4.3 Same As Old Password
    const samePwdRes = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        currentPassword: originalPassword,
        newPassword: originalPassword,
        confirmNewPassword: originalPassword,
      }),
    });
    assert(samePwdRes.status === 400, `New password same as old password rejected with 400 (got ${samePwdRes.status})`);

    // 4.4 Successful Password Change
    const changePwdRes = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        currentPassword: originalPassword,
        newPassword: updatedPassword,
        confirmNewPassword: updatedPassword,
      }),
    });
    assert(changePwdRes.status === 200, `Password change succeeded with 200 (got ${changePwdRes.status})`);

    // 4.5 Verify Old Password Fails on Next Login
    const oldLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: testPhoneA,
        password: originalPassword,
      }),
    });
    assert(oldLoginRes.status === 401, `Old password is no longer valid for login (got ${oldLoginRes.status})`);

    // 4.6 Verify New Password Succeeds on Next Login
    const newLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: testPhoneA,
        password: updatedPassword,
      }),
    });
    const newLoginData = await newLoginRes.json();
    assert(newLoginRes.status === 200, `New password authenticates successfully (got ${newLoginRes.status})`);
    assert(newLoginData.token && newLoginData.token.length > 20, 'New session token issued after password change login');
    if (newLoginData.token || newLoginData.data?.token) {
      tokenA = newLoginData.token || newLoginData.data?.token;
    }

    // -------------------------------------------------------------------------
    // 5. SEVA BOOKINGS & USER ACTIVITY TRACKING
    // -------------------------------------------------------------------------
    console.log('\n📋 5. TESTING SEVA BOOKINGS & ACTIVITY HISTORY');

    testBookingId = `TST-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const testUtr = `UTR-${Date.now().toString().slice(-8)}`;

    // 5.1 Submit Seva Booking associated with User A
    const sevaBookingRes = await fetch(`${BASE_URL}/seva-bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        bookingId: testBookingId,
        bookingType: 'SEVA_BOOKING',
        templeName: 'Shri Shantamalleshwara Swami Temple',
        sevaName: 'Pradosha Kala Rudrabhishekam',
        amount: 2501,
        devoteeName: updatedName,
        phone: testPhoneA,
        email: testEmailA,
        gotram: 'Kashyapa',
        nakshatra: 'Rohini',
        utrId: testUtr,
        screenshotName: 'pradosha_receipt.jpg',
        userId: userIdA,
      }),
    });
    const sevaBookingData = await sevaBookingRes.json();
    assert(sevaBookingRes.status === 201, `Seva booking created with 201 (got ${sevaBookingRes.status})`);
    assert(sevaBookingData.data && sevaBookingData.data.bookingId === testBookingId, 'Booking ID matches submitted record');
    assert(sevaBookingData.data && sevaBookingData.data.userId === userIdA, 'Booking is linked to User A ObjectId');

    // 5.2 Retrieve Seva Bookings for User A via /api/users/seva-bookings
    const userSevasRes = await fetch(`${BASE_URL}/users/seva-bookings`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const userSevasData = await userSevasRes.json();
    assert(userSevasRes.status === 200, `User seva bookings route returns 200 (got ${userSevasRes.status})`);
    const foundBooking = (userSevasData.data || []).find((b) => b.bookingId === testBookingId);
    assert(!!foundBooking, 'Submitted seva booking appears in User A booking history');

    // 5.3 Retrieve Activities for User A via /api/users/activities
    const userActivitiesRes = await fetch(`${BASE_URL}/users/activities`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const userActivitiesData = await userActivitiesRes.json();
    assert(userActivitiesRes.status === 200, `User activities endpoint returns 200 (got ${userActivitiesRes.status})`);
    assert(Array.isArray(userActivitiesData.data?.activities), 'User activities returned as array');

    // 5.4 Data Isolation: User B cannot see User A's Seva Bookings
    const userBSevasRes = await fetch(`${BASE_URL}/users/seva-bookings`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const userBSevasData = await userBSevasRes.json();
    const userBFoundA = (userBSevasData.data || []).find((b) => b.bookingId === testBookingId);
    assert(!userBFoundA, 'User B CANNOT see User A private seva bookings (Strict Data Isolation)');

    // -------------------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------------------
    console.log('\n======================================================');
    console.log(`🎉 TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
    console.log('======================================================\n');

    if (passedTests === totalTests) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
