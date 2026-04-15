const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing booking creation...\n');
  
  // Get first customer and vehicle
  const { data: customers } = await supabase.from('customers').select('id').limit(1);
  const { data: vehicles } = await supabase.from('vehicles').select('id').limit(1);
  
  if (!customers?.length || !vehicles?.length) {
    console.log('Need at least 1 customer and 1 vehicle in database');
    return;
  }
  
  const uniqueRef = `BK-DIAG-${Date.now()}`;
  console.log('Reference:', uniqueRef);
  
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      booking_reference: uniqueRef,
      branch_id: 1,
      customer_id: customers[0].id,
      vehicle_id: vehicles[0].id,
      preferred_date: '2026-05-01',
      preferred_time: '10:00',
      services: ['Test'],
      status: 'pending'
    }])
    .select()
    .single();
  
  if (error) {
    console.log('\n❌ FAILED');
    console.log('Code:', error.code);
    console.log('Message:', error.message);
    console.log('\nFull error:', JSON.stringify(error, null, 2));
  } else {
    console.log('\n✅ SUCCESS');
    console.log('Booking ID:', data.id);
    console.log('Reference:', data.booking_reference);
  }
}

test();
