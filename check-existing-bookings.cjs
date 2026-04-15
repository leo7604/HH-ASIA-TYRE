const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBookings() {
  console.log('Checking existing bookings...\n');
  
  const { data, error } = await supabase
    .from('bookings')
    .select('id, booking_reference, status, branch_id, created_at')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log(`Found ${data.length} bookings:\n`);
    data.forEach(b => {
      console.log(`ID: ${b.id} | Ref: ${b.booking_reference} | Status: ${b.status} | Branch: ${b.branch_id} | Created: ${b.created_at}`);
    });
  }
}

checkBookings();
