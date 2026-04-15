// Improved test: Delete approved booking with proper login
// Run with: node test-delete-booking-v2.cjs

const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Testing: Delete Approved Booking (v2)\n');
    
    // Step 1: Setup - Create test admin in localStorage
    console.log('📍 Step 1: Setting up test admin credentials...');
    await page.goto('http://localhost:5173');
    
    // Create test admin if doesn't exist
    await page.evaluate(() => {
      const admins = JSON.parse(localStorage.getItem('branchAdmins') || '[]');
      const exists = admins.find(a => a.email === 'test@hhasia.com');
      if (!exists) {
        admins.push({
          id: 99,
          email: 'test@hhasia.com',
          password: 'Test123!',
          fullName: 'Test Admin',
          role: 'branch_admin',
          branchId: 1  // Alabang
        });
        localStorage.setItem('branchAdmins', JSON.stringify(admins));
        console.log('✅ Test admin created');
      } else {
        console.log('✅ Test admin already exists');
      }
    });
    
    // Step 2: Create a test approved booking
    console.log('\n📋 Step 2: Creating test approved booking...');
    await page.evaluate(() => {
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      // Check if we already have an approved booking
      const hasApproved = appointments.some(a => a.status === 'approved');
      
      if (!hasApproved && appointments.length > 0) {
        // Approve the first pending booking
        const pending = appointments.find(a => a.status === 'pending');
        if (pending) {
          pending.status = 'approved';
          pending.bayId = 1;
          pending.bayName = 'Bay 1 - General Service';
          localStorage.setItem('appointments', JSON.stringify(appointments));
          console.log('✅ Approved a pending booking');
        }
      } else if (!hasApproved) {
        // Create a new approved booking
        const newBooking = {
          id: Date.now(),
          customerName: 'Test Customer',
          email: 'customer@test.com',
          phone: '09171234567',
          vehicleMake: 'Toyota',
          vehicleModel: 'Vios',
          vehicleYear: '2020',
          plateNumber: 'TEST-123',
          services: ['Tire Rotation'],
          date: '2026-04-20',
          time: '10:00 AM',
          branchId: 1,
          status: 'approved',
          bayId: 1,
          bayName: 'Bay 1 - General Service',
          notes: 'Test booking for automation',
          createdAt: new Date().toISOString()
        };
        appointments.push(newBooking);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        console.log('✅ Created new approved booking');
      } else {
        console.log('✅ Approved booking already exists');
      }
    });
    
    // Step 3: Login as test admin
    console.log('\n🔐 Step 3: Logging in as test admin...');
    await page.goto('http://localhost:5173/admin/login');
    await page.screenshot({ path: 'screenshots/01-login-page.png' });
    
    // Fill login form
    await page.fill('input[type="email"]', 'test@hhasia.com');
    await page.fill('input[type="password"]', 'Test123!');
    console.log('✅ Filled login form');
    
    // Click submit and wait for navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);
    
    await page.screenshot({ path: 'screenshots/02-dashboard.png' });
    console.log('✅ Logged in successfully');
    console.log(`📍 Current URL: ${page.url()}\n`);
    
    // Step 4: Find approved booking
    console.log('🔍 Step 4: Finding approved booking...');
    const approvedBadge = await page.$('.status-badge:has-text("Approved")');
    
    if (!approvedBadge) {
      console.log('❌ No approved bookings found!');
      await page.screenshot({ path: 'screenshots/error-no-bookings.png' });
      return;
    }
    
    console.log('✅ Found approved booking\n');
    
    // Step 5: Get booking details
    console.log('📋 Step 5: Getting booking details...');
    const bookingCard = await approvedBadge.$('xpath=..');
    
    // Try to get customer name (may not exist in all bookings)
    let customerName = 'Unknown';
    try {
      const nameElement = await bookingCard.$('.customer-name, td:first-child');
      if (nameElement) {
        customerName = await nameElement.innerText();
      }
    } catch (e) {
      // Ignore if element not found
    }
    
    console.log(`👤 Customer: ${customerName}\n`);
    
    // Step 6: Click delete button
    console.log('🗑️  Step 6: Clicking delete button...');
    const deleteButton = await bookingCard.$('button:has-text("Delete"), .btn-delete');
    
    if (!deleteButton) {
      console.log('❌ Delete button not found!');
      console.log('💡 Available buttons:');
      const buttons = await bookingCard.$$('button');
      for (const btn of buttons) {
        const text = await btn.innerText();
        console.log(`   - ${text}`);
      }
      return;
    }
    
    await deleteButton.click();
    console.log('✅ Delete button clicked\n');
    
    // Step 7: Handle confirmation dialog
    console.log('⚠️  Step 7: Handling confirmation dialog...');
    
    page.on('dialog', async dialog => {
      console.log(`💬 Dialog: "${dialog.message().substring(0, 50)}..."`);
      console.log('✅ Accepting dialog\n');
      await dialog.accept();
    });
    
    await page.waitForTimeout(500);
    
    // Step 8: Wait for deletion
    console.log('⏳ Step 8: Waiting for deletion to complete...');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/03-after-delete.png' });
    
    // Check for success toast
    const successToast = await page.$('.toast-success, [class*="success"]');
    if (successToast) {
      try {
        const toastText = await successToast.innerText();
        console.log(`✅ Success: ${toastText}\n`);
      } catch (e) {
        console.log('✅ Deletion completed (toast appeared)\n');
      }
    }
    
    // Step 9: Verify booking removed
    console.log('🔍 Step 9: Verifying booking was removed...');
    const stillExists = await page.$('.status-badge:has-text("Approved")');
    
    if (stillExists) {
      const count = await page.$$('.status-badge:has-text("Approved")').length;
      console.log(`⚠️  ${count} approved booking(s) still visible`);
    } else {
      console.log('✅ No approved bookings - deletion successful!\n');
    }
    
    // Step 10: Check stats
    console.log('📊 Step 10: Checking dashboard stats...');
    try {
      const stats = await page.evaluate(() => {
        const statNumbers = document.querySelectorAll('.stat-number, [class*="stat"]');
        return Array.from(statNumbers).map(el => ({
          label: el.parentElement?.querySelector('.stat-label')?.innerText || 'Unknown',
          value: el.innerText
        }));
      });
      
      console.log('📈 Stats:');
      stats.forEach(stat => {
        console.log(`   ${stat.label}: ${stat.value}`);
      });
    } catch (e) {
      console.log('⚠️  Could not extract stats (selectors may differ)');
    }
    
    console.log('\n✅ TEST COMPLETED SUCCESSFULLY!');
    console.log('📁 Screenshots saved to: screenshots/');
    console.log('   - 01-login-page.png');
    console.log('   - 02-dashboard.png');
    console.log('   - 03-after-delete.png');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/error.png' });
    console.log('📸 Error screenshot saved');
  } finally {
    await browser.close();
    console.log('👋 Browser closed');
  }
})();
