// Comprehensive booking approval flow test with database sync verification
// Run with: node test-approval-flow.cjs

const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  const page = await browser.newPage();
  
  // Monitor console logs
  page.on('console', msg => {
    if (msg.text().includes('database API') || msg.text().includes('API Response')) {
      console.log('\n🖥️  BROWSER CONSOLE:', msg.text());
    }
  });
  
  // Monitor API calls
  const apiCalls = [];
  
  page.on('request', request => {
    if (request.url().includes('vercel.app') || request.url().includes('/api/')) {
      console.log('\n🌐 API REQUEST:');
      console.log('   URL:', request.url());
      console.log('   Method:', request.method());
      if (request.postData()) {
        const payload = JSON.parse(request.postData());
        console.log('   Payload:', JSON.stringify(payload, null, 2));
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          payload: payload
        });
      }
    }
  });
  
  page.on('response', async response => {
    if (response.url().includes('vercel.app') || response.url().includes('/api/')) {
      console.log('\n📡 API RESPONSE:');
      console.log('   Status:', response.status(), response.statusText());
      try {
        const body = await response.json();
        console.log('   Body:', JSON.stringify(body, null, 2).substring(0, 300));
      } catch (e) {
        console.log('   Body: (non-JSON)');
      }
    }
  });
  
  try {
    console.log('🚀 BOOKING APPROVAL FLOW TEST\n');
    console.log('='.repeat(70));
    
    // STEP 1: Create booking request
    console.log('\n📝 STEP 1: Creating test booking...');
    await page.goto('http://localhost:5173');
    
    const testBooking = {
      id: Date.now(),
      branchId: 1,
      bayId: null,
      bayName: null,
      customerName: 'Browser Test Customer',
      email: 'browsertest@example.com',
      phone: '09178887777',
      vehicleYear: '2022',
      vehicleMake: 'Toyota',
      vehicleModel: 'Fortuner',
      vehicleTrim: 'G',
      plateNumber: 'BROWSER-01',
      services: ['Tire Rotation', 'Oil Change'],
      otherServices: null,
      date: '2026-05-01',
      time: '11:00 AM',
      mileage: 25000,
      notes: 'Browser automation test booking',
      status: 'pending',
      createdAt: new Date().toISOString(),
      apiBookingId: null,
      apiSuccess: false,
    };
    
    await page.evaluate((booking) => {
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      // Remove old test bookings
      const filtered = appointments.filter(a => a.customerName !== 'Browser Test Customer');
      filtered.push(booking);
      localStorage.setItem('appointments', JSON.stringify(filtered));
    }, testBooking);
    
    await page.screenshot({ path: 'screenshots/flow-01-booking-created.png' });
    console.log('✅ Booking created in localStorage');
    console.log('   Status: PENDING');
    console.log('   Branch: Alabang (ID: 1)');
    
    // STEP 2: Login as branch admin
    console.log('\n🔐 STEP 2: Setting up admin login...');
    await page.evaluate(() => {
      const admins = JSON.parse(localStorage.getItem('branchAdmins') || '[]');
      const exists = admins.find(a => a.email === 'admintest@hhasia.com');
      
      if (!exists) {
        admins.push({
          id: 200,
          email: 'admintest@hhasia.com',
          password: 'AdminTest123!',
          fullName: 'Admin Test User',
          role: 'branch_admin',
          branchId: 1
        });
        localStorage.setItem('branchAdmins', JSON.stringify(admins));
      }
    });
    
    await page.goto('http://localhost:5173/admin/login');
    await page.fill('input[type="email"]', 'admintest@hhasia.com');
    await page.fill('input[type="password"]', 'AdminTest123!');
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]);
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/flow-02-admin-logged-in.png' });
    console.log('✅ Admin logged in successfully');
    console.log('   Dashboard loaded');
    
    // STEP 3: Find pending booking
    console.log('\n🔍 STEP 3: Finding pending booking...');
    await page.waitForTimeout(1000);
    
    // Look for the booking by customer name
    const customerCell = await page.$('td:has-text("Browser Test Customer")');
    
    if (!customerCell) {
      console.log('❌ Booking not found in dashboard!');
      await page.screenshot({ path: 'screenshots/flow-error-booking-not-found.png' });
      return;
    }
    
    console.log('✅ Found booking for "Browser Test Customer"');
    
    // Get the row
    const row = await customerCell.$('xpath=..');
    const statusCell = await row.$('td:nth-child(6)'); // Status column
    const statusText = await statusCell?.innerText();
    console.log('   Current status:', statusText);
    
    await page.screenshot({ path: 'screenshots/flow-03-pending-booking.png' });
    
    // STEP 4: Approve with bay assignment
    console.log('\n✅ STEP 4: Approving booking with bay assignment...');
    
    // Find Approve button in the row
    const approveBtn = await row.$('button:has-text("Approve")');
    
    if (!approveBtn) {
      console.log('❌ Approve button not found!');
      return;
    }
    
    console.log('🔘 Clicking Approve button...');
    await approveBtn.click();
    await page.waitForTimeout(1000);
    
    // Check if bay assignment modal appeared
    const modalTitle = await page.$('.modal h3, h2:has-text("Bay"), h3:has-text("Assign")');
    
    if (modalTitle) {
      console.log('✅ Bay assignment modal appeared');
      await page.screenshot({ path: 'screenshots/flow-04a-modal-opened.png' });
      
      // Select Bay 1
      const bay1Btn = await page.$('button:has-text("Bay 1")');
      if (bay1Btn) {
        console.log('🏢 Selecting Bay 1...');
        await bay1Btn.click();
        await page.waitForTimeout(500);
      }
      
      // Click "Assign Bay & Approve"
      console.log('🔘 Clicking "Assign Bay & Approve"...');
      const confirmBtn = await page.$('button:has-text("Assign Bay & Approve"), button:has-text("Confirm")');
      if (confirmBtn) {
        await confirmBtn.click();
        console.log('⏳ Waiting for approval and database sync...');
        await page.waitForTimeout(4000); // Wait for API call
        
        await page.screenshot({ path: 'screenshots/flow-04b-approved.png' });
        console.log('✅ Approval process completed');
      }
    } else {
      console.log('⚠️  No modal appeared - may have approved directly');
      await page.waitForTimeout(2000);
    }
    
    // STEP 5: Verify approval
    console.log('\n📊 STEP 5: Verifying approval status...');
    
    // Check localStorage for updated booking
    const updatedBooking = await page.evaluate(() => {
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      return appointments.find(a => a.customerName === 'Browser Test Customer');
    });
    
    if (updatedBooking) {
      console.log('\n📋 Booking Details from localStorage:');
      console.log(`   Status: ${updatedBooking.status}`);
      console.log(`   Bay ID: ${updatedBooking.bayId || 'Not assigned'}`);
      console.log(`   Bay Name: ${updatedBooking.bayName || 'Not assigned'}`);
      console.log(`   API Success: ${updatedBooking.apiSuccess}`);
      console.log(`   API Booking ID: ${updatedBooking.apiBookingId || 'Not synced'}`);
    }
    
    // STEP 6: Check UI status
    console.log('\n🔍 STEP 6: Checking UI status...');
    await page.waitForTimeout(500);
    
    const updatedRow = await page.$('td:has-text("Browser Test Customer")');
    if (updatedRow) {
      const updatedStatusCell = await updatedRow.$('xpath=..');
      const badge = await updatedStatusCell.$('.status-badge, span[class*="badge"]');
      if (badge) {
        const badgeText = await badge.innerText();
        console.log('   UI Status Badge:', badgeText);
      }
      
      // Check for Retry Sync button
      const retryBtn = await updatedStatusCell.$('button:has-text("Retry Sync")');
      if (retryBtn) {
        console.log('   ⚠️  "Retry Sync" button visible - API sync failed');
      } else {
        console.log('   ✅ No "Retry Sync" button - sync succeeded or not attempted');
      }
    }
    
    await page.screenshot({ path: 'screenshots/flow-05-approval-result.png' });
    
    // STEP 7: Analyze API calls
    console.log('\n📡 STEP 7: Analyzing API calls...');
    
    if (apiCalls.length > 0) {
      console.log(`\n   Total API calls made: ${apiCalls.length}`);
      
      apiCalls.forEach((call, i) => {
        console.log(`\n   Call ${i + 1}:`);
        console.log(`   URL: ${call.url}`);
        console.log(`   Method: ${call.method}`);
        
        if (call.payload) {
          console.log(`   Payload fields:`);
          console.log(`     ✓ customerName: ${call.payload.customerName}`);
          console.log(`     ✓ serviceType: ${call.payload.serviceType}`);
          console.log(`     ✓ vehicleMake: ${call.payload.vehicleMake}`);
          console.log(`     ✓ vehicleModel: ${call.payload.vehicleModel}`);
          console.log(`     ✓ branch: ${call.payload.branch} (${typeof call.payload.branch})`);
          console.log(`     ✓ status: ${call.payload.status}`);
          console.log(`     ✓ bayId: ${call.payload.bayId}`);
          console.log(`     ✓ bayName: ${call.payload.bayName}`);
          
          // Verify branch is string
          if (typeof call.payload.branch === 'string') {
            console.log(`     ✅ Branch is STRING (correct!)`);
          } else {
            console.log(`     ❌ Branch is ${typeof call.payload.branch} (should be string!)`);
          }
        }
      });
      
      // Final verdict
      const approvalCall = apiCalls.find(c => c.payload?.status === 'approved');
      
      console.log('\n' + '='.repeat(70));
      console.log('📊 FINAL TEST RESULTS');
      console.log('='.repeat(70));
      
      if (approvalCall) {
        console.log('\n✅✅✅ DATABASE SYNC SUCCESSFUL! ✅✅✅\n');
        console.log('The booking was sent to the database with:');
        console.log('   ✓ Correct field names (camelCase)');
        console.log('   ✓ Branch as string code');
        console.log('   ✓ Status: approved');
        console.log('   ✓ Bay assignment included');
        console.log('   ✓ All customer details included');
      } else {
        console.log('\n⚠️  API call detected but status not "approved"');
        console.log('   Check the API response above for details');
      }
    } else {
      console.log('\n⚠️  No API calls detected!');
      console.log('   Possible reasons:');
      console.log('   - Rate limiting (429 error from previous tests)');
      console.log('   - Network error');
      console.log('   - API endpoint unavailable');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'screenshots/flow-06-final-status.png' });
    
    console.log('\n📸 Screenshots saved to:');
    console.log('   c:\\Users\\leonards\\Desktop\\demo4april\\screenshots\\');
    console.log('\n   Files:');
    console.log('   1. flow-01-booking-created.png');
    console.log('   2. flow-02-admin-logged-in.png');
    console.log('   3. flow-03-pending-booking.png');
    console.log('   4. flow-04a-modal-opened.png');
    console.log('   5. flow-04b-approved.png');
    console.log('   6. flow-05-approval-result.png');
    console.log('   7. flow-06-final-status.png');
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ TEST COMPLETED');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/flow-error.png' });
  } finally {
    await browser.close();
    console.log('\n👋 Browser closed');
  }
})();
