/**
 * Clean Up Test Booking Records from Database
 * Removes all test bookings, vehicles, and customers created during branch testing
 * 
 * Run: node cleanup-test-bookings.cjs
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧹 CLEANING UP TEST BOOKING RECORDS\n');
console.log('='.repeat(80));

async function cleanupTestRecords() {
  // Step 1: Find all test bookings
  console.log('\n📋 Step 1: Finding test bookings...');
  const { data: testBookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, booking_reference, customer_id, vehicle_id, customer_concern')
    .like('booking_reference', 'BK-TEST-%');

  if (bookingsError) {
    console.log(`❌ Error finding test bookings: ${bookingsError.message}`);
    return;
  }

  console.log(`✅ Found ${testBookings.length} test booking(s)`);

  if (testBookings.length === 0) {
    console.log('\n✅ No test bookings found. Database is clean!');
    return;
  }

  // Display test bookings
  console.log('\n📊 Test bookings to be deleted:');
  testBookings.forEach((booking, index) => {
    console.log(`   ${index + 1}. ${booking.booking_reference} - ${booking.customer_concern}`);
  });

  // Step 2: Collect customer and vehicle IDs
  const customerIds = [...new Set(testBookings.map(b => b.customer_id))];
  const vehicleIds = [...new Set(testBookings.map(b => b.vehicle_id))];

  console.log(`\n   Associated customers: ${customerIds.length}`);
  console.log(`   Associated vehicles: ${vehicleIds.length}`);

  // Step 3: Delete test bookings
  console.log('\n🗑️  Step 3: Deleting test bookings...');
  const { error: deleteBookingsError } = await supabase
    .from('bookings')
    .delete()
    .in('id', testBookings.map(b => b.id));

  if (deleteBookingsError) {
    console.log(`❌ Error deleting bookings: ${deleteBookingsError.message}`);
    return;
  }
  console.log(`✅ Deleted ${testBookings.length} test booking(s)`);

  // Step 4: Delete test vehicles
  console.log('\n🗑️  Step 4: Deleting test vehicles...');
  const { error: deleteVehiclesError } = await supabase
    .from('vehicles')
    .delete()
    .in('id', vehicleIds);

  if (deleteVehiclesError) {
    console.log(`❌ Error deleting vehicles: ${deleteVehiclesError.message}`);
    return;
  }
  console.log(`✅ Deleted ${vehicleIds.length} test vehicle(s)`);

  // Step 5: Delete test customers
  console.log('\n🗑️  Step 5: Deleting test customers...');
  const { error: deleteCustomersError } = await supabase
    .from('customers')
    .delete()
    .in('id', customerIds);

  if (deleteCustomersError) {
    console.log(`❌ Error deleting customers: ${deleteCustomersError.message}`);
    return;
  }
  console.log(`✅ Deleted ${customerIds.length} test customer(s)`);

  // Step 6: Verify cleanup
  console.log('\n✅ Step 6: Verifying cleanup...');
  const { count: remainingBookings, error: verifyError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .like('booking_reference', 'BK-TEST-%');

  if (verifyError) {
    console.log(`❌ Error verifying: ${verifyError.message}`);
    return;
  }

  if (remainingBookings === 0) {
    console.log('✅ All test bookings successfully removed');
  } else {
    console.log(`⚠️  Warning: ${remainingBookings} test booking(s) still remain`);
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 CLEANUP SUMMARY');
  console.log('='.repeat(80));
  console.log(`\n   ✅ Deleted: ${testBookings.length} booking(s)`);
  console.log(`   ✅ Deleted: ${vehicleIds.length} vehicle(s)`);
  console.log(`   ✅ Deleted: ${customerIds.length} customer(s)`);
  console.log(`\n   Database is now clean of test records!`);
  console.log('='.repeat(80));
}

cleanupTestRecords().then(() => {
  console.log('\n✅ Cleanup complete');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Cleanup failed:', err.message);
  process.exit(1);
});

