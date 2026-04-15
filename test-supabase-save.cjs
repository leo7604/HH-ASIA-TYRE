/**
 * Test Booking Form Submission and Supabase Database Save
 * Verifies that bookings are saved to Supabase database
 */

const { chromium } = require('@playwright/test');
const https = require('https');

// Supabase credentials
const SUPABASE_URL = 'https://knghsmttizcoecgwyfdk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

// Helper function to make HTTPS requests to Supabase
function supabaseRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();
  
  // Track API calls
  const apiCalls = [];
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('supabase') || url.includes('api/public')) {
      console.log('🌐 API Request:', request.method(), url);
      const postData = request.postData();
      if (postData) {
        console.log('   Payload:', postData);
        apiCalls.push({ url, method: request.method(), payload: postData });
      }
    }
  });
  
  page.on('response', response => {
    const url = response.url();
    if (url.includes('supabase') || url.includes('api/public')) {
      console.log('📥 API Response:', response.status(), url);
    }
  });

  try {
    console.log('🚀 Starting Booking Form Test with Supabase...\n');
    
    // Step 1: Get initial booking count from Supabase
    console.log('Step 1: Checking initial booking count in Supabase...');
    const initialResponse = await supabaseRequest('/rest/v1/bookings?select=id');
    const initialCount = initialResponse.data?.length || 0;
    console.log(`✅ Initial booking count: ${initialCount}\n`);
    
    // Step 2: Navigate to booking page
    console.log('Step 2: Navigating to booking page...');
    await page.goto('http://localhost:5173/book', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'supabase-test-01-page.png' });
    console.log('✅ Booking page loaded\n');
    
    // Step 3: Check if branch is preselected from URL
    console.log('Step 3: Checking for preselected branch...');
    await page.waitForTimeout(2000); // Wait for React to load
    
    // Step 4: Fill customer details (Step 5)
    console.log('Step 4: Filling customer details...');
    
    // Find and fill name
    const nameInput = await page.$('input[name="fullName"], #fullName, input[placeholder*="name" i]');
    if (nameInput) {
      await nameInput.fill('Test Customer Supabase');
      console.log('✅ Name filled: Test Customer Supabase');
    } else {
      console.log('⚠️ Name input not found, trying alternative selectors...');
      // Try clicking through to step 5 first
    }
    
    // Find and fill email
    const emailInput = await page.$('input[type="email"], #email, input[name="email"]');
    if (emailInput) {
      await emailInput.fill('supabase-test@example.com');
      console.log('✅ Email filled: supabase-test@example.com');
    }
    
    // Find and fill phone
    const phoneInput = await page.$('input[type="tel"], #phone, input[name="phone"]');
    if (phoneInput) {
      await phoneInput.fill('09171234567');
      console.log('✅ Phone filled: 09171234567\n');
    }
    
    await page.screenshot({ path: 'supabase-test-02-customer.png' });
    
    // Step 5: Fill vehicle details
    console.log('Step 5: Filling vehicle details...');
    
    // Year
    const yearInput = await page.$('select#vehicleYear, select[name="vehicleYear"], #vehicleYear');
    if (yearInput) {
      await yearInput.selectOption({ index: 2 }); // Pick a year
      console.log('✅ Year selected');
    }
    
    // Make
    const makeInput = await page.$('select#vehicleMake, select[name="vehicleMake"], #vehicleMake');
    if (makeInput) {
      await makeInput.selectOption({ index: 1 }); // Pick a make
      console.log('✅ Make selected: Toyota');
    }
    
    // Model
    const modelInput = await page.$('input#vehicleModel, #vehicleModel, input[name="vehicleModel"]');
    if (modelInput) {
      await modelInput.fill('Vios');
      console.log('✅ Model filled: Vios');
    }
    
    // Plate
    const plateInput = await page.$('input#plateNumber, #plateNumber, input[name="plateNumber"]');
    if (plateInput) {
      // Generate unique plate number
      const uniquePlate = `TEST-${Date.now().toString().slice(-6)}`;
      await plateInput.fill(uniquePlate);
      console.log(`✅ Plate filled: ${uniquePlate}`);
    }
    
    console.log('');
    await page.screenshot({ path: 'supabase-test-03-vehicle.png' });
    
    // Step 6: Select service
    console.log('Step 6: Selecting service...');
    const tireCheckbox = await page.$('input[value="Tire Rotation"], input[value*="Tire" i]');
    if (tireCheckbox) {
      await tireCheckbox.click();
      console.log('✅ Tire Rotation selected\n');
    } else {
      console.log('⚠️ Tire checkbox not found\n');
    }
    
    // Step 7: Select date
    console.log('Step 7: Selecting date...');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14); // 2 weeks from now
    const dateStr = futureDate.toISOString().split('T')[0];
    
    const dateInput = await page.$('input[type="date"], input#date, #preferredDate');
    if (dateInput) {
      await dateInput.fill(dateStr);
      console.log(`✅ Date selected: ${dateStr}\n`);
    }
    
    // Step 8: Select time slot
    console.log('Step 8: Selecting time slot...');
    await page.waitForTimeout(1000); // Wait for slots to load
    
    const timeSlot = await page.$('.time-slot:not(.disabled):not([disabled])');
    if (timeSlot) {
      await timeSlot.click();
      const slotText = await timeSlot.innerText();
      console.log(`✅ Time slot selected: ${slotText.trim()}\n`);
    } else {
      console.log('⚠️ Time slot not found\n');
    }
    
    await page.screenshot({ path: 'supabase-test-04-all-filled.png' });
    
    // Step 9: Submit booking
    console.log('Step 9: Submitting booking...');
    const submitBtn = await page.$('button:has-text("Submit"), button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      console.log('✅ Submit button clicked');
      
      // Wait for processing
      await page.waitForTimeout(5000);
      
      await page.screenshot({ path: 'supabase-test-05-after-submit.png' });
    } else {
      console.log('❌ Submit button not found\n');
    }
    
    // Step 10: Check localStorage
    console.log('Step 10: Checking localStorage...');
    const localBookings = await page.evaluate(() => {
      const bookings = localStorage.getItem('appointments');
      return bookings ? JSON.parse(bookings) : [];
    });
    
    if (localBookings.length > 0) {
      const latest = localBookings[localBookings.length - 1];
      console.log('✅ Latest localStorage booking:');
      console.log('   Customer:', latest.customerName);
      console.log('   Email:', latest.email);
      console.log('   Status:', latest.status);
      console.log('   Branch ID:', latest.branchId);
      console.log('   Date:', latest.date);
      console.log('   Time:', latest.time);
    } else {
      console.log('⚠️ No bookings in localStorage\n');
    }
    
    // Step 11: Wait for Supabase sync
    console.log('\nStep 11: Waiting for Supabase sync (5 seconds)...');
    await page.waitForTimeout(5000);
    
    // Step 12: Check Supabase database
    console.log('\nStep 12: Checking Supabase database...');
    const finalResponse = await supabaseRequest('/rest/v1/bookings?select=*&order=created_at.desc&limit=5');
    
    console.log('Supabase Response Status:', finalResponse.status);
    console.log('Total bookings in database:', finalResponse.data?.length || 0);
    
    if (finalResponse.data && finalResponse.data.length > 0) {
      console.log('\n✅ Latest bookings in Supabase:');
      finalResponse.data.slice(0, 3).forEach((booking, i) => {
        console.log(`\n--- Booking ${i + 1} ---`);
        console.log('ID:', booking.id);
        console.log('Branch ID:', booking.branch_id);
        console.log('Date:', booking.preferred_date);
        console.log('Time:', booking.preferred_time);
        console.log('Status:', booking.status);
        console.log('Services:', booking.services);
        console.log('Phone:', booking.phone);
        console.log('Email:', booking.email);
        console.log('Created At:', booking.created_at);
      });
      
      // Check if our test booking is there
      const testBooking = finalResponse.data.find(b => 
        b.email === 'supabase-test@example.com' || 
        b.phone === '09171234567'
      );
      
      if (testBooking) {
        console.log('\n🎉 SUCCESS! Test booking found in Supabase!');
        console.log('Booking ID:', testBooking.id);
        console.log('Status:', testBooking.status);
        console.log('Saved at:', testBooking.created_at);
      } else {
        console.log('\n⚠️ Test booking not found in Supabase yet');
        console.log('(May take a moment to sync)');
      }
    } else {
      console.log('\n❌ No bookings found in Supabase');
      if (finalResponse.data?.message) {
        console.log('Error:', finalResponse.data.message);
      }
    }
    
    // Summary
    console.log('\n========================================');
    console.log('TEST SUMMARY');
    console.log('========================================');
    console.log('Initial bookings:', initialCount);
    console.log('Final bookings:', finalResponse.data?.length || 0);
    console.log('New bookings:', (finalResponse.data?.length || 0) - initialCount);
    console.log('API calls made:', apiCalls.length);
    console.log('\n📸 Screenshots saved:');
    console.log('   - supabase-test-01-page.png');
    console.log('   - supabase-test-02-customer.png');
    console.log('   - supabase-test-03-vehicle.png');
    console.log('   - supabase-test-04-all-filled.png');
    console.log('   - supabase-test-05-after-submit.png');
    
    if (apiCalls.length > 0) {
      console.log('\n📡 API Calls:');
      apiCalls.forEach((call, i) => {
        console.log(`   ${i + 1}. ${call.method} ${call.url}`);
      });
    }
    
    console.log('\n========================================');
    
    // Take final screenshot
    await page.screenshot({ path: 'supabase-test-final.png', fullPage: true });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'supabase-test-error.png' });
  } finally {
    await browser.close();
  }
})();
