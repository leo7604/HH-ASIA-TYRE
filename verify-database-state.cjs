/**
 * Verify Current Database State
 * Check all bookings and customers in Supabase
 * 
 * Run: node verify-database-state.cjs
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Verifying Supabase Database State\n');
console.log('='.repeat(70));

async function verifyDatabase() {
  // Check Bookings
  console.log('\n📋 CURRENT BOOKINGS IN DATABASE');
  console.log('-'.repeat(70));
  
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, booking_reference, status, branch_id, created_at')
    .order('created_at', { ascending: false });

  if (bookingsError) {
    console.error('❌ Error fetching bookings:', bookingsError.message);
  } else {
    console.log(`✅ Total bookings: ${bookings?.length || 0}\n`);
    
    if (bookings && bookings.length > 0) {
      console.log('Booking List:');
      bookings.forEach((b, i) => {
        console.log(`  ${i + 1}. ID: ${b.id} | Ref: ${b.booking_reference} | Status: ${b.status} | Branch: ${b.branch_id}`);
      });
    } else {
      console.log('   (No bookings found)');
    }
  }

  // Check Customers
  console.log('\n\n👥 CURRENT CUSTOMERS IN DATABASE');
  console.log('-'.repeat(70));
  
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('id, full_name, email, phone, total_bookings, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (customersError) {
    console.error('❌ Error fetching customers:', customersError.message);
  } else {
    console.log(`✅ Total customers: ${customers?.length || 0}\n`);
    
    if (customers && customers.length > 0) {
      console.log('Customer List:');
      customers.forEach((c, i) => {
        console.log(`  ${i + 1}. ID: ${c.id} | Name: ${c.full_name} | Email: ${c.email} | Bookings: ${c.total_bookings}`);
      });
    } else {
      console.log('   (No customers found)');
    }
  }

  // Check Vehicles
  console.log('\n\n🚗 CURRENT VEHICLES IN DATABASE');
  console.log('-'.repeat(70));
  
  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select('id, customer_id, plate_number, make, model, year')
    .order('created_at', { ascending: false })
    .limit(20);

  if (vehiclesError) {
    console.error('❌ Error fetching vehicles:', vehiclesError.message);
  } else {
    console.log(`✅ Total vehicles: ${vehicles?.length || 0}\n`);
    
    if (vehicles && vehicles.length > 0) {
      console.log('Vehicle List:');
      vehicles.forEach((v, i) => {
        console.log(`  ${i + 1}. ID: ${v.id} | Plate: ${v.plate_number} | ${v.year} ${v.make} ${v.model} (Customer: ${v.customer_id})`);
      });
    } else {
      console.log('   (No vehicles found)');
    }
  }

  // Check Branch Admins
  console.log('\n\n👤 CURRENT BRANCH ADMINS');
  console.log('-'.repeat(70));
  
  const { data: branchAdmins, error: branchAdminsError } = await supabase
    .from('branch_admins')
    .select('id, email, full_name, branch_id, is_active')
    .order('created_at', { ascending: false });

  if (branchAdminsError) {
    console.error('❌ Error fetching branch admins:', branchAdminsError.message);
  } else {
    console.log(`✅ Total branch admins: ${branchAdmins?.length || 0}\n`);
    
    if (branchAdmins && branchAdmins.length > 0) {
      console.log('Branch Admin List:');
      branchAdmins.forEach((a, i) => {
        console.log(`  ${i + 1}. ID: ${a.id} | Email: ${a.email} | Name: ${a.full_name} | Branch: ${a.branch_id} | Active: ${a.is_active}`);
      });
    } else {
      console.log('   (No branch admins found)');
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 DATABASE SUMMARY');
  console.log('='.repeat(70));
  
  console.log(`\n  Bookings:      ${bookings?.length || 0}`);
  console.log(`  Customers:     ${customers?.length || 0}`);
  console.log(`  Vehicles:      ${vehicles?.length || 0}`);
  console.log(`  Branch Admins: ${branchAdmins?.length || 0}`);
  
  console.log('\n' + '='.repeat(70));
}

verifyDatabase().then(() => {
  console.log('\n✅ Verification complete');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Verification failed:', err.message);
  process.exit(1);
});
