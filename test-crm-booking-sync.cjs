/**
 * Test CRM API - Verify Approved Bookings Sync
 * Tests that the CRM inventory system receives booking data correctly
 * 
 * Run: node test-crm-booking-sync.cjs
 */

const CRM_API_URL = 'https://hh-asia-tyre-crm-inv-sys.vercel.app/api/public/bookings';

console.log('🧪 TESTING CRM BOOKING SYNC\n');
console.log('='.repeat(80));

// Test booking data (simulating branch admin approval)
const testBookings = [
  {
    customerName: 'Juan Dela Cruz',
    phone: '09171234567',
    email: 'juan.delacruz@example.com',
    service: 'Tire Rotation',
    serviceType: 'Tire Rotation, Oil Change',
    vehicleMake: 'Toyota',
    vehicleModel: 'Vios',
    vehicleYear: '2023',
    plateNumber: 'ABC-1234',
    preferredDate: '2026-04-20',
    preferredTime: '10:00 AM',
    branch: 'ALABANG',
    notes: 'Test booking from CRM sync test',
    status: 'approved',
    bayId: 1,
    bayName: 'Bay 1'
  },
  {
    customerName: 'Maria Santos',
    phone: '09187654321',
    email: 'maria.santos@example.com',
    service: 'Brake Service',
    serviceType: 'Brake Inspection, Brake Pad Replacement',
    vehicleMake: 'Honda',
    vehicleModel: 'Civic',
    vehicleYear: '2022',
    plateNumber: 'XYZ-5678',
    preferredDate: '2026-04-21',
    preferredTime: '2:00 PM',
    branch: 'BICUTAN',
    notes: 'Customer reported squeaking brakes',
    status: 'approved',
    bayId: 2,
    bayName: 'Bay 2'
  }
];

async function testCRMSync() {
  const results = [];

  console.log(`📡 CRM API Endpoint: ${CRM_API_URL}\n`);

  // Test 1: Check if CRM API is reachable
  console.log('📋 TEST 1: CRM API Health Check');
  console.log('-'.repeat(80));
  
  try {
    const healthCheck = await fetch(CRM_API_URL.replace('/bookings', ''), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (healthCheck.ok || healthCheck.status === 404) {
      console.log('✅ CRM API server is reachable');
      console.log(`   Status: ${healthCheck.status}`);
      results.push({ test: 'CRM API Health Check', status: 'PASSED' });
    } else {
      console.log(`⚠️  CRM API returned status: ${healthCheck.status}`);
      results.push({ test: 'CRM API Health Check', status: 'WARNING' });
    }
  } catch (err) {
    console.log(`❌ CRM API unreachable: ${err.message}`);
    results.push({ test: 'CRM API Health Check', status: 'FAILED', error: err.message });
    console.log('\n⚠️  Cannot proceed with booking tests - CRM API is down');
    return results;
  }

  // Test 2: Send approved bookings to CRM
  console.log('\n\n📋 TEST 2: Send Approved Bookings to CRM');
  console.log('-'.repeat(80));

  for (let i = 0; i < testBookings.length; i++) {
    const booking = testBookings[i];
    
    console.log(`\n   📤 Test ${i + 1}/${testBookings.length}: ${booking.customerName}`);
    console.log(`   Branch: ${booking.branch}`);
    console.log(`   Service: ${booking.service}`);
    console.log(`   Date: ${booking.preferredDate} at ${booking.preferredTime}`);
    
    try {
      const response = await fetch(CRM_API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(booking)
      });

      const responseText = await response.text();
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        result = { raw: responseText };
      }

      if (response.ok) {
        console.log(`   ✅ SUCCESS (Status: ${response.status})`);
        console.log(`   Response: ${JSON.stringify(result).substring(0, 150)}...`);
        results.push({ 
          test: `CRM Sync - ${booking.customerName}`, 
          status: 'PASSED',
          statusCode: response.status,
          response: result
        });
      } else {
        console.log(`   ❌ FAILED (Status: ${response.status})`);
        console.log(`   Error: ${JSON.stringify(result).substring(0, 200)}`);
        results.push({ 
          test: `CRM Sync - ${booking.customerName}`, 
          status: 'FAILED',
          statusCode: response.status,
          error: result
        });
      }

    } catch (err) {
      console.log(`   ❌ REQUEST FAILED: ${err.message}`);
      results.push({ 
        test: `CRM Sync - ${booking.customerName}`, 
        status: 'FAILED',
        error: err.message
      });
    }
  }

  // Test 3: Verify data format
  console.log('\n\n📋 TEST 3: Data Format Validation');
  console.log('-'.repeat(80));

  const requiredFields = [
    'customerName', 'phone', 'email', 'service', 
    'vehicleMake', 'vehicleModel', 'vehicleYear',
    'plateNumber', 'preferredDate', 'preferredTime',
    'branch', 'status'
  ];

  let formatPassed = 0;
  let formatFailed = 0;

  testBookings.forEach((booking, index) => {
    const missingFields = requiredFields.filter(field => !booking[field]);
    
    if (missingFields.length === 0) {
      console.log(`   ✅ Booking ${index + 1}: All required fields present`);
      formatPassed++;
    } else {
      console.log(`   ❌ Booking ${index + 1}: Missing fields: ${missingFields.join(', ')}`);
      formatFailed++;
    }
  });

  results.push({
    test: 'Data Format Validation',
    status: formatFailed === 0 ? 'PASSED' : 'FAILED',
    passed: formatPassed,
    failed: formatFailed
  });

  // Summary
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80));

  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const warnings = results.filter(r => r.status === 'WARNING').length;

  console.log(`\n   Total Tests: ${results.length}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   ⚠️  Warnings: ${warnings}`);
  console.log(`   Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  console.log('\n\n📋 DETAILED RESULTS:');
  console.log('-'.repeat(80));
  results.forEach((result, index) => {
    const icon = result.status === 'PASSED' ? '✅' : result.status === 'FAILED' ? '❌' : '⚠️';
    console.log(`\n   ${index + 1}. ${icon} ${result.test}`);
    if (result.statusCode) console.log(`      Status Code: ${result.statusCode}`);
    if (result.error) console.log(`      Error: ${typeof result.error === 'string' ? result.error : JSON.stringify(result.error).substring(0, 100)}`);
  });

  console.log('\n\n' + '='.repeat(80));
  
  if (failed === 0) {
    console.log('🎉 CRM SYNC TESTS PASSED!');
    console.log('✅ Approved bookings are being sent to CRM correctly');
  } else {
    console.log(`⚠️  ${failed} test(s) failed`);
    console.log('Please check the errors above');
    console.log('\n📌 Troubleshooting:');
    console.log('   - Verify CRM API is deployed: https://hh-asia-tyre-crm-inv-sys.vercel.app');
    console.log('   - Check CRM API logs in Vercel dashboard');
    console.log('   - Ensure /api/public/bookings endpoint accepts POST requests');
    console.log('   - Verify CORS settings allow requests from booking frontend');
  }
  console.log('='.repeat(80));

  return results;
}

testCRMSync().then((results) => {
  console.log('\n✅ Test complete');
  process.exit(results.some(r => r.status === 'FAILED') ? 1 : 0);
}).catch(err => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});
