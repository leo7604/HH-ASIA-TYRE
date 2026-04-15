// Test: Database Sync - Improved with better selectors
// Run with: node test-db-sync-v2.cjs

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
    if (request.url().includes('/api/') || request.url().includes('vercel.app')) {
      console.log('\n🌐 API REQUEST DETECTED:');
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
    if (response.url().includes('/api/') || response.url().includes('vercel.app')) {
      console.log('\n📡 API RESPONSE:');
      console.log('   Status:', response.status());
      console.log('   URL:', response.url());
    }
  });
  
  try {
    console.log('🚀 DATABASE SYNC TEST V2\n');
    console.log('=' .repeat(60));
    
    // STEP 1: Create booking
    console.log('\n📝 STEP 1: Creating booking request...');
    await page.goto('http://localhost:5173');
    
    await page.evaluate(() => {
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const exists = appointments.find(a => a.customerName === 'DB Sync Test');
      
      if (!exists) {
        appointments.push({
          id: Date.now(),
          branchId: 1,
          bayId: null,
          bayName: null,
          customerName: 'DB Sync Test',
          email: 'dbsync@test.com',
          phone: '09177777777',
          vehicleYear: '2022',
          vehicleMake: 'Mazda',
          vehicleModel: '3',
          plateNumber: 'SYNC-999',
          services: ['Brake Service'],
          date: '2026-04-25',
          time: '3:00 PM',
          status: 'pending',
          createdAt: new Date().toISOString(),
          apiBookingId: null,
          apiSuccess: false,
        });
        localStorage.setItem('appointments', JSON.stringify(appointments));
      }
    });
    
    console.log('✅ Booking created\n');
    
    // STEP 2: Login as admin
    console.log('🔐 STEP 2: Admin login...');
    await page.evaluate(() => {
      const admins = JSON.parse(localStorage.getItem('branchAdmins') || '[]');
      const exists = admins.find(a => a.email === 'admin@hhasia.com');
      
      if (!exists) {
        admins.push({
          id: 50,
          email: 'admin@hhasia.com',
          password: 'Admin123!',
          fullName: 'Test Admin',
          role: 'branch_admin',
          branchId: 1
        });
        localStorage.setItem('branchAdmins', JSON.stringify(admins));
      }
    });
    
    await page.goto('http://localhost:5173/admin/login');
    await page.fill('input[type="email"]', 'admin@hhasia.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle' });
    
    console.log('✅ Logged in\n');
    await page.screenshot({ path: 'screenshots/db-v2-01-dashboard.png' });
    
    // STEP 3: Debug - see what buttons are available
    console.log('🔍 STEP 3: Analyzing page structure...');
    await page.waitForTimeout(1000);
    
    // Get all buttons on the page
    const buttons = await page.evaluate(() => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      return allButtons.map(btn => ({
        text: btn.innerText.trim(),
        className: btn.className,
        visible: btn.offsetParent !== null
      })).filter(b => b.visible);
    });
    
    console.log('\n📋 Available buttons:');
    buttons.forEach((btn, i) => {
      console.log(`   ${i + 1}. "${btn.text}"`);
    });
    
    // Find the pending booking
    const pendingBadge = await page.$('span:has-text("Pending"), .badge:has-text("Pending"), [class*="pending"]');
    
    if (!pendingBadge) {
      console.log('\n❌ No pending booking found!');
      await page.screenshot({ path: 'screenshots/db-v2-error.png' });
      return;
    }
    
    console.log('\n✅ Found pending booking');
    await page.screenshot({ path: 'screenshots/db-v2-02-pending.png' });
    
    // STEP 4: Find and click Approve button
    console.log('\n✅ STEP 4: Approving booking...');
    
    // Try multiple selectors for the Approve button
    let approveBtn = null;
    const selectors = [
      'button:has-text("Approve")',
      'button.bg-green-500\\/20',
      'text-green-400:has-text("Approve")'
    ];
    
    for (const selector of selectors) {
      try {
        approveBtn = await page.$(selector);
        if (approveBtn) {
          console.log(`✅ Found Approve button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (approveBtn) {
      console.log('🔘 Clicking Approve...');
      await approveBtn.click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'screenshots/db-v2-03-modal.png' });
      
      // Check if modal appeared
      const modalContent = await page.$('.modal, [class*="modal"], [class*="backdrop"]');
      
      if (modalContent) {
        console.log('✅ Bay assignment modal appeared');
        
        // Find and click Bay 1
        const bayButtons = await page.$$('button');
        for (const btn of bayButtons) {
          const text = await btn.innerText();
          if (text.includes('Bay 1')) {
            console.log('🏢 Selecting Bay 1...');
            await btn.click();
            await page.waitForTimeout(500);
            break;
          }
        }
        
        // Find and click confirm button
        const confirmSelectors = [
          'button:has-text("Assign Bay & Approve")',
          'button:has-text("Confirm")',
          'button.bg-brand-yellow'
        ];
        
        for (const selector of confirmSelectors) {
          const confirmBtn = await page.$(selector);
          if (confirmBtn) {
            console.log('🔘 Clicking confirm...');
            await confirmBtn.click();
            console.log('⏳ Waiting for API call...');
            await page.waitForTimeout(3000);
            break;
          }
        }
        
        await page.screenshot({ path: 'screenshots/db-v2-04-approved.png' });
        console.log('✅ Approval process completed\n');
      } else {
        console.log('⚠️  No modal appeared - may have approved directly');
        await page.waitForTimeout(2000);
      }
    } else {
      console.log('❌ Could not find Approve button');
    }
    
    // STEP 5: Check results
    console.log('📊 STEP 5: Checking results...\n');
    
    // Check localStorage
    const bookingData = await page.evaluate(() => {
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      return appointments.find(a => a.customerName === 'DB Sync Test');
    });
    
    if (bookingData) {
      console.log('📋 Booking Status:');
      console.log(`   Status: ${bookingData.status}`);
      console.log(`   Bay ID: ${bookingData.bayId || 'Not assigned'}`);
      console.log(`   Bay Name: ${bookingData.bayName || 'Not assigned'}`);
      console.log(`   API Success: ${bookingData.apiSuccess}`);
      console.log(`   API Booking ID: ${bookingData.apiBookingId || 'Not synced'}`);
    }
    
    // Check API calls
    console.log('\n🌐 API Calls Made:');
    if (apiCalls.length > 0) {
      apiCalls.forEach((call, i) => {
        console.log(`\n   Call ${i + 1}:`);
        console.log(`   URL: ${call.url}`);
        console.log(`   Method: ${call.method}`);
        if (call.payload) {
          console.log(`   branchId: ${call.payload.branchId}`);
          console.log(`   status: ${call.payload.status}`);
          console.log(`   customerName: ${call.payload.customerName}`);
          console.log(`   bayId: ${call.payload.bayId || 'null'}`);
          console.log(`   bayName: ${call.payload.bayName || 'null'}`);
        }
      });
      
      const approvalCall = apiCalls.find(c => c.payload?.status === 'approved');
      if (approvalCall) {
        console.log('\n✅✅✅ DATABASE SYNC SUCCESSFUL! ✅✅✅');
        console.log('   The approved booking was sent to the database!');
      }
    } else {
      console.log('   ⚠️  No API calls to Vercel detected');
      console.log('   💡 The API may be down or network error occurred');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'screenshots/db-v2-05-final.png' });
    
    // REPORT
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST REPORT');
    console.log('='.repeat(60));
    
    if (bookingData?.status === 'approved') {
      console.log('\n✅ Booking Status: APPROVED');
    } else {
      console.log('\n⚠️  Booking Status:', bookingData?.status || 'Not found');
    }
    
    if (apiCalls.length > 0) {
      console.log('✅ Database Sync: ATTEMPTED');
      console.log(`   API Calls: ${apiCalls.length}`);
    } else {
      console.log('⚠️  Database Sync: NOT ATTEMPTED');
    }
    
    console.log('\n📸 Screenshots:');
    console.log('   1. db-v2-01-dashboard.png');
    console.log('   2. db-v2-02-pending.png');
    console.log('   3. db-v2-03-modal.png');
    console.log('   4. db-v2-04-approved.png');
    console.log('   5. db-v2-05-final.png');
    console.log('\n📁 Location: screenshots/ folder');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST COMPLETED');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/db-v2-error.png' });
  } finally {
    await browser.close();
    console.log('\n👋 Browser closed');
  }
})();
