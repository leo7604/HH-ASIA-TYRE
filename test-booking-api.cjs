/**
 * Direct Supabase Booking API Test
 * Tests booking creation, retrieval, and status updates
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBookingAPI() {
  console.log('🚀 DIRECT SUPABASE BOOKING API TEST\n');
  console.log('='.repeat(50));
  
  let passed = 0;
  let failed = 0;
  const results = [];
  
  try {
    const timestamp = Date.now();
    
    // ========== TEST 1: Create Customer ==========
    console.log('\n👤 TEST 1: Create Customer');
    console.log('-'.repeat(30));
    
    const customerEmail = `api.test.${timestamp}@example.com`;
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert([{
        email: customerEmail,
        full_name: 'API Test Customer',
        phone: '09171234567'
      }])
      .select()
      .single();
    
    if (customerError) {
      console.log('❌ Create Customer - FAILED:', customerError.message);
      results.push({ test: 'Create Customer', status: 'FAILED' });
      failed++;
    } else {
      console.log('✅ Create Customer - PASSED');
      console.log(`  Customer ID: ${customer.id}`);
      console.log(`  Email: ${customer.email}`);
      results.push({ test: 'Create Customer', status: 'PASSED' });
      passed++;
    }
    
    // ========== TEST 2: Create Vehicle ==========
    console.log('\n🚗 TEST 2: Create Vehicle');
    console.log('-'.repeat(30));
    
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .insert([{
        customer_id: customer?.id,
        plate_number: `API-${timestamp}`,
        year: '2024',
        make: 'Toyota',
        model: 'Vios',
        trim: 'GLX',
        is_active: true
      }])
      .select()
      .single();
    
    if (vehicleError) {
      console.log('❌ Create Vehicle - FAILED:', vehicleError.message);
      results.push({ test: 'Create Vehicle', status: 'FAILED' });
      failed++;
    } else {
      console.log('✅ Create Vehicle - PASSED');
      console.log(`  Vehicle ID: ${vehicle.id}`);
      console.log(`  ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
      results.push({ test: 'Create Vehicle', status: 'PASSED' });
      passed++;
    }
    
    // ========== TEST 3: Create Booking ==========
    console.log('\n📋 TEST 3: Create Booking');
    console.log('-'.repeat(30));
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    const bookingDate = futureDate.toISOString().split('T')[0];
    
    // 3. Generate booking reference (database no longer auto-generates)
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const bookingReference = `BK-${dateStr}-${randomSuffix}`;
    
    console.log(`  Generated reference: ${bookingReference}`);
    
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        booking_reference: bookingReference,
        branch_id: 1, // Alabang
        customer_id: customer?.id,
        vehicle_id: vehicle?.id,
        preferred_date: bookingDate,
        preferred_time: '10:00',
        services: ['Tire Rotation', 'Oil Change'],
        customer_concern: 'Regular maintenance',
        status: 'pending',
        source: 'api_test'
      }])
      .select()
      .single();
    
    if (bookingError) {
      console.log('❌ Create Booking - FAILED:', bookingError.message);
      console.log('  Error details:', JSON.stringify(bookingError));
      results.push({ test: 'Create Booking', status: 'FAILED' });
      failed++;
    } else {
      console.log('✅ Create Booking - PASSED');
      console.log(`  Booking ID: ${booking.id}`);
      console.log(`  Confirmation: HH${booking.id}`);
      console.log(`  Status: ${booking.status}`);
      console.log(`  Date: ${booking.preferred_date}`);
      results.push({ test: 'Create Booking', status: 'PASSED' });
      passed++;
    }
    
    // ========== TEST 4: Retrieve Booking ==========
    console.log('\n🔍 TEST 4: Retrieve Booking');
    console.log('-'.repeat(30));
    
    const { data: retrievedBooking, error: retrieveError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking?.id)
      .single();
    
    if (retrieveError || !retrievedBooking) {
      console.log('❌ Retrieve Booking - FAILED:', retrieveError?.message);
      results.push({ test: 'Retrieve Booking', status: 'FAILED' });
      failed++;
    } else {
      console.log('✅ Retrieve Booking - PASSED');
      console.log(`  Found booking: HH${retrievedBooking.id}`);
      console.log(`  Customer: ${retrievedBooking.full_name}`);
      results.push({ test: 'Retrieve Booking', status: 'PASSED' });
      passed++;
    }
    
    // ========== TEST 5: Update Booking Status (Approve) ==========
    console.log('\n✅ TEST 5: Approve Booking');
    console.log('-'.repeat(30));
    
    const { data: approvedBooking, error: approveError } = await supabase
      .from('bookings')
      .update({
        status: 'approved',
        bay_id: 1,
        bay_name: 'Bay 1'
      })
      .eq('id', booking?.id)
      .select()
      .single();
    
    if (approveError) {
      console.log('❌ Approve Booking - FAILED:', approveError.message);
      results.push({ test: 'Approve Booking', status: 'FAILED' });
      failed++;
    } else {
      console.log('✅ Approve Booking - PASSED');
      console.log(`  Status: ${approvedBooking.status}`);
      console.log(`  Bay: ${approvedBooking.bay_name}`);
      results.push({ test: 'Approve Booking', status: 'PASSED' });
      passed++;
    }
    
    // ========== TEST 6: Complete Booking ==========
    console.log('\n🏁 TEST 6: Complete Booking');
    console.log('-'.repeat(30));
    
    const { data: completedBooking, error: completeError } = await supabase
      .from('bookings')
      .update({
        status: 'completed'
      })
      .eq('id', booking?.id)
      .select()
      .single();
    
    if (completeError) {
      console.log('❌ Complete Booking - FAILED:', completeError.message);
      results.push({ test: 'Complete Booking', status: 'FAILED' });
      failed++;
    } else {
      console.log('✅ Complete Booking - PASSED');
      console.log(`  Status: ${completedBooking.status}`);
      results.push({ test: 'Complete Booking', status: 'PASSED' });
      passed++;
    }
    
    // ========== TEST 7: Get Branch Bookings ==========
    console.log('\n📊 TEST 7: Get Branch Bookings');
    console.log('-'.repeat(30));
    
    const { data: branchBookings, error: branchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('branch_id', 1)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (branchError) {
      console.log('❌ Get Branch Bookings - FAILED:', branchError.message);
      results.push({ test: 'Get Branch Bookings', status: 'FAILED' });
      failed++;
    } else {
      console.log('✅ Get Branch Bookings - PASSED');
      console.log(`  Found ${branchBookings.length} bookings for branch 1`);
      if (branchBookings.length > 0) {
        console.log(`  Latest: HH${branchBookings[0].id} - ${branchBookings[0].status}`);
      }
      results.push({ test: 'Get Branch Bookings', status: 'PASSED' });
      passed++;
    }
    
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    results.push({ test: 'Test Execution', status: 'ERROR: ' + error.message });
    failed++;
  }
  
  // ========== SUMMARY ==========
  console.log('\n');
  console.log('='.repeat(50));
  console.log('📊 SUPABASE BOOKING API TEST RESULTS');
  console.log('='.repeat(50));
  
  results.forEach(r => {
    const icon = r.status.includes('PASSED') ? '✅' : '❌';
    console.log(`${icon} ${r.test}: ${r.status}`);
  });
  
  console.log('\n' + '-'.repeat(50));
  console.log(`Total: ${passed} passed, ${failed} failed`);
  console.log('-'.repeat(50));
  
  const successRate = Math.round((passed / (passed + failed)) * 100);
  console.log(`Success Rate: ${successRate}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Supabase booking API is fully functional.');
  } else {
    console.log('\n⚠️ Some tests failed. Review the results above.');
  }
  
  return failed === 0;
}

testBookingAPI().then(success => {
  process.exit(success ? 0 : 1);
});
