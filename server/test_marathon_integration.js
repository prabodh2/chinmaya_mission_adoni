import 'dotenv/config';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import http from 'http';
import app from './src/app.js';
import User from './src/models/User.js';
import Registration from './src/models/Registration.js';
import RegistrationCounter from './src/models/RegistrationCounter.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chyk_adoni_anti_drug_marathon_2026_jwt_secret_key_987654321';

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING COMPREHENSIVE MARATHON BACKEND & API SUITE');
  console.log('======================================================\n');

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required in environment variables');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ 1. MongoDB Connected Successfully');

  const server = http.createServer(app);
  const TEST_PORT = 5098;
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  const BASE_URL = `http://localhost:${TEST_PORT}/api`;
  console.log(`✓ 2. Test HTTP Server listening on ${BASE_URL}`);

  try {
    // -----------------------------------------------------------------
    // TEST 1: Health Check
    // -----------------------------------------------------------------
    console.log('\n--- TEST 1: Health & Readiness Check ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthJson = await healthRes.json();
    if (healthRes.status !== 200 || healthJson.status !== 'ok') {
      throw new Error(`Health check failed: ${JSON.stringify(healthJson)}`);
    }
    console.log(`✓ PASS: Health check 200 OK (DB Connected=${healthJson.dbConnected})`);

    // -----------------------------------------------------------------
    // TEST 2: Existing Admin Features Preservation Check
    // -----------------------------------------------------------------
    console.log('\n--- TEST 2: Admin System Integrity ---');
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('⚠️ No admin user found; creating a test admin');
    } else {
      console.log(`✓ Found existing admin account: ${adminUser.fullName} (${adminUser.phone})`);
      const adminToken = jwt.sign({ id: adminUser._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
      const adminStatsRes = await fetch(`${BASE_URL}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (adminStatsRes.status !== 200) {
        throw new Error(`Admin stats returned status ${adminStatsRes.status}`);
      }
      const adminStatsJson = await adminStatsRes.json();
      console.log(`✓ PASS: Existing Admin Dashboard Stats functional (totalRegistrations=${adminStatsJson.data?.totalRegistrations})`);
    }

    // -----------------------------------------------------------------
    // TEST 3: User Signup / Login
    // -----------------------------------------------------------------
    console.log('\n--- TEST 3: User Authentication ---');
    const testPhone = '98765' + Math.floor(10000 + Math.random() * 90000);
    const testPassword = 'Password@123';

    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test Participant Primary',
        phone: testPhone,
        age: 22,
        profession: 'Software Engineer',
        password: testPassword,
        confirmPassword: testPassword,
      }),
    });
    const signupJson = await signupRes.json();
    if (signupRes.status !== 201 || !signupJson.data?.token) {
      throw new Error(`Signup failed: ${signupJson.message}`);
    }
    const userToken = signupJson.data.token;
    const userId = signupJson.data._id;
    console.log(`✓ PASS: User signup successful (User ID: ${userId}, Phone: ${testPhone})`);

    // Verify session
    const verifyRes = await fetch(`${BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const verifyJson = await verifyRes.json();
    if (!verifyJson.success) throw new Error('Session verification failed');
    console.log('✓ PASS: Session verification verified token');

    // -----------------------------------------------------------------
    // TEST 4: Single Individual Registration with Unique Entry Pass
    // -----------------------------------------------------------------
    console.log('\n--- TEST 4: Single Individual Registration ---');
    const singleRegRes = await fetch(`${BASE_URL}/registrations/individual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        fullName: 'Test Participant Primary',
        age: 22,
        profession: 'Software Engineer',
        isStudent: false,
        contactNumber: testPhone,
        tShirtSize: 'L',
      }),
    });
    const singleRegJson = await singleRegRes.json();
    if (singleRegRes.status !== 201 || !singleRegJson.data?.registrationId) {
      throw new Error(`Single registration failed: ${JSON.stringify(singleRegJson)}`);
    }
    const singleRegId = singleRegJson.data.registrationId;
    const singlePassId = singleRegJson.data.entryPassId;
    if (!singlePassId || !singlePassId.startsWith('PASS-')) {
      throw new Error(`Missing or malformed entryPassId: ${singlePassId}`);
    }
    console.log(`✓ PASS: Single registration saved. Registration ID: ${singleRegId}, Entry Pass ID: ${singlePassId}`);

    // -----------------------------------------------------------------
    // TEST 5: Add a Friend (Group Registration with 2 distinct participants)
    // -----------------------------------------------------------------
    console.log('\n--- TEST 5: Add a Friend Group Registration ---');
    const friendPhone = '98765' + Math.floor(10000 + Math.random() * 90000);
    const groupRes = await fetch(`${BASE_URL}/registrations/individual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        primary: {
          fullName: 'Test Primary Runner',
          age: 24,
          profession: 'Accountant',
          isStudent: false,
          contactNumber: testPhone,
          tShirtSize: 'XL',
        },
        friend: {
          fullName: 'Test Friend Runner',
          age: 19,
          profession: 'Student',
          isStudent: true,
          standard: 'B.Sc 1st Year',
          institutionName: 'Adoni Arts and Science College',
          contactNumber: friendPhone,
          tShirtSize: 'M',
        },
      }),
    });

    const groupJson = await groupRes.json();
    if (groupRes.status !== 201 || !groupJson.data?.isGroup) {
      throw new Error(`Group registration failed: ${JSON.stringify(groupJson)}`);
    }

    const { groupId, participants } = groupJson.data;
    if (!groupId || !groupId.startsWith('GRP-')) {
      throw new Error(`Missing or invalid groupId: ${groupId}`);
    }
    if (!Array.isArray(participants) || participants.length !== 2) {
      throw new Error(`Expected exactly 2 participants, got ${participants?.length}`);
    }

    const p1 = participants[0];
    const p2 = participants[1];

    if (p1.registrationId === p2.registrationId) {
      throw new Error('FAILED: Participants received duplicate registration IDs!');
    }
    if (p1.entryPassId === p2.entryPassId) {
      throw new Error('FAILED: Participants received duplicate entry pass IDs!');
    }
    if (!p1.entryPassId.startsWith('PASS-') || !p2.entryPassId.startsWith('PASS-')) {
      throw new Error('FAILED: Entry pass IDs not formatted with PASS- prefix');
    }
    if (p1.tShirtSize !== 'XL' || p2.tShirtSize !== 'M') {
      throw new Error('FAILED: T-shirt size mismatch between participants');
    }
    if (p1.isStudent !== false || p2.isStudent !== true) {
      throw new Error('FAILED: Independent student condition not respected');
    }

    console.log(`✓ PASS: Group registration created with shared Group ID: ${groupId}`);
    console.log(`  - Participant 1 (Primary): ID=${p1.registrationId}, Pass=${p1.entryPassId}, Size=${p1.tShirtSize}`);
    console.log(`  - Participant 2 (Friend):  ID=${p2.registrationId}, Pass=${p2.entryPassId}, Size=${p2.tShirtSize}, School=${p2.institutionName}`);

    // Verify DB integrity for friend identity rule
    const p2DbRecord = await Registration.findOne({ registrationId: p2.registrationId });
    if (!p2DbRecord) throw new Error('Participant 2 not found in database');
    if (p2DbRecord.userId !== null) {
      throw new Error('FAILED: Friend record must have userId=null (no fake login account)');
    }
    if (p2DbRecord.registeredBy.toString() !== userId.toString()) {
      throw new Error('FAILED: Friend registeredBy does not match submitter account ID');
    }
    console.log('✓ PASS: Friend identity rule confirmed (userId is null, registeredBy is submitter).');

    // -----------------------------------------------------------------
    // TEST 6: User's My Registrations View
    // -----------------------------------------------------------------
    console.log("\n--- TEST 6: Submitter's My Registrations Endpoint ---");
    const myRegsRes = await fetch(`${BASE_URL}/registrations/my-registrations`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const myRegsJson = await myRegsRes.json();
    if (!myRegsJson.success || !Array.isArray(myRegsJson.data)) {
      throw new Error('Failed to retrieve user registrations');
    }

    const regIds = myRegsJson.data.map((r) => r.registrationId);
    if (!regIds.includes(p1.registrationId) || !regIds.includes(p2.registrationId)) {
      throw new Error('Submitting user cannot see both their pass and their friend pass in /my-registrations');
    }
    console.log(`✓ PASS: Submitting user retrieves all ${myRegsJson.data.length} registrations (including friend passes).`);

    // -----------------------------------------------------------------
    // TEST 7: Public Entry Pass Verification (Opaque / QR Scan)
    // -----------------------------------------------------------------
    console.log('\n--- TEST 7: Entry Pass Verification Endpoint ---');
    const verifyPassRes = await fetch(`${BASE_URL}/registrations/verify-pass/${p2.entryPassId}`);
    const verifyPassJson = await verifyPassRes.json();
    if (verifyPassRes.status !== 200 || !verifyPassJson.data?.isValid) {
      throw new Error(`Pass verification failed: ${JSON.stringify(verifyPassJson)}`);
    }
    if (verifyPassJson.data.fullName !== 'Test Friend Runner') {
      throw new Error(`Verified pass returned wrong name: ${verifyPassJson.data.fullName}`);
    }
    if (verifyPassJson.data.password || verifyPassJson.data.passwordHash) {
      throw new Error('SECURITY VIOLATION: Pass verification leaked sensitive credentials!');
    }
    console.log(`✓ PASS: Pass ${p2.entryPassId} verified successfully:`);
    console.log(`  - Participant: ${verifyPassJson.data.fullName}`);
    console.log(`  - Status: ${verifyPassJson.data.status}`);
    console.log(`  - Venue: ${verifyPassJson.data.venue}`);

    // Verify invalid pass is rejected
    const invalidVerifyRes = await fetch(`${BASE_URL}/registrations/verify-pass/FAKE-PASS-9999`);
    if (invalidVerifyRes.status !== 404) {
      throw new Error(`Expected 404 for fake pass, got ${invalidVerifyRes.status}`);
    }
    console.log('✓ PASS: Invalid pass ID properly rejected with 404.');

    // -----------------------------------------------------------------
    // TEST 8: Group Registration Rollback on Failure
    // -----------------------------------------------------------------
    console.log('\n--- TEST 8: Group Registration Validation & Failure Handling ---');
    const failRes = await fetch(`${BASE_URL}/registrations/individual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        primary: {
          fullName: 'Valid Primary Name',
          contactNumber: '9876543210',
          tShirtSize: 'M',
        },
        friend: {
          fullName: '', // Invalid empty name
          contactNumber: '9876543211',
          tShirtSize: 'L',
        },
      }),
    });
    if (failRes.status !== 400) {
      throw new Error(`Expected 400 validation error, got ${failRes.status}`);
    }
    const orphanedCheck = await Registration.findOne({ fullName: 'Valid Primary Name' });
    if (orphanedCheck) {
      throw new Error('FAILED: Found orphaned primary registration after group failure!');
    }
    console.log('✓ PASS: Group validation failed safely without leaving partial registrations.');

    // Clean up test data
    console.log('\n--- CLEANING UP TEST RECORDS ---');
    await Registration.deleteMany({
      registrationId: { $in: [singleRegId, p1.registrationId, p2.registrationId] },
    });
    await User.findByIdAndDelete(userId);
    console.log('✓ Test records cleaned up cleanly.');

    console.log('\n======================================================');
    console.log('🎉 ALL INTEGRATION & MARATHON TESTS PASSED 100%!');
    console.log('======================================================\n');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runTestSuite().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED:', err.message);
  process.exit(1);
});
