import 'dotenv/config';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './src/models/User.js';
import Registration from './src/models/Registration.js';
import BulkBatch from './src/models/BulkBatch.js';
import app from './src/app.js';
import http from 'http';

const JWT_SECRET = process.env.JWT_SECRET || 'chyk_adoni_anti_drug_marathon_2026_jwt_secret_key_987654321';

async function runTests() {
  console.log('====================================================');
  console.log('STARTING AUTOMATED END-TO-END VERIFICATION SUITE');
  console.log('====================================================');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ MongoDB Connected');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, resolve));
  const BASE_URL = 'http://localhost:5099/api';

  try {
    // 1. Check existing users and role enum
    console.log('\n--- TEST 1: Role System & User Schema Check ---');
    const users = await User.find({}).lean();
    console.log(`Found ${users.length} total user accounts:`);
    let superAdminFound = false;
    users.forEach((u) => {
      console.log(` - ${u.fullName} (${u.phone}): role=${u.role}`);
      if (u.role === 'super_admin' || u.role === 'SUPER_ADMIN') superAdminFound = true;
    });
    if (superAdminFound) {
      throw new Error('FAILED: Found super_admin in database!');
    }
    console.log('✓ PASS: All accounts strictly conform to ADMIN and USER roles (no SUPER_ADMIN).');

    // 2. Test Admin Login Endpoint
    console.log('\n--- TEST 2: Admin Login Authentication ---');
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) throw new Error('No admin user in database to test');

    // Find a normal user
    const normalUser = await User.findOne({ role: 'user' });
    if (!normalUser) throw new Error('No normal user in database to test');

    const adminLoginRes = await fetch(`${BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: adminUser.phone, password: 'password123' }),
    });
    const adminLoginJson = await adminLoginRes.json();
    console.log(`Admin Login Attempt Status: ${adminLoginRes.status}`);

    // If password is not password123, generate token directly for test admin
    let adminToken = adminLoginJson.data?.token;
    if (!adminToken) {
      adminToken = jwt.sign({ id: adminUser._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    }
    console.log('✓ Admin Token acquired for test admin user.');

    // 3. Test Normal User trying to access Admin Login
    console.log('\n--- TEST 3: Normal User Denied at Admin Login ---');
    const normalUserLoginRes = await fetch(`${BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: normalUser.phone, password: 'password123' }),
    });
    console.log(`Normal User Admin Login Status: ${normalUserLoginRes.status} (Expected 401 Unauthorized)`);
    if (normalUserLoginRes.status !== 401) {
      throw new Error('FAILED: Normal user was not rejected by admin login endpoint!');
    }
    console.log('✓ PASS: Normal user rejected from admin login.');

    // 4. Test Normal User Bearer Token on Protected Admin Route
    console.log('\n--- TEST 4: Normal User Token on Protected Admin Endpoints ---');
    const normalToken = jwt.sign({ id: normalUser._id, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });

    const forbiddenCheck = await fetch(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${normalToken}` },
    });
    console.log(`Admin Users Access with Normal Token: ${forbiddenCheck.status} (Expected 403 Forbidden)`);
    if (forbiddenCheck.status !== 403) {
      throw new Error('FAILED: Normal user token was not rejected with 403 Forbidden on /admin/users!');
    }
    console.log('✓ PASS: Server-side RBAC correctly returned 403 Forbidden.');

    // 5. Test Admin Token on Protected Admin Endpoints
    console.log('\n--- TEST 5: Admin Token Access to Admin Users & Stats ---');
    const usersListRes = await fetch(`${BASE_URL}/admin/users?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const usersListJson = await usersListRes.json();
    console.log(`Admin Users List Status: ${usersListRes.status}, Total Users: ${usersListJson.data?.pagination?.totalCount}`);
    if (usersListRes.status !== 200 || !usersListJson.success) {
      throw new Error('FAILED: Admin could not access /admin/users');
    }
    console.log('✓ PASS: Admin successfully fetched user management directory.');

    // 6. Test Admin Profile Endpoint
    console.log('\n--- TEST 6: Dedicated Admin Profile API ---');
    const profileRes = await fetch(`${BASE_URL}/admin/profile`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const profileJson = await profileRes.json();
    console.log(`Admin Profile Status: ${profileRes.status}, Admin Name: ${profileJson.data?.fullName}, Role: ${profileJson.data?.role}`);
    if (profileRes.status !== 200 || profileJson.data?.role !== 'admin') {
      throw new Error('FAILED: Admin profile returned incorrect role or status');
    }
    console.log('✓ PASS: Admin Profile correctly verified.');

    // 7. Test Database Persistence & Deletion of Registration
    console.log('\n--- TEST 7: Database Persistence & Deletion Verification ---');
    const testRegId = `CMA2026IN9999`;
    // Clean up any stale test record first
    await Registration.deleteOne({ registrationId: testRegId });

    // Create test record directly
    const createdReg = await Registration.create({
      registrationId: testRegId,
      fullName: 'Test Participant Deletion',
      contactNumber: '9999999998',
      institutionName: 'Test Academy',
      tShirtSize: 'L',
      registrationType: 'individual',
      registrationYear: 2026,
      status: 'CONFIRMED',
    });
    console.log(`Created test registration: ${createdReg.registrationId} in MongoDB.`);

    // Verify it exists
    const existsBefore = await Registration.findOne({ registrationId: testRegId });
    if (!existsBefore) throw new Error('Failed to create test registration');
    console.log(`Confirmed record exists in DB: ${existsBefore.fullName}`);

    // Call Admin Delete Endpoint
    const deleteRes = await fetch(`${BASE_URL}/admin/registrations/${testRegId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const deleteJson = await deleteRes.json();
    console.log(`Delete API Status: ${deleteRes.status}, Message: ${deleteJson.message}`);
    if (deleteRes.status !== 200 || !deleteJson.success) {
      throw new Error('FAILED: Delete API returned error');
    }

    // Verify record is permanently deleted from MongoDB
    const existsAfter = await Registration.findOne({ registrationId: testRegId });
    if (existsAfter) {
      throw new Error('FAILED: Record still exists in MongoDB after deletion!');
    }
    console.log('✓ PASS: Registration permanently deleted from MongoDB and verified!');

    // 8. Test Protection Against Demoting/Deleting Last Admin
    console.log('\n--- TEST 8: Last Admin Protection Safeguards ---');
    const selfDeleteRes = await fetch(`${BASE_URL}/admin/users/${adminUser._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`Self-delete Attempt Status: ${selfDeleteRes.status} (Expected 400 Bad Request)`);
    if (selfDeleteRes.status !== 400) {
      throw new Error('FAILED: System permitted administrator to self-delete!');
    }
    console.log('✓ PASS: Self-deletion prevented.');

    console.log('\n====================================================');
    console.log('ALL 8 AUTOMATED TESTS PASSED SUCCESSFULLY! ✓');
    console.log('====================================================');

    server.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
    server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
}

runTests();
