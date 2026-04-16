/**
 * Complete Booking Flow Test
 * Tests customer booking creation from start to finish
 * 
 * Run: node test-booking-complete.cjs
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const supabase = createClient(supabaseUrl, supabaseKey);

const CRM_API_URL = 'https://hh-asia-tyre-crm-inv-sys.vercel.app/api/public/bookings';

// Test booking scenario
const testScenario = {
  branch: { id: 1, name: 'Alabang', code: 'ALABANG' },
  customer: {
    full_name: 'Test Customer Complete',
    email: `test.complete.${Date.now()}@example.com`,
    phone: '09179998888'
  },
  vehicle: {
    make: 'Toyota',
    model: 'Fortuner',
    year: 2024,
    plate_number: `TEST-BOOKING-${Date.now()}`
  },
  booking: {
    services: ['Tire Rotation', 'Oil Change'],
    preferred_date: '2026-04-25',
    preferred_time: '10:00 AM',
    customer_concern: 'Regular maintenance service'
  }
};

console.log('🧪 COMPLETE BOOKING FLOW TEST\n');
console.log('='.repeat(80));
console.log('📋 Test Scenario:');
console.log(`   Branch: ${testScenario.branch.name} (ID: ${testScenario.branch.id})`);
console.log(`   Customer: ${testScenario.customer.full_name}`);
console.log(`   Vehicle: ${testScenario.vehicle.year} ${testScenario.vehicle.make} ${testScenario.vehicle.model}`);
console.log(`   Plate: ${testScenario.vehicle.plate_number}`);
console.log(`   Service: ${testScenario.booking.services.join(', ')}`);
console.log(`   Date: ${testScenario.booking.preferred_date} at ${testScenario.booking.preferred_time}`);
console.log('='.repeat(80));

async function testCompleteBookingFlow() {
  const results = [];
  let customerId, vehicleId, bookingId, bookingRef;

  // STEP 1: Create Customer
  console.log('\n📍 STEP 1: Create Customer Record');
  console.log('-'.repeat(80));
  
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .insert([{
        customer_reference: `CUST-TEST-${Date.now()}`,
        ...testScenario.customer,
        total_bookings: 0,
        status: 'ACTIVE'
      }])
      .select()
      .single();

    if (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ step: 'Create Customer', status: 'FAILED', error: error.message });
      return results;
    }

    customerId = customer.id;
    console.log(`   ✅ Customer created successfully`);
    console.log(`   ✅ Customer ID: ${customerId}`);
    console.log(`   ✅ Email: ${customer.email}`);
    results.push({ step: 'Create Customer', status: 'PASSED', data: customer });

  } catch (err) {
    console.log(`   ❌ FAILED: ${err.message}`);
    results.push({ step: 'Create Customer', status: 'FAILED', error: err.message });
    return results;
  }

  // STEP 2: Create Vehicle
  console.log('\n📍 STEP 2: Create Vehicle Record');
  console.log('-'.repeat(80));

  try {
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert([{
        customer_id: customerId,
        ...testScenario.vehicle
      }])
      .select()
      .single();

    if (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ step: 'Create Vehicle', status: 'FAILED', error: error.message });
      return results;
    }

    vehicleId = vehicle.id;
    console.log(`   ✅ Vehicle created successfully`);
    console.log(`   ✅ Vehicle ID: ${vehicleId}`);
    console.log(`   ✅ ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    results.push({ step: 'Create Vehicle', status: 'PASSED', data: vehicle });

  } catch (err) {
    console.log(`   ❌ FAILED: ${err.message}`);
    results.push({ step: 'Create Vehicle', status: 'FAILED', error: err.message });
    return results;
  }

  // STEP 3: Create Booking
  console.log('\n📍 STEP 3: Create Booking Record');
  console.log('-'.repeat(80));

  try {
    bookingRef = `BK-TEST-${Date.now()}`;
    
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([{
        booking_reference: bookingRef,
        customer_id: customerId,
        vehicle_id: vehicleId,
        branch_id: testScenario.branch.id,
        ...testScenario.booking
      }])
      .select()
      .single();

    if (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ step: 'Create Booking', status: 'FAILED', error: error.message });
      return results;
    }

    bookingId = booking.id;
    console.log(`   ✅ Booking created successfully`);
    console.log(`   ✅ Booking ID: ${bookingId}`);
    console.log(`   ✅ Reference: ${booking.booking_reference}`);
    console.log(`   ✅ Status: ${booking.status}`);
    results.push({ step: 'Create Booking', status: 'PASSED', data: booking });

  } catch (err) {
    console.log(`   ❌ FAILED: ${err.message}`);
    results.push({ step: 'Create Booking', status: 'FAILED', error: err.message });
    return results;
  }

  // STEP 4: Verify Booking in Database
  console.log('\n📍 STEP 4: Verify Booking in Database');
  console.log('-'.repeat(80));

  try {
    const { data: verifyBooking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customers:customer_id (full_name, email, phone),
        vehicles:vehicle_id (make, model, year, plate_number)
      `)
      .eq('id', bookingId)
      .single();

    if (error || !verifyBooking) {
      console.log(`   ❌ FAILED: Could not verify booking`);
      results.push({ step: 'Verify Booking', status: 'FAILED', error: 'Verification failed' });
      return results;
    }

    console.log(`   ✅ Booking verified in database`);
    console.log(`   ✅ Customer: ${verifyBooking.customers.full_name}`);
    console.log(`   ✅ Vehicle: ${verifyBooking.vehicles.make} ${verifyBooking.vehicles.model}`);
    console.log(`   ✅ Branch ID: ${verifyBooking.branch_id}`);
    console.log(`   ✅ Services: ${verifyBooking.services.join(', ')}`);
    results.push({ step: 'Verify Booking', status: 'PASSED', data: verifyBooking });

  } catch (err) {
    console.log(`   ❌ FAILED: ${err.message}`);
    results.push({ step: 'Verify Booking', status: 'FAILED', error: err.message });
    return results;
  }

  // STEP 5: Simulate Admin Approval
  console.log('\n📍 STEP 5: Admin Approves Booking with Bay Assignment');
  console.log('-'.repeat(80));

  try {
    const { data: approvedBooking, error } = await supabase
      .from('bookings')
      .update({
        status: 'approved',
        bay_id: 1,
        bay_name: 'Bay 1',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({ step: 'Admin Approval', status: 'FAILED', error: error.message });
      return results;
    }

    console.log(`   ✅ Booking approved successfully`);
    console.log(`   ✅ Status changed to: ${approvedBooking.status}`);
    console.log(`   ✅ Bay assigned: ${approvedBooking.bay_name}`);
    console.log(`   ✅ Confirmed at: ${approvedBooking.confirmed_at}`);
    results.push({ step: 'Admin Approval', status: 'PASSED', data: approvedBooking });

  } catch (err) {
    console.log(`   ❌ FAILED: ${err.message}`);
    results.push({ step: 'Admin Approval', status: 'FAILED', error: err.message });
    return results;
  }

  // STEP 6: Sync to CRM API
  console.log('\n📍 STEP 6: Sync Approved Booking to CRM');
  console.log('-'.repeat(80));

  try {
    const crmPayload = {
      customerName: testScenario.customer.full_name,
      phone: testScenario.customer.phone,
      email: testScenario.customer.email,
      service: testScenario.booking.services[0],
      serviceType: testScenario.booking.services.join(', '),
      vehicleMake: testScenario.vehicle.make,
      vehicleModel: testScenario.vehicle.model,
      vehicleYear: String(testScenario.vehicle.year),
      plateNumber: testScenario.vehicle.plate_number,
      preferredDate: testScenario.booking.preferred_date,
      preferredTime: testScenario.booking.preferred_time,
      branch: testScenario.branch.code,
      notes: testScenario.booking.customer_concern,
      status: 'approved',
      bayId: 1,
      bayName: 'Bay 1'
    };

    console.log(`   📤 Sending to CRM API...`);
    console.log(`   Branch Code: ${crmPayload.branch}`);
    
    const response = await fetch(CRM_API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(crmPayload)
    });

    const responseText = await response.text();
    let crmResult;
    
    try {
      crmResult = JSON.parse(responseText);
    } catch (e) {
      crmResult = { raw: responseText };
    }

    if (response.ok) {
      console.log(`   ✅ CRM sync successful (Status: ${response.status})`);
      console.log(`   ✅ CRM Response: ${JSON.stringify(crmResult).substring(0, 150)}...`);
      results.push({ step: 'CRM Sync', status: 'PASSED', data: crmResult });
    } else {
      console.log(`   ❌ CRM sync failed (Status: ${response.status})`);
      console.log(`   ❌ Error: ${crmResult.error || 'Unknown error'}`);
      if (crmResult.details) {
        console.log(`   ❌ Details: ${crmResult.details.substring(0, 200)}`);
      }
      results.push({ 
        step: 'CRM Sync', 
        status: 'FAILED', 
        statusCode: response.status,
        error: crmResult.error,
        details: crmResult.details 
      });
    }

  } catch (err) {
    console.log(`   ❌ FAILED: ${err.message}`);
    results.push({ step: 'CRM Sync', status: 'FAILED', error: err.message });
  }

  // STEP 7: Cleanup Test Data
  console.log('\n📍 STEP 7: Cleanup Test Data');
  console.log('-'.repeat(80));

  try {
    // Delete booking
    await supabase.from('bookings').delete().eq('id', bookingId);
    console.log(`   ✅ Deleted booking ${bookingRef}`);

    // Delete vehicle
    await supabase.from('vehicles').delete().eq('id', vehicleId);
    console.log(`   ✅ Deleted vehicle`);

    // Delete customer
    await supabase.from('customers').delete().eq('id', customerId);
    console.log(`   ✅ Deleted customer`);

    results.push({ step: 'Cleanup', status: 'PASSED' });

  } catch (err) {
    console.log(`   ⚠️  Cleanup warning: ${err.message}`);
    results.push({ step: 'Cleanup', status: 'WARNING', error: err.message });
  }

  return results;
}

// Run the test
testCompleteBookingFlow().then((results) => {
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80));

  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const warnings = results.filter(r => r.status === 'WARNING').length;

  console.log(`\n   Total Steps: ${results.length}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   ⚠️  Warnings: ${warnings}`);
  console.log(`   Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  console.log('\n\n📋 DETAILED RESULTS:');
  console.log('-'.repeat(80));
  results.forEach((result, index) => {
    const icon = result.status === 'PASSED' ? '✅' : result.status === 'FAILED' ? '❌' : '⚠️';
    console.log(`\n   ${index + 1}. ${icon} ${result.step}`);
    console.log(`      Status: ${result.status}`);
    if (result.error) console.log(`      Error: ${result.error}`);
    if (result.statusCode) console.log(`      HTTP Status: ${result.statusCode}`);
  });

  console.log('\n\n' + '='.repeat(80));
  
  if (failed === 0) {
    console.log('🎉 BOOKING FLOW TEST PASSED!');
    console.log('✅ Complete booking workflow is functioning correctly');
  } else {
    console.log(`⚠️  ${failed} step(s) failed`);
    console.log('Please review the errors above');
  }
  console.log('='.repeat(80));

  process.exit(failed > 0 ? 1 : 0);
}).catch(err => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});
