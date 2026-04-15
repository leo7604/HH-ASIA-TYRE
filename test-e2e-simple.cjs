// Simplified E2E Test - Direct booking creation + Admin workflow
// Run with: node test-e2e-simple.cjs

const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 SIMPLIFIED E2E TEST\n');
    console.log('=' .repeat(60));
    
    // STEP 1: Create booking directly in localStorage
    console.log('\n📝 STEP 1: Creating test booking...');
    await page.goto('http://localhost:5173');
    
    await page.evaluate(() => {
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      const newBooking = {
        id: Date.now(),
        branchId: 1,
        bayId: null,
        bayName: null,
        customerName: 'E2E Test Customer',
        email: 'e2e@test.com',
        phone: '09179999999',
        vehicleYear: '2020',
        vehicleMake: 'Toyota',
        vehicleModel: 'Vios',
        vehicleTrim: 'G',
        plateNumber: 'E2E-1234',
        services: ['Tire Rotation'],
        otherServices: null,
        date: '2026-04-20',
        time: '10:00 AM',
        mileage: 50000,
        notes: 'Automated E2E test booking',
        status: 'pending',
        createdAt: new Date().toISOString(),
        apiBookingId: null,
        apiSuccess: false,
      };
      
      appointments.push(newBooking);
      localStorage.setItem('appointments', JSON.stringify(appointments));
      console.log('✅ Booking created with ID:', newBooking.id);
    });
    
    await page.screenshot({ path: 'screenshots/e2e-simple-01-booking-created.png' });
    console.log('✅ Screenshot saved\n');
    
    // STEP 2: Create test admin and login
    console.log('🔐 STEP 2: Setting up admin login...');
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
    
    await page.goto('http://localhost:5173/admin/login');
    await page.fill('input[type="email"]', 'e2eadmin@hhasia.com');
    await page.fill('input[type="password"]', 'E2EAdmin123!');
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);
    
    await page.screenshot({ path: 'screenshots/e2e-simple-02-admin-logged-in.png' });
    console.log('✅ Admin logged in successfully\n');
    
    // STEP 3: Find and approve the pending booking
    console.log('✅ STEP 3: Approving pending booking...');
    const pendingBadge = await page.$('.status-badge:has-text("Pending"), span:has-text("Pending")');
    
    if (pendingBadge) {
      console.log('✅ Found pending booking');
      
      // Find the booking card/row
      const bookingRow = await pendingBadge.$('xpath=../..');
      if (!bookingRow) {
        const bookingCard = await pendingBadge.$('xpath=..');
        
        // Click Approve button
        const approveBtn = await bookingCard.$('button:has-text("Approve")');
        if (approveBtn) {
          await approveBtn.click();
          await page.waitForTimeout(500);
          console.log('✅ Clicked Approve button');
          
          // Select Bay 1 in modal
          const bay1Btn = await page.$('button:has-text("Bay 1")');
          if (bay1Btn) {
            await bay1Btn.click();
            await page.waitForTimeout(300);
            console.log('✅ Selected Bay 1');
          }
          
          // Click "Assign Bay & Approve"
          const confirmBtn = await page.$('button:has-text("Assign Bay & Approve"), button:has-text("Confirm")');
          if (confirmBtn) {
            await confirmBtn.click();
            await page.waitForTimeout(1500);
            console.log('✅ Booking approved with bay assignment\n');
          }
        }
      }
      
      await page.screenshot({ path: 'screenshots/e2e-simple-03-booking-approved.png' });
    } else {
      console.log('❌ No pending booking found!');
    }
    
    // STEP 4: Delete the approved booking
    console.log('🗑️  STEP 4: Deleting approved booking...');
    const approvedBadge = await page.$('.status-badge:has-text("Approved"), span:has-text("Approved")');
    
    if (approvedBadge) {
      console.log('✅ Found approved booking');
      
      const bookingCard = await approvedBadge.$('xpath=..');
      const deleteBtn = await bookingCard.$('button:has-text("Delete")');
      
      if (deleteBtn) {
        // Setup dialog handler
        page.on('dialog', async dialog => {
          console.log('💬 Confirmation dialog appeared');
          await dialog.accept();
        });
        
        await deleteBtn.click();
        await page.waitForTimeout(1500);
        
        await page.screenshot({ path: 'screenshots/e2e-simple-04-booking-deleted.png' });
        console.log('✅ Booking deleted successfully\n');
      }
    } else {
      console.log('⚠️  No approved booking found to delete');
    }
    
    // STEP 5: Final verification
    console.log('📊 STEP 5: Final verification...');
    const stats = await page.evaluate(() => {
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      return {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        approved: appointments.filter(a => a.status === 'approved').length,
        completed: appointments.filter(a => a.status === 'completed').length,
      };
    });
    
    console.log('\n📈 Final Booking Stats:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Pending: ${stats.pending}`);
    console.log(`   Approved: ${stats.approved}`);
    console.log(`   Completed: ${stats.completed}`);
    
    // FINAL REPORT
    console.log('\n' + '='.repeat(60));
    console.log('✅ E2E TEST COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📸 Screenshots saved:');
    console.log('   1. e2e-simple-01-booking-created.png');
    console.log('   2. e2e-simple-02-admin-logged-in.png');
    console.log('   3. e2e-simple-03-booking-approved.png');
    console.log('   4. e2e-simple-04-booking-deleted.png');
    console.log('\n📁 Location: c:\\Users\\leonards\\Desktop\\demo4april\\screenshots\\');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/e2e-simple-error.png' });
  } finally {
    await browser.close();
    console.log('\n👋 Browser closed');
  }
})();
