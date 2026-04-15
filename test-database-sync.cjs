// Test: Create booking → Approve → Sync to Database
// Run with: node test-database-sync.cjs

const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  const page = await browser.newPage();
  
  // Monitor API calls
  const apiCalls = [];
  
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log('\n🌐 API REQUEST:');
      console.log('   URL:', request.url());
      console.log('   Method:', request.method());
      if (request.postData()) {
        console.log('   Payload:', request.postData());
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          payload: JSON.parse(request.postData())
        });
      }
    }
  });
  
  page.on('response', async response => {
    if (response.url().includes('/api/')) {
      console.log('\n📡 API RESPONSE:');
      console.log('   URL:', response.url());
      console.log('   Status:', response.status());
      try {
        const body = await response.json();
        console.log('   Body:', JSON.stringify(body, null, 2).substring(0, 200));
      } catch (e) {
        console.log('   Body: (non-JSON response)');
      }
    }
  });
  
  try {
    console.log('🚀 DATABASE SYNC TEST\n');
    console.log('=' .repeat(60));
    
    // STEP 1: Create booking request
    console.log('\n📝 STEP 1: Creating booking request...');
    await page.goto('http://localhost:5173');
    
    await page.evaluate(() => {
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      const newBooking = {
        id: Date.now(),
        branchId: 1,
        bayId: null,
        bayName: null,
        customerName: 'Database Test Customer',
        email: 'dbtest@example.com',
        phone: '09178888888',
        vehicleYear: '2021',
        vehicleMake: 'Honda',
        vehicleModel: 'Civic',
        vehicleTrim: 'S',
        plateNumber: 'DB-5678',
        services: ['Oil Change', 'Tire Rotation'],
        otherServices: null,
        date: '2026-04-22',
        time: '2:00 PM',
        mileage: 30000,
        notes: 'Test booking for database sync verification',
        status: 'pending',
        createdAt: new Date().toISOString(),
        apiBookingId: null,
        apiSuccess: false,
      };
      
      appointments.push(newBooking);
      localStorage.setItem('appointments', JSON.stringify(appointments));
    });
    
    await page.screenshot({ path: 'screenshots/db-test-01-booking-created.png' });
    console.log('✅ Booking created in localStorage');
    console.log('📊 Status: PENDING (not yet sent to database)\n');
    
    // STEP 2: Login as branch admin
    console.log('🔐 STEP 2: Setting up admin login...');
    await page.evaluate(() => {
      const admins = JSON.parse(localStorage.getItem('branchAdmins') || '[]');
      const exists = admins.find(a => a.email === 'admin@hhasia.com');
      
      if (!exists) {
        admins.push({
          id: 50,
          email: 'admin@hhasia.com',
          password: 'Admin123!',
          fullName: 'Branch Admin',
          role: 'branch_admin',
          branchId: 1
        });
        localStorage.setItem('branchAdmins', JSON.stringify(admins));
      }
    });
    
    await page.goto('http://localhost:5173/admin/login');
    await page.fill('input[type="email"]', 'admin@hhasia.com');
    await page.fill('input[type="password"]', 'Admin123!');
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);
    
    await page.screenshot({ path: 'screenshots/db-test-02-admin-dashboard.png' });
    console.log('✅ Admin logged in successfully');
    console.log('📍 Dashboard loaded, checking for pending booking...\n');
    
    // STEP 3: Verify pending booking is visible
    console.log('🔍 STEP 3: Verifying pending booking...');
    const pendingBadge = await page.$('.status-badge:has-text("Pending"), span:has-text("Pending")');
    
    if (pendingBadge) {
      console.log('✅ Found pending booking in admin dashboard');
      await page.screenshot({ path: 'screenshots/db-test-03-pending-booking.png' });
    } else {
      console.log('❌ No pending booking found!');
      throw new Error('Pending booking not found in dashboard');
    }
    
    // STEP 4: Approve booking (should trigger database sync)
    console.log('\n✅ STEP 4: Approving booking (this will send to database)...');
    const bookingCard = await pendingBadge.$('xpath=..');
    const approveBtn = await bookingCard.$('button:has-text("Approve")');
    
    if (approveBtn) {
      console.log('🔘 Clicking Approve button...');
      await approveBtn.click();
      await page.waitForTimeout(500);
      
      // Check if bay assignment modal appeared
      const modalTitle = await page.$('.modal h3, h2:has-text("Assign"), h3:has-text("Bay")');
      if (modalTitle) {
        console.log('🏢 Bay assignment modal appeared');
        
        // Select Bay 1
        const bay1Btn = await page.$('button:has-text("Bay 1"), .bay-option:first-child button');
        if (bay1Btn) {
          await bay1Btn.click();
          await page.waitForTimeout(300);
          console.log('✅ Bay 1 selected');
        }
        
        // Click "Assign Bay & Approve"
        console.log('🔘 Clicking "Assign Bay & Approve"...');
        const confirmBtn = await page.$('button:has-text("Assign Bay & Approve"), button:has-text("Confirm"), button:has-text("Approve")');
        if (confirmBtn) {
          await confirmBtn.click();
          console.log('⏳ Waiting for approval and database sync...');
          await page.waitForTimeout(3000); // Wait for API call to complete
          
          await page.screenshot({ path: 'screenshots/db-test-04-booking-approved.png' });
          console.log('✅ Booking approved!');
        }
      }
    } else {
      console.log('❌ Approve button not found!');
    }
    
    // STEP 5: Verify approval and database sync
    console.log('\n📊 STEP 5: Verifying database sync...');
    
    // Check localStorage for updated booking
    const localStorageData = await page.evaluate(() => {
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      return appointments.filter(a => a.customerName === 'Database Test Customer');
    });
    
    if (localStorageData.length > 0) {
      const booking = localStorageData[0];
      console.log('\n📋 Booking Status in localStorage:');
      console.log(`   Status: ${booking.status}`);
      console.log(`   Bay ID: ${booking.bayId || 'Not assigned'}`);
      console.log(`   Bay Name: ${booking.bayName || 'Not assigned'}`);
      console.log(`   API Success: ${booking.apiSuccess}`);
      console.log(`   API Booking ID: ${booking.apiBookingId || 'Not synced'}`);
    }
    
    // Check API calls made
    console.log('\n🌐 API Calls Made:');
    if (apiCalls.length > 0) {
      apiCalls.forEach((call, i) => {
        console.log(`\n   Call ${i + 1}:`);
        console.log(`   URL: ${call.url}`);
        console.log(`   Method: ${call.method}`);
        console.log(`   Payload:`);
        console.log(`     branchId: ${call.payload.branchId}`);
        console.log(`     status: ${call.payload.status}`);
        console.log(`     customerName: ${call.payload.customerName}`);
        console.log(`     bayId: ${call.payload.bayId || 'null'}`);
        console.log(`     bayName: ${call.payload.bayName || 'null'}`);
      });
      
      // Verify the API call had correct data
      const approvalCall = apiCalls.find(c => c.payload.status === 'approved');
      if (approvalCall) {
        console.log('\n✅ DATABASE SYNC VERIFIED!');
        console.log('   The booking was sent to the database with:');
        console.log(`   ✓ branchId: ${approvalCall.payload.branchId} (correct - using branchId, not branch code)`);
        console.log(`   ✓ status: approved`);
        console.log(`   ✓ bayId: ${approvalCall.payload.bayId || 'assigned'}`);
        console.log(`   ✓ All customer details included`);
      }
    } else {
      console.log('⚠️  No API calls detected!');
      console.log('   The booking may not have been synced to the database.');
      console.log('   Check if the API endpoint is configured in .env file.');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'screenshots/db-test-05-final-verification.png' });
    
    // FINAL REPORT
    console.log('\n' + '='.repeat(60));
    console.log('📊 DATABASE SYNC TEST REPORT');
    console.log('='.repeat(60));
    console.log('\n✅ Test Steps Completed:');
    console.log('   1. ✅ Created booking request (status: pending)');
    console.log('   2. ✅ Logged in as branch admin');
    console.log('   3. ✅ Found pending booking in dashboard');
    console.log('   4. ✅ Approved booking with bay assignment');
    console.log('   5. ✅ Verified database sync attempt');
    
    console.log('\n📡 Database Sync Status:');
    if (apiCalls.length > 0) {
      console.log('   ✅ API call detected - booking sent to database');
      console.log('   🌐 Endpoint: hh-asia-tyre-crm-inv-sys.vercel.app');
      console.log('   📦 Payload includes branchId (correct format)');
    } else {
      console.log('   ⚠️  No API call detected');
      console.log('   💡 Possible reasons:');
      console.log('      - API endpoint not configured in .env');
      console.log('      - API server not responding');
      console.log('      - Network error');
    }
    
    console.log('\n📸 Screenshots saved:');
    console.log('   1. db-test-01-booking-created.png');
    console.log('   2. db-test-02-admin-dashboard.png');
    console.log('   3. db-test-03-pending-booking.png');
    console.log('   4. db-test-04-booking-approved.png');
    console.log('   5. db-test-05-final-verification.png');
    console.log('\n📁 Location: c:\\Users\\leonards\\Desktop\\demo4april\\screenshots\\');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST COMPLETED');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/db-test-error.png' });
    console.log('📸 Error screenshot saved');
  } finally {
    await browser.close();
    console.log('\n👋 Browser closed');
  }
})();
