/**
 * Test using the actual application's createBooking function
 * This mimics exactly what the UI does
 */

// We need to use dynamic import for ES modules
async function runTest() {
  try {
    // Import the supabase module dynamically
    const supabaseModule = await import('./src/utils/supabase.js');
    const { createBooking } = supabaseModule;
    
    console.log('🧪 Testing createBooking() from application\n');
    console.log('='.repeat(60));
    
    const timestamp = Date.now();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    const bookingDate = futureDate.toISOString().split('T')[0];
    
    const bookingData = {
      full_name: 'Trigger Test Customer',
      email: `trigger.test.${timestamp}@example.com`,
      phone: '09171234567',
      branch_id: 1,
      vehicle_year: '2024',
      vehicle_make: 'Honda',
      vehicle_model: 'Civic',
      plate_number: `TRIG-${timestamp}`,
      preferred_date: bookingDate,
      preferred_time: '14:00',
      services: ['Oil Change'],
      customer_concern: 'Testing trigger behavior',
      source: 'trigger_test'
    };
    
    console.log('Creating booking...');
    const result = await createBooking(bookingData);
    
    if (result.success && result.data) {
      console.log('\n✅ BOOKING CREATED SUCCESSFULLY');
      console.log(`  ID: ${result.data.id}`);
      console.log(`  Reference: ${result.data.booking_reference}`);
      console.log(`  Status: ${result.data.status}`);
      console.log(`  Branch: ${result.data.branch_id}`);
    } else {
      console.log('\n❌ BOOKING CREATION FAILED');
      console.log(`  Error: ${JSON.stringify(result.error, null, 2)}`);
    }
    
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

runTest();
