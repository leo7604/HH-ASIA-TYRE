/**
 * Test Supabase integration using actual application functions
 */

// Import supabase functions
const { createBooking, getBranchBookings, updateBookingStatus } = require('./src/utils/supabase.js');

async function testSupabaseIntegration() {
  console.log('🚀 SUPABASE INTEGRATION TEST (Using App Functions)\n');
  console.log('='.repeat(50));
  
  let passed = 0;
  let failed = 0;
  const results = [];
  
  try {
    // ========== TEST 1: Create Booking via App Function ==========
    console.log('\n📋 TEST 1: Create Booking via createBooking()');
    console.log('-'.repeat(30));
    
    const timestamp = Date.now();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    const bookingDate = futureDate.toISOString().split('T')[0];
    
    const bookingData = {
      full_name: 'Integration Test Customer',
      email: `integration.test.${timestamp}@example.com`,
      phone: '09171234567',
      branch_id: 1, // Alabang
      vehicle_year: '2024',
      vehicle_make: 'Honda',
      vehicle_model: 'Civic',
      vehicle_trim: 'VTEC',
      plate_number: `INT-${timestamp}`,
      preferred_date: bookingDate,
      preferred_time: '14:00',
      services: ['Tire Rotation', 'Oil Change'],
      customer_concern: 'Regular maintenance checkup',
      source: 'integration_test'
    };
    
    const createResult = await createBooking(bookingData);
    
    if (createResult.success && createResult.data) {
      console.log('✅ Create Booking - PASSED');
      console.log(`  Booking ID: ${createResult.data.id}`);
      console.log(`  Reference: ${createResult.data.booking_reference}`);
      console.log(`  Status: ${createResult.data.status}`);
      results.push({ test: 'Create Booking (App Function)', status: 'PASSED' });
      passed++;
      
      // Store booking ID for next tests
      global.testBookingId = createResult.data.id;
      global.testBookingRef = createResult.data.booking_reference;
    } else {
      console.log('❌ Create Booking - FAILED:', createResult.error?.message);
      results.push({ test: 'Create Booking (App Function)', status: 'FAILED' });
      failed++;
    }
    
    // ========== TEST 2: Get Branch Bookings ==========
    console.log('\n📊 TEST 2: Get Branch Bookings');
    console.log('-'.repeat(30));
    
    const branchResult = await getBranchBookings(1);
    
    if (branchResult.success && branchResult.data.length > 0) {
      console.log('✅ Get Branch Bookings - PASSED');
      console.log(`  Found ${branchResult.data.length} bookings`);
      console.log(`  Latest: ${branchResult.data[0].booking_reference}`);
      results.push({ test: 'Get Branch Bookings', status: 'PASSED' });
      passed++;
    } else {
      console.log('❌ Get Branch Bookings - FAILED');
      results.push({ test: 'Get Branch Bookings', status: 'FAILED' });
      failed++;
    }
    
    // ========== TEST 3: Update Booking Status (Approve) ==========
    console.log('\n✅ TEST 3: Approve Booking');
    console.log('-'.repeat(30));
    
    if (global.testBookingId) {
      const approveResult = await updateBookingStatus(global.testBookingId, {
        status: 'approved',
        bay_id: 1,
        bay_name: 'Bay 1'
      });
      
      if (approveResult.success) {
        console.log('✅ Approve Booking - PASSED');
        console.log(`  Booking ${global.testBookingRef} approved`);
        results.push({ test: 'Approve Booking', status: 'PASSED' });
        passed++;
      } else {
        console.log('❌ Approve Booking - FAILED:', approveResult.error?.message);
        results.push({ test: 'Approve Booking', status: 'FAILED' });
        failed++;
      }
    } else {
      console.log('⏭️ Approve Booking - SKIPPED (no booking)');
      results.push({ test: 'Approve Booking', status: 'SKIPPED' });
    }
    
    // ========== TEST 4: Complete Booking ==========
    console.log('\n🏁 TEST 4: Complete Booking');
    console.log('-'.repeat(30));
    
    if (global.testBookingId) {
      const completeResult = await updateBookingStatus(global.testBookingId, {
        status: 'completed'
      });
      
      if (completeResult.success) {
        console.log('✅ Complete Booking - PASSED');
        console.log(`  Booking ${global.testBookingRef} completed`);
        results.push({ test: 'Complete Booking', status: 'PASSED' });
        passed++;
      } else {
        console.log('❌ Complete Booking - FAILED:', completeResult.error?.message);
        results.push({ test: 'Complete Booking', status: 'FAILED' });
        failed++;
      }
    } else {
      console.log('⏭️ Complete Booking - SKIPPED (no booking)');
      results.push({ test: 'Complete Booking', status: 'SKIPPED' });
    }
    
    // ========== TEST 5: Verify Final Status ==========
    console.log('\n🔍 TEST 5: Verify Final Booking Status');
    console.log('-'.repeat(30));
    
    if (global.testBookingId) {
      const verifyResult = await getBranchBookings(1);
      const booking = verifyResult.data.find(b => b.id === global.testBookingId);
      
      if (booking && booking.status === 'completed') {
        console.log('✅ Verify Final Status - PASSED');
        console.log(`  Booking ${global.testBookingRef} status: ${booking.status}`);
        results.push({ test: 'Verify Final Status', status: 'PASSED' });
        passed++;
      } else {
        console.log('❌ Verify Final Status - FAILED');
        console.log(`  Expected: completed, Got: ${booking?.status || 'not found'}`);
        results.push({ test: 'Verify Final Status', status: 'FAILED' });
        failed++;
      }
    } else {
      console.log('⏭️ Verify Final Status - SKIPPED (no booking)');
      results.push({ test: 'Verify Final Status', status: 'SKIPPED' });
    }
    
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    console.error('Stack:', error.stack);
    results.push({ test: 'Test Execution', status: 'ERROR: ' + error.message });
    failed++;
  }
  
  // ========== SUMMARY ==========
  console.log('\n');
  console.log('='.repeat(50));
  console.log('📊 SUPABASE INTEGRATION TEST RESULTS');
  console.log('='.repeat(50));
  
  results.forEach(r => {
    const icon = r.status.includes('PASSED') ? '✅' : r.status.includes('SKIPPED') ? '⏭️' : '❌';
    console.log(`${icon} ${r.test}: ${r.status}`);
  });
  
  console.log('\n' + '-'.repeat(50));
  console.log(`Total: ${passed} passed, ${failed} failed`);
  console.log('-'.repeat(50));
  
  const successRate = passed + failed > 0 ? Math.round((passed / (passed + failed)) * 100) : 0;
  console.log(`Success Rate: ${successRate}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Supabase integration is fully functional.');
  } else {
    console.log('\n⚠️ Some tests failed. Review the results above.');
  }
  
  return failed === 0;
}

testSupabaseIntegration().then(success => {
  process.exit(success ? 0 : 1);
});
