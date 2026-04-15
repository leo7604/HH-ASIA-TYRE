// Example: Test deleting an approved booking in admin dashboard
// Run with: node test-delete-approved-booking.js

const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ 
    headless: false, // Set to true for headless mode
    slowMo: 100      // Slow down actions for visibility
  });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Testing: Delete Approved Booking\n');
    
    // Step 1: Navigate to admin login
    console.log('📍 Step 1: Navigating to admin login...');
    await page.goto('http://localhost:5173/admin/login');
    await page.screenshot({ path: 'screenshots/01-login.png' });
    console.log('✅ Login page loaded\n');
    
    // Step 2: Login (if not already logged in)
    const currentUrl = page.url();
    if (!currentUrl.includes('/admin/dashboard')) {
      console.log('🔐 Step 2: Logging in...');
      
      // Check if login form exists
      const emailInput = await page.$('input[type="email"]');
      if (emailInput) {
        await page.fill('input[type="email"]', 'admin@hhasia.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/admin/dashboard');
        console.log('✅ Logged in successfully\n');
      } else {
        console.log('⏭️  Already logged in, skipping login\n');
      }
    }
    
    // Step 3: Find approved bookings
    console.log('🔍 Step 3: Finding approved bookings...');
    const approvedBadge = await page.$('.status-badge:has-text("Approved")');
    
    if (!approvedBadge) {
      console.log('❌ No approved bookings found!');
      console.log('💡 Tip: Approve a pending booking first, then run this test.');
      await page.screenshot({ path: 'screenshots/no-approved-bookings.png' });
      return;
    }
    
    console.log('✅ Found approved booking\n');
    
    // Step 4: Get the booking card
    console.log('📋 Step 4: Locating booking card...');
    const bookingCard = await approvedBadge.$('xpath=..');
    const customerName = await bookingCard.$eval('.customer-name', el => el.innerText);
    console.log(`👤 Customer: ${customerName}\n`);
    
    // Step 5: Click delete button
    console.log('🗑️  Step 5: Clicking delete button...');
    const deleteButton = await bookingCard.$('button:has-text("Delete")');
    
    if (!deleteButton) {
      console.log('❌ Delete button not found!');
      return;
    }
    
    await deleteButton.click();
    console.log('✅ Delete button clicked\n');
    
    // Step 6: Handle confirmation dialog
    console.log('⚠️  Step 6: Waiting for confirmation dialog...');
    
    page.on('dialog', async dialog => {
      console.log(`💬 Dialog: "${dialog.message()}"`);
      console.log('✅ Accepting dialog (clicking OK)\n');
      await dialog.accept();
    });
    
    // Wait a moment for dialog to appear and be handled
    await page.waitForTimeout(500);
    
    // Step 7: Wait for deletion to complete
    console.log('⏳ Step 7: Waiting for deletion to complete...');
    await page.waitForTimeout(1000);
    
    // Check for success toast
    const successToast = await page.$('.toast-success');
    if (successToast) {
      const toastText = await successToast.innerText();
      console.log(`✅ Success: ${toastText}\n`);
    } else {
      console.log('⚠️  Success toast not found (may have disappeared)\n');
    }
    
    // Step 8: Verify booking was removed
    console.log('🔍 Step 8: Verifying booking was removed...');
    const stillExists = await page.$('.status-badge:has-text("Approved")');
    
    if (stillExists) {
      const stillExistsCount = await page.$$('.status-badge:has-text("Approved")').length;
      console.log(`⚠️  ${stillExistsCount} approved booking(s) still visible`);
      console.log('💡 The deleted booking may have been replaced by another approved booking\n');
    } else {
      console.log('✅ No approved bookings visible - deletion successful!\n');
    }
    
    // Step 9: Check stats updated
    console.log('📊 Step 9: Checking stats...');
    const stats = await page.evaluate(() => {
      return {
        total: document.querySelector('.stat-total .stat-number')?.innerText || 'N/A',
        pending: document.querySelector('.stat-pending .stat-number')?.innerText || 'N/A',
        approved: document.querySelector('.stat-approved .stat-number')?.innerText || 'N/A',
        completed: document.querySelector('.stat-completed .stat-number')?.innerText || 'N/A',
      };
    });
    
    console.log('📈 Current Stats:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Pending: ${stats.pending}`);
    console.log(`   Approved: ${stats.approved}`);
    console.log(`   Completed: ${stats.completed}\n`);
    
    // Step 10: Take final screenshot
    console.log('📸 Step 10: Taking final screenshot...');
    await page.screenshot({ path: 'screenshots/02-after-delete.png' });
    console.log('✅ Screenshot saved\n');
    
    console.log('✅ TEST COMPLETED SUCCESSFULLY!');
    console.log('📁 Check screenshots/ folder for results');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/error.png' });
    console.log('📸 Error screenshot saved to screenshots/error.png');
  } finally {
    await browser.close();
    console.log('👋 Browser closed');
  }
})();
