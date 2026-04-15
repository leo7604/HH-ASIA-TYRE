const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseBookingIssue() {
  console.log('🔍 DIAGNOSING BOOKING CREATION ISSUE\n');
  console.log('='.repeat(60));
  
  // 1. Check existing bookings
  console.log('\n📊 Step 1: Check existing bookings');
  console.log('-'.repeat(60));
  
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, booking_reference, status, created_at')
    .order('created_at', { ascending: false });
  
  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError);
  } else {
    console.log(`Found ${bookings.length} bookings:\n`);
    bookings.forEach(b => {
      console.log(`  ID: ${b.id} | Ref: ${b.booking_reference} | Status: ${b.status}`);
    });
  }
  
  // 2. Check RLS policies
  console.log('\n\n🔐 Step 2: Check RLS policies for bookings table');
  console.log('-'.repeat(60));
  
  const { data: policies, error: policiesError } = await supabase
    .rpc('get_policies_for_table', { table_name: 'bookings' });
  
  if (policiesError) {
    console.log('RPC not available, checking via raw query...');
    
    // Try alternative approach - query pg_policies
    const { data: policyData, error: policyError } = await supabase
      .from('pg_policies')
      .select('tablename, policyname, cmd')
      .eq('schemaname', 'public')
      .eq('tablename', 'bookings');
    
    if (policyError) {
      console.log('⚠️  Cannot query pg_policies directly (expected)');
      console.log('   Please verify policies manually in Supabase Dashboard:');
      console.log('   → Authentication → Policies → bookings table\n');
    } else {
      console.log(`Found ${policyData.length} policies:\n`);
      policyData.forEach(p => {
        console.log(`  • ${p.policyname} (${p.cmd})`);
      });
    }
  } else {
    console.log('Policies:', policies);
  }
  
  // 3. Test INSERT with a guaranteed unique reference
  console.log('\n\n🧪 Step 3: Test INSERT with unique reference');
  console.log('-'.repeat(60));
  
  const uniqueRef = `BK-TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  console.log(`Attempting to insert with reference: ${uniqueRef}\n`);
  
  const { data: testBooking, error: insertError } = await supabase
    .from('bookings')
    .insert([{
      booking_reference: uniqueRef,
      branch_id: 1,
      customer_id: 1, // Use existing customer
      vehicle_id: 1,  // Use existing vehicle
      preferred_date: '2026-05-01',
      preferred_time: '10:00',
      services: ['Test'],
      status: 'pending',
      source: 'diagnostic_test'
    }])
    .select()
    .single();
  
  if (insertError) {
    console.log('❌ INSERT FAILED');
    console.log(`   Error Code: ${insertError.code}`);
    console.log(`   Message: ${insertError.message}`);
    console.log(`   Details: ${JSON.stringify(insertError, null, 2)}`);
    
    if (insertError.code === '23505') {
      console.log('\n💡 This is a UNIQUE CONSTRAINT VIOLATION');
      console.log('   Possible causes:');
      console.log('   1. RLS policies not applied yet');
      console.log('   2. Database trigger modifying the reference');
      console.log('   3. Constraint on different column');
    }
  } else {
    console.log('✅ INSERT SUCCESSFUL');
    console.log(`   Created booking ID: ${testBooking.id}`);
    console.log(`   Reference: ${testBooking.booking_reference}`);
  }
  
  // 4. Check table constraints
  console.log('\n\n📋 Step 4: Verify table structure');
  console.log('-'.repeat(60));
  console.log('Please run this in Supabase SQL Editor to see constraints:');
  console.log('');
  console.log(`SELECT`);
  console.log(`    conname as constraint_name,`);
  console.log(`    contype as constraint_type,`);
  console.log(`    pg_get_constraintdef(oid) as constraint_definition`);
  console.log(`FROM pg_constraint`);
  console.log(`WHERE conrelid = 'bookings'::regclass;`);
  console.log('');
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 RECOMMENDATION:');
  console.log('='.repeat(60));
  console.log('\nIf the RLS policies were not applied yet:');
  console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard');
  console.log('2. Go to SQL Editor');
  console.log('3. Copy content from: database/BOOKINGS_RLS_POLICIES.sql');
  console.log('4. Paste and Run');
  console.log('5. Then run this test again\n');
}

diagnoseBookingIssue();
