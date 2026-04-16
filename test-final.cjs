/**
 * Test Booking Flow for All 6 Branches
 * Verifies that customers can book appointments at each branch
 * 
 * Run: node test-all-branch-bookings.cjs
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const supabase = createClient(supabaseUrl, supabaseKey);

// Branch data
const branches = [
  { id: 1, name: 'Goodyear High Performance Center', area: 'Alabang', city: 'Metro Manila' },
  { id: 2, name: 'Goodyear Autocare Bicutan', area: 'Bicutan', city: 'Metro Manila' },
  { id: 3, name: 'Goodyear Autocare Bacoor', area: 'Bacoor', city: 'Cavite' },
  { id: 4, name: 'Goodyear Autocare Sucat', area: 'Sucat', city: 'Metro Manila' },
  { id: 5, name: 'Tire Asia - GT Radial Sucat', area: 'Sucat', city: 'Metro Manila' },
  { id: 6, name: 'Goodyear Servitek - HH Astro Sales', area: 'Laoag City', city: 'Ilocos Norte' }
];

console.log('🧪 TESTING BOOKING FLOW FOR ALL 6 BRANCHES\n');
console.log('='.repeat(80));

async function testBranchBooking(branch, index) {
  const timestamp = Date.now();
  
  console.log(`\n📍 TEST ${index + 1}/6: ${branch.name}`);
  console.log('-'.repeat(80));
  console.log(`   Branch ID: ${branch.id}`);
  console.log(`   Location: ${branch.area}, ${branch.city}`);
  
  try {
    // Step 1: Create customer with unique email/phone
    console.log('\n   Step 1: Creating customer...');
    const uniqueEmail = `test.${branch.area.toLowerCase().replace(/\s/g, '')}.${timestamp}@example.com`;
    const uniquePhone = `0917${String(1000000 + (index * 1000)).slice(1)}`;
    
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert([{ booking_reference: ``BK-TEST-${branch.id}-${timestamp}``, 
        customer_reference: `CUST-TEST-${timestamp}-${branch.id}`,
        full_name: `Test Customer ${branch.area}`,
        email: uniqueEmail,
        phone: uniquePhone,
        total_bookings: 0,
        status: 'ACTIVE'
      }])
      .select()
      .single();

    if (customerError) {
      console.log(`   ❌ FAILED: ${customerError.message}`);
      return { branch: branch.name, status: 'FAILED', error: customerError.message };
    }
    console.log(`   ✅ Customer created: ${customer.full_name} (ID: ${customer.id})`);
    console.log(`   ✅ Email: ${customer.email}`);

    // Step 2: Create vehicle
    console.log('\n   Step 2: Creating vehicle...');
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .insert([{ booking_reference: ``BK-TEST-${branch.id}-${timestamp}``, 
        customer_id: customer.id,
        make: 'Toyota',
        model: 'Vios',
        year: 2024,
        plate_number: `TEST-${branch.id}-${timestamp.toString().slice(-4)}`
      }])
      .select()
      .single();

    if (vehicleError) {
      console.log(`   ❌ FAILED: ${vehicleError.message}`);
      return { branch: branch.name, status: 'FAILED', error: vehicleError.message };
    }
    console.log(`   ✅ Vehicle created: ${vehicle.year} ${vehicle.make} ${vehicle.model} (ID: ${vehicle.id})`);

    // Step 3: Create booking (NO mileage field - doesn't exist in DB)
    console.log('\n   Step 3: Creating booking...');
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{ booking_reference: ``BK-TEST-${branch.id}-${timestamp}``, 
        customer_id: customer.id,
        vehicle_id: vehicle.id,
        branch_id: branch.id,
        services: ['Tire Rotation', 'Oil Change'],
        preferred_date: '2026-04-20',
        preferred_time: '10:00 AM',
        customer_concern: `Test booking for ${branch.name} branch`
      }])
      .select()
      .single();

    if (bookingError) {
      console.log(`   ❌ FAILED: ${bookingError.message}`);
      return { branch: branch.name, status: 'FAILED', error: bookingError.message };
    }
    console.log(`   ✅ Booking created: ${booking.booking_reference} (ID: ${booking.id})`);
    console.log(`   ✅ Status: ${booking.status}`);
    console.log(`   ✅ Date: ${booking.preferred_date} at ${booking.preferred_time}`);

    // Step 4: Verify booking in database
    console.log('\n   Step 4: Verifying booking...');
    const { data: verifyBooking, error: verifyError } = await supabase
      .from('bookings')
      .select(`
        *,
        customers:customer_id (full_name, email),
        vehicles:vehicle_id (make, model, plate_number)
      `)
      .eq('id', booking.id)
      .single();

    if (verifyError || !verifyBooking) {
      console.log(`   ❌ FAILED: Could not verify booking`);
      return { branch: branch.name, status: 'FAILED', error: 'Verification failed' };
    }

    console.log(`   ✅ Booking verified in database`);
    console.log(`   ✅ Customer: ${verifyBooking.customers.full_name}`);
    console.log(`   ✅ Vehicle: ${verifyBooking.vehicles.make} ${verifyBooking.vehicles.model}`);
    console.log(`   ✅ Branch ID: ${verifyBooking.branch_id} (Expected: ${branch.id})`);

    if (verifyBooking.branch_id !== branch.id) {
      console.log(`   ❌ FAILED: Branch ID mismatch!`);
      return { branch: branch.name, status: 'FAILED', error: 'Branch ID mismatch' };
    }

    console.log(`\n   🎉 ${branch.name.toUpperCase()} - ALL TESTS PASSED!`);
    return { branch: branch.name, status: 'PASSED', bookingRef: booking.booking_reference };

  } catch (err) {
    console.log(`   ❌ FAILED: ${err.message}`);
    return { branch: branch.name, status: 'FAILED', error: err.message };
  }
}

async function runAllTests() {
  const results = [];

  // Test each branch
  for (let i = 0; i < branches.length; i++) {
    const result = await testBranchBooking(branches[i], i);
    results.push(result);
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80));

  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;

  console.log(`\n   Total Tests: ${results.length}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  console.log('\n\n📋 DETAILED RESULTS:');
  console.log('-'.repeat(80));
  results.forEach((result, index) => {
    const icon = result.status === 'PASSED' ? '✅' : '❌';
    console.log(`\n   ${index + 1}. ${icon} ${result.branch}`);
    if (result.status === 'PASSED') {
      console.log(`      Booking Ref: ${result.bookingRef}`);
    } else {
      console.log(`      Error: ${result.error}`);
    }
  });

  console.log('\n\n' + '='.repeat(80));
  
  if (passed === results.length) {
    console.log('🎉 ALL BRANCH BOOKING TESTS PASSED!');
    console.log('✅ All 6 branches are ready for customer bookings');
  } else {
    console.log(`⚠️  ${failed} branch(es) failed testing`);
    console.log('Please check the errors above');
  }
  console.log('='.repeat(80));
}

runAllTests().then(() => {
  console.log('\n✅ Test complete');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});
