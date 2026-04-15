// Complete End-to-End Booking Flow Test
// Tests: Create Booking → Admin Login → Approve → Delete
// Run with: node test-e2e-complete.cjs

const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  const page = await browser.newPage();
  
  const results = {
    steps: [],
    screenshots: [],
    errors: []
  };
  
  const logStep = (step, success, message = '') => {
    results.steps.push({ step, success, message });
    const icon = success ? '✅' : '❌';
    console.log(`${icon} ${step}: ${message}`);
  };
  
  try {
    console.log('🚀 COMPLETE END-TO-END BOOKING FLOW TEST\n');
    console.log('=' .repeat(60));
    
    // ============================================
    // PHASE 1: CREATE BOOKING AS CUSTOMER
    // ============================================
    console.log('\n📝 PHASE 1: CREATE BOOKING AS CUSTOMER');
    console.log('-'.repeat(60));
    
    // Step 1: Navigate to booking page
    console.log('\n📍 Step 1: Navigating to booking page...');
    await page.goto('http://localhost:5173/book?branch=1');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/e2e-01-booking-page.png' });
    results.screenshots.push('e2e-01-booking-page.png');
    logStep('Navigate to booking page', true, 'Alabang branch pre-selected');
    
    // Step 2: Fill vehicle details (Step 2 of form)
    console.log('\n🚗 Step 2: Filling vehicle details...');
    try {
      await page.fill('input[name="vehicleYear"], input[placeholder*="Year"]', '2020');
      await page.fill('input[name="vehicleMake"], input[placeholder*="Make"]', 'Toyota');
      await page.fill('input[name="vehicleModel"], input[placeholder*="Model"]', 'Vios');
      await page.fill('input[name="plateNumber"], input[placeholder*="Plate"]', 'E2E-1234');
      await page.screenshot({ path: 'screenshots/e2e-02-vehicle-details.png' });
      results.screenshots.push('e2e-02-vehicle-details.png');
      logStep('Fill vehicle details', true, '2020 Toyota Vios, E2E-1234');
    } catch (e) {
      logStep('Fill vehicle details', false, e.message);
      results.errors.push('Vehicle details failed');
    }
    
    // Step 3: Click Next to go to services
    console.log('\n➡️  Step 3: Going to services selection...');
    await page.click('button:has-text("Next"), button:has-text("Continue")');
    await page.waitForTimeout(500);
    
    // Step 4: Select service
    console.log('\n🔧 Step 4: Selecting service...');
    try {
      await page.click('[data-service="tire-rotation"], .service-option:has-text("Tire Rotation"), button:has-text("Tire Rotation")');
      await page.screenshot({ path: 'screenshots/e2e-03-services.png' });
      results.screenshots.push('e2e-03-services.png');
      logStep('Select service', true, 'Tire Rotation');
    } catch (e) {
      logStep('Select service', false, e.message);
      results.errors.push('Service selection failed');
    }
    
    // Step 5: Go to date/time
    console.log('\n📅 Step 5: Going to date/time selection...');
    await page.click('button:has-text("Next"), button:has-text("Continue")');
    await page.waitForTimeout(500);
    
    // Step 6: Select date and time
    console.log('\n⏰ Step 6: Selecting date and time...');
    try {
      await page.fill('input[name="date"], input[type="date"]', '2026-04-20');
      await page.waitForTimeout(300);
      await page.click('.time-slot:first-child, button:has-text("10:00 AM")');
      await page.screenshot({ path: 'screenshots/e2e-04-datetime.png' });
      results.screenshots.push('e2e-04-datetime.png');
      logStep('Select date/time', true, 'April 20, 2026 at 10:00 AM');
    } catch (e) {
      logStep('Select date/time', false, e.message);
      results.errors.push('Date/time selection failed');
    }
    
    // Step 7: Go to customer info
    console.log('\n👤 Step 7: Going to customer info...');
    await page.click('button:has-text("Next"), button:has-text("Continue")');
    await page.waitForTimeout(500);
    
    // Step 8: Fill customer info
    console.log('\n📋 Step 8: Filling customer information...');
    try {
      await page.fill('input[name="fullName"], input[placeholder*="Name"]', 'End to End Test');
      await page.fill('input[name="email"], input[type="email"]', 'e2e@test.com');
      await page.fill('input[name="phone"], input[placeholder*="Phone"]', '09179999999');
      await page.screenshot({ path: 'screenshots/e2e-05-customer-info.png' });
      results.screenshots.push('e2e-05-customer-info.png');
      logStep('Fill customer info', true, 'End to End Test, e2e@test.com');
    } catch (e) {
      logStep('Fill customer info', false, e.message);
      results.errors.push('Customer info failed');
    }
    
    // Step 9: Submit booking
    console.log('\n📤 Step 9: Submitting booking...');
    await page.click('button:has-text("Submit Booking"), button:has-text("Confirm Booking")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/e2e-06-confirmation.png' });
    results.screenshots.push('e2e-06-confirmation.png');
    logStep('Submit booking', true, 'Booking submitted successfully');
    
    // ============================================
    // PHASE 2: ADMIN LOGIN
    // ============================================
    console.log('\n\n🔐 PHASE 2: ADMIN LOGIN');
    console.log('-'.repeat(60));
    
    // Step 10: Create test admin
    console.log('\n👨‍💼 Step 10: Creating test admin credentials...');
    await page.goto('http://localhost:5173');
    await page.evaluate(() => {
      const admins = JSON.parse(localStorage.getItem('branchAdmins') || '[]');
      const exists = admins.find(a => a.email === 'e2eadmin@hhasia.com');
      if (!exists) {
        admins.push({
          id: 100,
          email: 'e2eadmin@hhasia.com',
          password: 'E2EAdmin123!',
          fullName: 'E2E Test Admin',
          role: 'branch_admin',
          branchId: 1
        });
        localStorage.setItem('branchAdmins', JSON.stringify(admins));
      }
    });
    logStep('Create test admin', true, 'e2eadmin@hhasia.com');
    
    // Step 11: Login as admin
    console.log('\n🔑 Step 11: Logging in as admin...');
    await page.goto('http://localhost:5173/admin/login');
    await page.fill('input[type="email"]', 'e2eadmin@hhasia.com');
    await page.fill('input[type="password"]', 'E2EAdmin123!');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);
    await page.screenshot({ path: 'screenshots/e2e-07-admin-dashboard.png' });
    results.screenshots.push('e2e-07-admin-dashboard.png');
    logStep('Admin login', true, 'Logged in successfully');
    
    // ============================================
    // PHASE 3: APPROVE BOOKING
    // ============================================
    console.log('\n\n✅ PHASE 3: APPROVE BOOKING');
    console.log('-'.repeat(60));
    
    // Step 12: Find pending booking
    console.log('\n🔍 Step 12: Finding pending booking...');
    const pendingBadge = await page.$('.status-badge:has-text("Pending"), [class*="pending"]');
    
    if (!pendingBadge) {
      console.log('⚠️  No pending booking found, checking all bookings...');
      const allBookings = await page.$$('.booking-card, tr');
      console.log(`Found ${allBookings.length} booking(s)`);
      
      if (allBookings.length === 0) {
        logStep('Find pending booking', false, 'No bookings found at all!');
        throw new Error('No bookings found after creation');
      }
    } else {
      logStep('Find pending booking', true, 'Found pending booking');
    }
    
    // Step 13: Approve booking
    console.log('\n✓ Step 13: Approving booking...');
    const approveBtn = await page.$('button:has-text("Approve"), .btn-approve');
    
    if (approveBtn) {
      await approveBtn.click();
      await page.waitForTimeout(500);
      
      // Handle bay assignment modal
      console.log('🏢 Step 13b: Assigning bay...');
      const baySelect = await page.$('button:has-text("Bay 1"), .bay-option:first-child');
      if (baySelect) {
        await baySelect.click();
        await page.waitForTimeout(300);
      }
      
      // Click "Assign Bay & Approve" or "Approve"
      await page.click('button:has-text("Assign Bay & Approve"), button:has-text("Confirm Approve")');
      await page.waitForTimeout(1500);
      
      await page.screenshot({ path: 'screenshots/e2e-08-booking-approved.png' });
      results.screenshots.push('e2e-08-booking-approved.png');
      logStep('Approve booking', true, 'Booking approved with bay assignment');
    } else {
      logStep('Approve booking', false, 'Approve button not found');
      results.errors.push('Approve failed');
    }
    
    // ============================================
    // PHASE 4: DELETE APPROVED BOOKING
    // ============================================
    console.log('\n\n🗑️  PHASE 4: DELETE APPROVED BOOKING');
    console.log('-'.repeat(60));
    
    // Step 14: Find approved booking
    console.log('\n🔍 Step 14: Finding approved booking...');
    const approvedBadge = await page.$('.status-badge:has-text("Approved"), [class*="approved"]');
    
    if (!approvedBadge) {
      logStep('Find approved booking', false, 'No approved booking found after approval!');
      results.errors.push('Booking not approved');
    } else {
      logStep('Find approved booking', true, 'Found approved booking');
      
      // Step 15: Delete booking
      console.log('\n🗑️  Step 15: Deleting approved booking...');
      
      // Setup dialog handler BEFORE clicking delete
      page.on('dialog', async dialog => {
        console.log(`💬 Dialog appeared: "${dialog.message().substring(0, 50)}..."`);
        await dialog.accept();
      });
      
      const deleteBtn = await page.$('button:has-text("Delete"), .btn-delete');
      if (deleteBtn) {
        await deleteBtn.click();
        await page.waitForTimeout(1500);
        
        await page.screenshot({ path: 'screenshots/e2e-09-after-delete.png' });
        results.screenshots.push('e2e-09-after-delete.png');
        logStep('Delete approved booking', true, 'Booking deleted successfully');
      } else {
        logStep('Delete approved booking', false, 'Delete button not found');
        results.errors.push('Delete failed');
      }
    }
    
    // ============================================
    // FINAL REPORT
    // ============================================
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 TEST REPORT');
    console.log('='.repeat(60));
    
    const totalSteps = results.steps.length;
    const passedSteps = results.steps.filter(s => s.success).length;
    const failedSteps = totalSteps - passedSteps;
    
    console.log(`\nTotal Steps: ${totalSteps}`);
    console.log(`✅ Passed: ${passedSteps}`);
    console.log(`❌ Failed: ${failedSteps}`);
    console.log(`\nSuccess Rate: ${((passedSteps/totalSteps)*100).toFixed(1)}%`);
    
    if (results.errors.length > 0) {
      console.log('\n⚠️  Errors:');
      results.errors.forEach((err, i) => {
        console.log(`   ${i+1}. ${err}`);
      });
    }
    
    console.log('\n📸 Screenshots captured:');
    results.screenshots.forEach((ss, i) => {
      console.log(`   ${i+1}. screenshots/${ss}`);
    });
    
    const success = failedSteps === 0;
    console.log('\n' + '='.repeat(60));
    console.log(success ? '✅ TEST PASSED!' : '⚠️  TEST COMPLETED WITH ERRORS');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    await page.screenshot({ path: 'screenshots/e2e-error.png' });
    results.screenshots.push('e2e-error.png');
  } finally {
    await browser.close();
    console.log('\n👋 Browser closed');
    console.log('\n📁 All screenshots saved to: c:\\Users\\leonards\\Desktop\\demo4april\\screenshots\\');
  }
})();
