/**
 * Simple Supabase Save Test
 * Tests the Supabase connection and booking save functionality directly
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('🧪 HH Asia Tyre - Supabase Save Test\n');
  console.log('='.repeat(50));
  
  try {
    // 1. Test Supabase Connection
    console.log('\n1️⃣ Testing Supabase Connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('branches')
      .select('id, branch_code, name')
      .limit(1);
    
    if (connectionError) {
      console.log('❌ Connection failed:', connectionError.message);
      return;
    }
    console.log('✅ Supabase Connected Successfully!');
    console.log('   Sample branch:', connectionTest?.[0]?.name || 'N/A');
    
    // 2. Check Initial Booking Count
    console.log('\n2️⃣ Checking Existing Bookings...');
    const { count: initialCount, error: countError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ Count failed:', countError.message);
    } else {
      console.log(`✅ Found ${initialCount} existing bookings in database`);
    }
    
    // 3. Get Branch Info
    console.log('\n3️⃣ Getting Branch Info...');
    const { data: branches } = await supabase
      .from('branches')
      .select('id, branch_code')
      .limit(1);
    
    const branchId = branches?.[0]?.id || 1;
    console.log(`   Branch ID: ${branchId}, Code: ${branches?.[0]?.branch_code}`);
    
    // 5. Create Test Booking (simulating BookingPage data format)
    console.log('\n5️⃣ Creating Test Booking...');
    
    // Tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const preferredDate = tomorrow.toISOString().split('T')[0];
    
    // This is the exact data format that BookingPage sends
    const bookingData = {
      branch_id: branchId,
      full_name: 'Juan Dela Cruz',
      email: 'test@example.com',
      phone: '0917 123 4567',
      vehicle_make: 'Toyota',
      vehicle_model: 'Vios',
      vehicle_year: 2023,
      vehicle_trim: 'G',
      plate_number: 'ABC-1234',
      preferred_date: preferredDate,
      preferred_time: '10:00',
      services: ['Tire Installation', 'Wheel Alignment'],
      other_services: null,
      customer_concern: 'Testing via booking form',
      source: 'website'
    };
    
    console.log('   Booking data:', JSON.stringify(bookingData, null, 2));
    
    // === REPLICATE createBooking() logic ===
    
    // 1. Find or create customer
    let customerId = null;
    
    // Check if customer exists
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', bookingData.email)
      .single();
    
    if (existingCustomer) {
      customerId = existingCustomer.id;
      console.log('   Found existing customer ID:', customerId);
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          customer_reference: 'CUST-' + Date.now(),
          full_name: bookingData.full_name,
          email: bookingData.email,
          phone: bookingData.phone,
          total_bookings: 0,
          status: 'ACTIVE'
        })
        .select('id')
        .single();
      
      if (customerError) {
        console.log('⚠️ Customer creation failed:', customerError.message);
      } else {
        customerId = newCustomer.id;
        console.log('   Created new customer ID:', customerId);
      }
    }
    
    // 2. Find or create vehicle
    let vehicleId = null;
    
    if (bookingData.plate_number && customerId) {
      const { data: existingVehicle } = await supabase
        .from('vehicles')
        .select('id')
        .eq('plate_number', bookingData.plate_number)
        .single();
      
      if (existingVehicle) {
        vehicleId = existingVehicle.id;
        console.log('   Found existing vehicle ID:', vehicleId);
      } else {
        const { data: newVehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .insert({
            customer_id: customerId,
            plate_number: bookingData.plate_number,
            make: bookingData.vehicle_make,
            model: bookingData.vehicle_model,
            year: bookingData.vehicle_year,
            trim: bookingData.vehicle_trim,
            is_active: true
          })
          .select('id')
          .single();
        
        if (vehicleError) {
          console.log('⚠️ Vehicle creation failed:', vehicleError.message);
        } else {
          vehicleId = newVehicle.id;
          console.log('   Created new vehicle ID:', vehicleId);
        }
      }
    }
    
    // 3. Generate booking reference
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const bookingReference = `BK-${dateStr}-${randomSuffix}`;
    
    // 4. Create the booking
    const { data: newBooking, error: insertError } = await supabase
      .from('bookings')
      .insert([{
        booking_reference: bookingReference,
        branch_id: bookingData.branch_id,
        customer_id: customerId,
        vehicle_id: vehicleId,
        preferred_date: bookingData.preferred_date,
        preferred_time: bookingData.preferred_time,
        services: bookingData.services,
        other_services: bookingData.other_services,
        customer_concern: bookingData.customer_concern,
        status: 'pending',
        source: bookingData.source,
        bay_id: null,
        bay_name: null
      }])
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
      console.log('   Full error:', JSON.stringify(insertError, null, 2));
      return;
    }
    
    console.log('✅ Booking Saved Successfully!');
    console.log(`   Booking ID: ${newBooking.id}`);
    console.log(`   Status: ${newBooking.status}`);
    
    // 5. Verify Booking was Saved
    console.log('\n5️⃣ Verifying Booking in Database...');
    const { data: savedBooking, error: verifyError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', newBooking.id)
      .single();
    
    if (verifyError) {
      console.log('❌ Verification failed:', verifyError.message);
    } else {
      console.log('✅ Booking Verified in Database!');
      console.log('   Reference:', savedBooking.booking_reference);
      console.log('   Customer ID:', savedBooking.customer_id);
      console.log('   Branch ID:', savedBooking.branch_id);
    }
    
    // 6. Final Count
    console.log('\n6️⃣ Final Booking Count...');
    const { count: finalCount, error: finalError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    if (!finalError) {
      console.log(`✅ Total bookings now: ${finalCount}`);
      console.log(`   New bookings added: ${finalCount - initialCount}`);
    }
    
    // 7. Cleanup - Delete Test Booking
    console.log('\n7️⃣ Cleaning Up Test Data...');
    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('id', newBooking.id);
    
    if (deleteError) {
      console.log('⚠️ Cleanup failed (booking may need manual deletion):', deleteError.message);
    } else {
      console.log('✅ Test booking deleted successfully');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 SUPABASE TEST COMPLETED SUCCESSFULLY!');
    console.log('   The database integration is working correctly.');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Test Failed with Error:');
    console.error(error);
  }
}

testSupabase();
