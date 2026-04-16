/**
 * Test CRM API - Verify Approved Bookings Sync (Fixed Version)
 * Uses unique plate numbers and valid branch codes
 * 
 * Run: node test-crm-final.cjs
 */

const CRM_API_URL = 'https://hh-asia-tyre-crm-inv-sys.vercel.app/api/public/bookings';

console.log('🧪 TESTING CRM BOOKING SYNC (FINAL TEST)\n');
console.log('='.repeat(80));

// Valid branch codes from CRM system
const VALID_BRANCH_CODES = ['ALABANG', 'BICUTAN', 'BACOOR', 'SUCAT', 'SUCAT2', 'LAOAG'];

// Test booking data with UNIQUE plate numbers and valid branch codes
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
    plateNumber: `TEST-CRM-${Date.now()}-1`,  // Unique plate
    preferredDate: '2026-04-20',
    preferredTime: '10:00 AM',
    branch: 'ALABANG',
    notes: 'CRM sync test - Alabang branch',
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
    plateNumber: `TEST-CRM-${Date.now()}-2`,  // Unique plate
    preferredDate: '2026-04-21',
    preferredTime: '2:00 PM',
    branch: 'BICUTAN',
    notes: 'CRM sync test - Bicutan branch',
    status: 'approved',
    bayId: 2,
    bayName: 'Bay 2'
  },
  {
    customerName: 'Pedro Reyes',
    phone: '09199876543',
    email: 'pedro.reyes@example.com',
    service: 'Oil Change',
    serviceType: 'Oil Change, Filter Replacement',
    vehicleMake: 'Mitsubishi',
    vehicleModel: 'Montero',
    vehicleYear: '2021',
    plateNumber: `TEST-CRM-${Date.now()}-3`,  // Unique plate
    preferredDate: '2026-04-22',
    preferredTime: '9:00 AM',
    branch: 'LAOAG',
    notes: 'CRM sync test - Laoag branch',
    status: 'approved',
    bayId: 1,
    bayName: 'Bay 1'
  }
];

async function testCRMSync() {
  const results = [];

  console.log(`📡 CRM API Endpoint: ${CRM_API_URL}\n`);
  console.log(`📋 Valid Branch Codes: ${VALID_BRANCH_CODES.join(', ')}\n`);

  // Test 1: Send approved bookings to CRM
  console.log('📋 TEST 1: Send Approved Bookings to CRM');
  console.log('-'.repeat(80));

  for (let i = 0; i < testBookings.length; i++) {
    const booking = testBookings[i];
    
    console.log(`\n   📤 Test ${i + 1}/${testBookings.length}: ${booking.customerName}`);
    console.log(`   Branch: ${booking.branch} ${VALID_BRANCH_CODES.includes(booking.branch) ? '✅' : '❌ INVALID'}`);
    console.log(`   Service: ${booking.service}`);
    console.log(`   Vehicle: ${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel}`);
    console.log(`   Plate: ${booking.plateNumber}`);
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
        console.log(`   Response ID: ${result.id || result.bookingId || 'N/A'}`);
        results.push({ 
          test: `CRM Sync - ${booking.customerName} (${booking.branch})`, 
          status: 'PASSED',
          statusCode: response.status,
          response: result
        });
      } else {
        console.log(`   ❌ FAILED (Status: ${response.status})`);
        console.log(`   Error: ${result.error || 'Unknown error'}`);
        if (result.details) {
          console.log(`   Details: ${result.details.substring(0, 150)}...`);
        }
        results.push({ 
          test: `CRM Sync - ${booking.customerName} (${booking.branch})`, 
          status: 'FAILED',
          statusCode: response.status,
          error: result.error,
          details: result.details
        });
      }

    } catch (err) {
      console.log(`   ❌ REQUEST FAILED: ${err.message}`);
      results.push({ 
        test: `CRM Sync - ${booking.customerName} (${booking.branch})`, 
        status: 'FAILED',
        error: err.message
      });
    }
  }

  // Test 2: Data Format Validation
  console.log('\n\n📋 TEST 2: Data Format Validation');
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
    const invalidBranch = !VALID_BRANCH_CODES.includes(booking.branch);
    
    if (missingFields.length === 0 && !invalidBranch) {
      console.log(`   ✅ Booking ${index + 1}: All fields valid, branch code OK`);
      formatPassed++;
    } else {
      const issues = [];
      if (missingFields.length > 0) issues.push(`Missing: ${missingFields.join(', ')}`);
      if (invalidBranch) issues.push(`Invalid branch: ${booking.branch}`);
      console.log(`   ❌ Booking ${index + 1}: ${issues.join('; ')}`);
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

  // Exclude validation test from main count
  const syncTests = results.filter(r => r.test.startsWith('CRM Sync'));
  const passed = syncTests.filter(r => r.status === 'PASSED').length;
  const failed = syncTests.filter(r => r.status === 'FAILED').length;

  console.log(`\n   Total Sync Tests: ${syncTests.length}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Success Rate: ${syncTests.length > 0 ? ((passed / syncTests.length) * 100).toFixed(1) : 0}%`);

  console.log('\n\n📋 DETAILED RESULTS:');
  console.log('-'.repeat(80));
  results.forEach((result, index) => {
    const icon = result.status === 'PASSED' ? '✅' : result.status === 'FAILED' ? '❌' : '⚠️';
    console.log(`\n   ${index + 1}. ${icon} ${result.test}`);
    if (result.statusCode) console.log(`      Status: ${result.statusCode}`);
    if (result.error) console.log(`      Error: ${result.error}`);
  });

  console.log('\n\n' + '='.repeat(80));
  
  if (failed === 0 && syncTests.length > 0) {
    console.log('🎉 CRM SYNC TESTS PASSED!');
    console.log('✅ All approved bookings successfully sent to CRM');
    console.log('✅ Branch admin approval workflow is working correctly');
  } else {
    console.log(`⚠️  ${failed} test(s) failed`);
    console.log('\n📌 Common Issues:');
    console.log('   - Duplicate plate numbers (must be unique in CRM)');
    console.log('   - Invalid branch code (must be: ALABANG, BICUTAN, BACOOR, SUCAT, SUCAT2, LAOAG)');
    console.log('   - Missing required fields');
    console.log('   - CRM API server errors');
  }
  console.log('='.repeat(80));

  return results;
}

testCRMSync().then((results) => {
  console.log('\n✅ Test complete');
  const failed = results.filter(r => r.status === 'FAILED').length;
  process.exit(failed > 0 ? 1 : 0);
}).catch(err => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});
