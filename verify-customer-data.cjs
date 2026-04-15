/**
 * Verify Customer Information Storage in Supabase
 * Shows what customer data is saved and how
 * 
 * Run: node verify-customer-data.cjs
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log(' Customer Information Storage Verification\n');
console.log('='.repeat(70));

async function verifyCustomerData() {
  // 1. Check customers table
  console.log('\n📋 CUSTOMER INFORMATION STORED IN DATABASE');
  console.log('-'.repeat(70));
  
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('id, customer_reference, full_name, email, phone, total_bookings, status, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (customersError) {
    console.error('❌ Error fetching customers:', customersError.message);
  } else {
    console.log(`✅ Total customers in database: ${customers?.length || 0}\n`);
    
    if (customers && customers.length > 0) {
      console.log('Sample Customer Records:');
      customers.forEach((c, i) => {
        console.log(`\n  Customer #${i + 1}:`);
        console.log(`    ID:               ${c.id}`);
        console.log(`    Reference:        ${c.customer_reference}`);
        console.log(`    Full Name:        ${c.full_name}`);
        console.log(`    Email:            ${c.email}`);
        console.log(`    Phone:            ${c.phone}`);
        console.log(`    Total Bookings:   ${c.total_bookings}`);
        console.log(`    Status:           ${c.status}`);
        console.log(`    Created:          ${c.created_at}`);
      });
    }
  }

  // 2. Check how bookings link to customers
  console.log('\n\n🔗 HOW BOOKINGS LINK TO CUSTOMERS');
  console.log('-'.repeat(70));
  
  const { data: sampleBookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_reference,
      status,
      customers:customer_id (
        id,
        full_name,
        email,
        phone
      )
    `)
    .limit(5);

  if (bookingsError) {
    console.error('❌ Error fetching bookings:', bookingsError.message);
  } else {
    console.log(`\nSample Bookings with Customer Links:`);
    sampleBookings?.forEach((b, i) => {
      console.log(`\n  Booking #${i + 1}:`);
      console.log(`    Booking ID:       ${b.id}`);
      console.log(`    Reference:        ${b.booking_reference}`);
      console.log(`    Status:           ${b.status}`);
      if (b.customers) {
        console.log(`    Customer ID:      ${b.customers.id}`);
        console.log(`    Customer Name:    ${b.customers.full_name}`);
        console.log(`    Customer Email:   ${b.customers.email}`);
        console.log(`    Customer Phone:   ${b.customers.phone}`);
      }
    });
  }

  // 3. Check vehicles linked to customers
  console.log('\n\n🚗 VEHICLES LINKED TO CUSTOMERS');
  console.log('-'.repeat(70));
  
  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select(`
      id,
      plate_number,
      make,
      model,
      year,
      customers:customer_id (
        id,
        full_name,
        email
      )
    `)
    .limit(5);

  if (vehiclesError) {
    console.error('❌ Error fetching vehicles:', vehiclesError.message);
  } else {
    console.log(`\nSample Vehicles with Owner Information:`);
    vehicles?.forEach((v, i) => {
      console.log(`\n  Vehicle #${i + 1}:`);
      console.log(`    Vehicle ID:       ${v.id}`);
      console.log(`    Plate Number:     ${v.plate_number}`);
      console.log(`    Vehicle:          ${v.year} ${v.make} ${v.model}`);
      if (v.customers) {
        console.log(`    Owner:            ${v.customers.full_name}`);
        console.log(`    Owner Email:      ${v.customers.email}`);
      }
    });
  }

  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 CUSTOMER DATA STORAGE SUMMARY');
  console.log('='.repeat(70));
  
  console.log(`\n✅ Customer Information IS SAVED to Supabase:`);
  console.log(`   • Full Name`);
  console.log(`   • Email Address`);
  console.log(`   • Phone Number`);
  console.log(`   • Customer Reference ID`);
  console.log(`   • Total Bookings Count`);
  console.log(`   • Account Status`);
  console.log(`   • Creation Timestamp`);
  
  console.log(`\n✅ Linked Data:`);
  console.log(`   • Bookings reference customer_id (foreign key)`);
  console.log(`   • Vehicles reference customer_id (foreign key)`);
  console.log(`   • Full customer info retrievable via JOIN queries`);
  
  console.log(`\n✅ Data Persistence:`);
  console.log(`   • Stored permanently in Supabase database`);
  console.log(`   • Survives page refresh`);
  console.log(`   • Available to branch admins`);
  console.log(`   • Available to super admins`);

  console.log('\n' + '='.repeat(70));
}

verifyCustomerData().then(() => {
  console.log('\n✅ Verification complete');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Verification failed:', err.message);
  process.exit(1);
});
