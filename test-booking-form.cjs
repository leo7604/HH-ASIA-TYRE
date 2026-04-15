/**
 * Test Booking Form Submission and Database Save
 * Tests if HH Asia Tyre booking form saves to Supabase database
 */

const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();
  
  // Track API calls
  const apiCalls = [];
  
  page.on('request', request => {
    if (request.url().includes('supabase') || request.url().includes('/api/')) {
      console.log('🌐 API Request:', request.url());
      if (request.postData()) {
        console.log('   Payload:', request.postData());
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          payload: request.postData()
        });
      }
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('supabase') || response.url().includes('/api/')) {
      console.log('📥 API Response:', response.status(), response.url());
    }
  });
  
  try {
    console.log('🚀 Starting Booking Form Test...\n');
    
    // Step 1: Navigate to booking page
    console.log('Step 1: Navigating to booking page...');
    await page.goto('http://localhost:5173/book', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'test-01-booking-page.png' });
    console.log('✅ Booking page loaded\n');
    
    // Step 2: Check if form elements exist
    console.log('Step 2: Checking form elements...');
    const formExists = await page.$('form, .booking-form, #booking-form');
    if (formExists) {
      console.log('✅ Booking form found\n');
    } else {
      console.log('❌ Booking form not found\n');
    }
    
    // Step 3: Fill customer details
    console.log('Step 3: Filling customer details...');
    const nameInput = await page.$('input[name="fullName"], input[name="customerName"], input[placeholder*="name" i], #fullName, #customerName');
    const emailInput = await page.$('input[name="email"], input[type="email"], #email');
    const phoneInput = await page.$('input[name="phone"], input[type="tel"], #phone');
    
    if (nameInput) {
      await nameInput.fill('Test Customer');
      console.log('✅ Name filled');
    } else {
      console.log('⚠️ Name input not found');
    }
    
    if (emailInput) {
      await emailInput.fill('test@example.com');
      console.log('✅ Email filled');
    } else {
      console.log('⚠️ Email input not found');
    }
    
    if (phoneInput) {
      await phoneInput.fill('09171234567');
      console.log('✅ Phone filled\n');
    } else {
      console.log('⚠️ Phone input not found\n');
    }
    
    await page.screenshot({ path: 'test-02-customer-filled.png' });
    
    // Step 4: Check if we need to navigate to next step (multi-step form)
    console.log('Step 4: Looking for Next button...');
    const nextBtn = await page.$('button:has-text("Next"), button:has-text("Continue"), .btn-next');
    if (nextBtn) {
      console.log('✅ Multi-step form detected, clicking Next...');
      await nextBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-03-next-step.png' });
    } else {
      console.log('⚠️ Next button not found\n');
    }
    
    // Step 5: Fill vehicle details
    console.log('Step 5: Filling vehicle details...');
    
    // Year field
    const yearInput = await page.$('input[name="year"], input#vehicleYear, select#vehicleYear, select[name="vehicleYear"]');
    if (yearInput) {
      const tagName = await yearInput.evaluate(el => el.tagName);
      if (tagName === 'SELECT') {
        await yearInput.selectOption('2022');
      } else {
        await yearInput.fill('2022');
      }
      console.log('✅ Year filled: 2022');
    } else {
      console.log('⚠️ Year input not found');
    }
    
    // Make field
    const makeInput = await page.$('input[name="make"], input#vehicleMake, select#vehicleMake, select[name="vehicleMake"]');
    if (makeInput) {
      const tagName = await makeInput.evaluate(el => el.tagName);
      if (tagName === 'SELECT') {
        await makeInput.selectOption('Toyota');
      } else {
        await makeInput.fill('Toyota');
      }
      console.log('✅ Make filled: Toyota');
    } else {
      console.log('⚠️ Make input not found');
    }
    
    // Model field
    const modelInput = await page.$('input[name="model"], input#vehicleModel, #vehicleModel');
    if (modelInput) {
      await modelInput.fill('Vios');
      console.log('✅ Model filled: Vios');
    } else {
      console.log('⚠️ Model input not found');
    }
    
    // Plate number
    const plateInput = await page.$('input[name="plateNumber"], input#plateNumber, #plateNumber');
    if (plateInput) {
      await plateInput.fill('TEST-001');
      console.log('✅ Plate filled: TEST-001\n');
    } else {
      console.log('⚠️ Plate input not found\n');
    }
    
    await page.screenshot({ path: 'test-04-vehicle-filled.png' });
    
    // Step 6: Check for services selection
    console.log('Step 6: Looking for services selection...');
    const tireService = await page.$('input[value*="tire" i], input[value*="Tire" i], .service-checkbox:has-text("Tire"), [data-service*="tire"]');
    if (tireService) {
      await tireService.click();
      console.log('✅ Tire Rotation service selected\n');
    } else {
      console.log('⚠️ Tire service not found\n');
    }
    
    // Step 7: Check for date picker
    console.log('Step 7: Looking for date picker...');
    const dateInput = await page.$('input[name="date"], input[type="date"], input#date, #preferredDate, input[placeholder*="date" i]');
    if (dateInput) {
      // Set date to 2 weeks from now
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);
      const dateStr = futureDate.toISOString().split('T')[0];
      await dateInput.fill(dateStr);
      console.log(`✅ Date selected: ${dateStr}\n`);
    } else {
      console.log('⚠️ Date input not found\n');
    }
    
    // Step 8: Check for time slot selection
    console.log('Step 8: Looking for time slots...');
    const timeSlot = await page.$('.time-slot:not(.disabled):not([disabled]), button.time-slot, [class*="time-slot"]:not(.disabled)');
    if (timeSlot) {
      await timeSlot.click();
      console.log('✅ Time slot selected\n');
    } else {
      console.log('⚠️ Available time slot not found\n');
    }
    
    await page.screenshot({ path: 'test-05-all-filled.png' });
    
    // Step 9: Navigate to next step
    console.log('Step 9: Looking for Next button to proceed...');
    const nextBtn2 = await page.$('button:has-text("Next"), button:has-text("Continue"), .btn-next');
    if (nextBtn2) {
      await nextBtn2.click();
      await page.waitForTimeout(1000);
      console.log('✅ Proceeded to next step\n');
      await page.screenshot({ path: 'test-06-next-step.png' });
    }
    
    // Step 10: Submit the booking
    console.log('Step 10: Looking for Submit button...');
    const submitBtn = await page.$('button:has-text("Submit"), button:has-text("Book"), button[type="submit"], .btn-submit');
    if (submitBtn) {
      console.log('✅ Submit button found, clicking...');
      await submitBtn.click();
      
      // Wait for response
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'test-07-after-submit.png' });
      console.log('✅ Form submitted\n');
    } else {
      console.log('❌ Submit button not found\n');
    }
    
    // Step 11: Check for confirmation
    console.log('Step 11: Checking for confirmation...');
    await page.waitForTimeout(2000);
    
    const confirmationText = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="confirm"], [class*="success"], h1, h2, .message');
      for (const el of elements) {
        const text = el.innerText?.toLowerCase() || '';
        if (text.includes('confirm') || text.includes('success') || text.includes('booked') || text.includes('thank')) {
          return el.innerText;
        }
      }
      return null;
    });
    
    if (confirmationText) {
      console.log('✅ Booking confirmed!');
      console.log('   Message:', confirmationText);
    } else {
      console.log('⚠️ Confirmation message not found\n');
    }
    
    await page.screenshot({ path: 'test-08-final.png' });
    
    // Step 12: Check localStorage
    console.log('Step 12: Checking localStorage for booking...');
    const localStorageBookings = await page.evaluate(() => {
      const bookings = localStorage.getItem('appointments');
      return bookings ? JSON.parse(bookings) : null;
    });
    
    if (localStorageBookings) {
      console.log('✅ Found bookings in localStorage:', localStorageBookings.length);
      console.log('   Latest booking:', JSON.stringify(localStorageBookings[localStorageBookings.length - 1], null, 2));
    } else {
      console.log('⚠️ No bookings in localStorage\n');
    }
    
    // Summary
    console.log('\n========================================');
    console.log('TEST SUMMARY');
    console.log('========================================');
    console.log(`API Calls Made: ${apiCalls.length}`);
    
    if (apiCalls.length > 0) {
      console.log('\n📡 API Calls Detected:');
      apiCalls.forEach((call, i) => {
        console.log(`   ${i + 1}. ${call.method} ${call.url}`);
        if (call.payload) {
          try {
            const payload = JSON.parse(call.payload);
            console.log(`      Payload: ${JSON.stringify(payload, null, 2)}`);
          } catch (e) {
            console.log(`      Payload: ${call.payload}`);
          }
        }
      });
    }
    
    console.log('\n📸 Screenshots saved:');
    console.log('   - test-01-booking-page.png');
    console.log('   - test-02-customer-filled.png');
    console.log('   - test-03-next-step.png');
    console.log('   - test-04-vehicle-filled.png');
    console.log('   - test-05-all-filled.png');
    console.log('   - test-06-next-step.png');
    console.log('   - test-07-after-submit.png');
    console.log('   - test-08-final.png');
    
    console.log('\n========================================');
    console.log('NEXT STEP: Check Supabase Database');
    console.log('========================================');
    console.log('1. Go to: https://supabase.com/dashboard/project/knghsmttizcoecgwyfdk');
    console.log('2. Click "Table Editor"');
    console.log('3. Select "bookings" table');
    console.log('4. Check if new booking was saved');
    console.log('5. Verify the test data matches:');
    console.log('   - Customer Name: Test Customer');
    console.log('   - Email: test@example.com');
    console.log('   - Phone: 09171234567');
    console.log('   - Make: Toyota, Model: Vios');
    console.log('   - Plate: TEST-001');
    console.log('========================================\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'test-error.png' });
  } finally {
    await browser.close();
  }
})();
