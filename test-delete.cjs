/**
 * Test Supabase DELETE operation
 * Run: node test-delete.js
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials from .env
const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDelete() {
  console.log('🧪 Testing Supabase DELETE operation\n');

  // 1. First, get all bookings
  console.log('Step 1: Fetching all bookings...');
  const { data: bookings, error: fetchError } = await supabase
    .from('bookings')
    .select('id, booking_reference, status, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (fetchError) {
    console.error('❌ Error fetching bookings:', fetchError);
    console.error('Error code:', fetchError.code);
    console.error('Error message:', fetchError.message);
    return;
  }

  console.log(`✅ Found ${bookings?.length || 0} bookings`);
  if (bookings && bookings.length > 0) {
    console.log('\nBookings:');
    bookings.forEach((b, i) => {
      console.log(`  ${i + 1}. ID: ${b.id} (${typeof b.id}) | Ref: ${b.booking_reference} | Status: ${b.status}`);
    });

    // 2. Try to delete the first booking
    const firstBooking = bookings[0];
    console.log(`\nStep 2: Attempting to delete booking ID: ${firstBooking.id} (type: ${typeof firstBooking.id})`);

    const { data: deleteData, error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('id', firstBooking.id)
      .select();

    console.log('Delete result:', { data: deleteData, error: deleteError });

    if (deleteError) {
      console.error('❌ DELETE FAILED');
      console.error('Error code:', deleteError.code);
      console.error('Error message:', deleteError.message);
      console.error('Error details:', deleteError.details);
      console.error('Error hint:', deleteError.hint);
    } else {
      console.log('✅ DELETE SUCCESS');
      console.log('Deleted rows:', deleteData?.length || 0);
    }

    // 3. Check if booking still exists
    console.log('\nStep 3: Verifying deletion...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('bookings')
      .select('id')
      .eq('id', firstBooking.id);

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
    } else if (verifyData && verifyData.length > 0) {
      console.log('❌ Booking still exists in database!');
    } else {
      console.log('✅ Booking successfully deleted from database');
    }
  } else {
    console.log('⚠️ No bookings found to delete');
  }

  // 4. Check RLS policies
  console.log('\nStep 4: Checking RLS policies...');
  const { data: policies, error: policyError } = await supabase
    .from('bookings')
    .select('id');

  console.log('RLS check:', { policies, error: policyError });
  if (policyError) {
    console.error('❌ RLS Policy Error:', policyError.message);
  } else {
    console.log('✅ RLS policies allow SELECT');
  }
}

testDelete().then(() => {
  console.log('\n🏁 Test complete');
  process.exit(0);
}).catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
