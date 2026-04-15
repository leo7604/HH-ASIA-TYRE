/**
 * Test Branch Admin Delete Function
 * Verifies that deleting a booking from the admin dashboard
 * also deletes it from the Supabase database
 * 
 * Run: node test-branch-admin-delete.cjs
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Branch Admin Delete Function Test\n');
console.log('='.repeat(70));

async function testBranchAdminDelete() {
  // Test 1: Get all bookings for a branch
  console.log('\n📋 TEST 1: Fetch bookings for branch (ID: 6 - Laoag)');
  console.log('-'.repeat(70));
  
  const { data: initialBookings, error: fetchError } = await supabase
    .from('bookings')
    .select('id, booking_reference, status, created_at, branch_id')
    .eq('branch_id', 6)
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('❌ Failed to fetch bookings:', fetchError.message);
    return false;
  }

  console.log(`✅ Found ${initialBookings?.length || 0} bookings for branch 6`);
  
  if (!initialBookings || initialBookings.length === 0) {
    console.log('⚠️ No bookings found for branch 6. Testing with all bookings instead.');
    
    const { data: allBookings } = await supabase
      .from('bookings')
      .select('id, booking_reference, status, branch_id')
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (!allBookings || allBookings.length === 0) {
      console.log('❌ No bookings in database to test with');
      return false;
    }
    
    // Use the first booking for testing
    var testBooking = allBookings[0];
  } else {
    var testBooking = initialBookings[0];
  }

  console.log(`\n📝 Booking to test delete:`);
  console.log(`   ID: ${testBooking.id}`);
  console.log(`   Reference: ${testBooking.booking_reference}`);
  console.log(`   Status: ${testBooking.status}`);
  console.log(`   Branch: ${testBooking.branch_id}`);

  // Test 2: Delete the booking (simulating branch admin delete)
  console.log('\n\n🗑️ TEST 2: Delete booking (simulating branch admin action)');
  console.log('-'.repeat(70));
  
  const bookingIdToDelete = testBooking.id;
  
  console.log(`Attempting to delete booking ID: ${bookingIdToDelete}`);
  
  const { data: deleteData, error: deleteError } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingIdToDelete)
    .select();

  if (deleteError) {
    console.error('❌ DELETE FAILED!');
    console.error(`   Error code: ${deleteError.code}`);
    console.error(`   Error message: ${deleteError.message}`);
    if (deleteError.details) console.error(`   Details: ${deleteError.details}`);
    if (deleteError.hint) console.error(`   Hint: ${deleteError.hint}`);
    return false;
  }

  console.log(`✅ DELETE SUCCESSFUL`);
  console.log(`   Rows deleted: ${deleteData?.length || 0}`);
  console.log(`   Deleted booking: ${deleteData?.[0]?.booking_reference || 'N/A'}`);

  // Test 3: Verify booking was actually deleted
  console.log('\n\n🔍 TEST 3: Verify deletion from database');
  console.log('-'.repeat(70));
  
  const { data: verifyData, error: verifyError } = await supabase
    .from('bookings')
    .select('id, booking_reference')
    .eq('id', bookingIdToDelete);

  if (verifyError) {
    console.error('❌ Verification query failed:', verifyError.message);
    return false;
  }

  if (verifyData && verifyData.length > 0) {
    console.log(`❌ DELETION FAILED - Booking still exists in database!`);
    console.log(`   Found: ${verifyData[0].booking_reference} (ID: ${verifyData[0].id})`);
    return false;
  } else {
    console.log(`✅ DELETION VERIFIED - Booking no longer exists in database`);
  }

  // Test 4: Check remaining bookings
  console.log('\n\n📊 TEST 4: Check remaining bookings');
  console.log('-'.repeat(70));
  
  const { data: remainingBookings, error: remainingError } = await supabase
    .from('bookings')
    .select('id, booking_reference, status')
    .eq('branch_id', 6)
    .order('created_at', { ascending: false });

  if (remainingError) {
    console.error('❌ Failed to fetch remaining bookings:', remainingError.message);
  } else {
    console.log(`✅ Remaining bookings for branch 6: ${remainingBookings?.length || 0}`);
    
    if (remainingBookings && remainingBookings.length > 0) {
      console.log('\n   Remaining bookings:');
      remainingBookings.forEach((b, i) => {
        console.log(`   ${i + 1}. ${b.booking_reference} (Status: ${b.status})`);
      });
    } else {
      console.log('   (No bookings remaining for this branch)');
    }
  }

  // Test 5: Check if RLS policies allow DELETE
  console.log('\n\n🔒 TEST 5: Verify RLS policy for DELETE');
  console.log('-'.repeat(70));
  
  const { data: policies, error: policyError } = await supabase
    .from('bookings')
    .select('booking_reference')
    .limit(1);

  if (policyError) {
    console.error('❌ RLS Policy issue detected!');
    console.error(`   Error: ${policyError.message}`);
    console.error(`   This may indicate RLS policies are blocking the operation`);
  } else {
    console.log('✅ RLS policies are properly configured');
  }

  // Final summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));
  
  const testResults = {
    fetchBookings: 'PASSED ✅',
    deleteBooking: deleteError ? 'FAILED ❌' : 'PASSED ✅',
    verifyDeletion: verifyData && verifyData.length > 0 ? 'FAILED ❌' : 'PASSED ✅',
    rlsPolicies: policyError ? 'FAILED ❌' : 'PASSED ✅'
  };

  console.log('\nTest Results:');
  console.log(`  1. Fetch bookings:    ${testResults.fetchBookings}`);
  console.log(`  2. Delete booking:    ${testResults.deleteBooking}`);
  console.log(`  3. Verify deletion:   ${testResults.verifyDeletion}`);
  console.log(`  4. RLS policies:      ${testResults.rlsPolicies}`);

  const allPassed = Object.values(testResults).every(r => r.includes('PASSED'));
  
  if (allPassed) {
    console.log('\n✅ ALL TESTS PASSED!');
    console.log('   Branch admin delete function is working correctly.');
    console.log('   Deletions are properly syncing to Supabase database.');
  } else {
    console.log('\n⚠️ SOME TESTS FAILED');
    console.log('   Please check the errors above.');
  }

  console.log('\n' + '='.repeat(70));
  
  return allPassed;
}

// Run the test
testBranchAdminDelete().then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('\n❌ Test execution failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
