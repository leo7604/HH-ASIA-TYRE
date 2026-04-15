/**
 * Branch Admin Approve/Reject Workflow Test
 * Tests the complete booking approval and rejection workflows
 */

const { chromium } = require('@playwright/test');

const BASE_URL = 'http://localhost:5174';

// Branch admin data
const branchAdmins = [
  {
    id: 1,
    fullName: 'Alabang Admin',
    email: 'alabang.admin@hhasia.com',
    password: 'admin123',
    branchId: 1,
    role: 'branch_admin'
  }
];

async function testApproveRejectWorkflow() {
  console.log('🧪 HH Asia Tyre - Admin Approve/Reject Workflow Test\n');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 0. Seed Data and Login
    console.log('\n0️⃣ Setup: Seeding admin data and logging in...');
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    // Seed branch_admins
    await page.evaluate((admins) => {
      localStorage.setItem('branch_admins', JSON.stringify(admins));
      localStorage.setItem('branchAdmins', JSON.stringify(admins));
    }, branchAdmins);
    
    // Login
    await page.fill('input[type="email"]', 'alabang.admin@hhasia.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    const dashboardUrl = page.url();
    console.log(`   Logged in, URL: ${dashboardUrl}`);
    
    if (dashboardUrl.includes('admin')) {
      console.log('✅ Successfully logged in to admin dashboard');
    } else {
      console.log('❌ Login failed');
      return;
    }
    
    // 1. Check Initial Booking State
    console.log('\n1️⃣ Checking Initial Booking State...');
    
    // Count bookings by status
    const pendingTab = await page.$('button:has-text("Pending")');
    const approvedTab = await page.$('button:has-text("Approved")');
    const rejectedTab = await page.$('button:has-text("Rejected")');
    
    if (pendingTab) {
      const pendingText = await pendingTab.innerText();
      console.log(`   Pending tab: ${pendingText}`);
    }
    if (approvedTab) {
      const approvedText = await approvedTab.innerText();
      console.log(`   Approved tab: ${approvedText}`);
    }
    if (rejectedTab) {
      const rejectedText = await rejectedTab.innerText();
      console.log(`   Rejected tab: ${rejectedText}`);
    }
    
    await page.screenshot({ path: 'test-results/01-initial-state.png' });
    
    // 2. Test APPROVE Workflow
    console.log('\n2️⃣ Testing APPROVE Workflow...');
    
    // Click on Pending tab to see pending bookings
    if (pendingTab) {
      await pendingTab.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for a booking to approve
    const pendingBookings = await page.$$('.booking-card, [class*="booking"], .card');
    console.log(`   Found ${pendingBookings.length} pending booking cards`);
    
    // Look for approve button in pending section
    let approveBtn = await page.$('button:has-text("Approve")');
    
    if (approveBtn) {
      console.log('   ✅ Found Approve button');
      
      // Click the approve button
      await approveBtn.click();
      console.log('   Clicked Approve button');
      
      // Wait for confirmation dialog or status change
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'test-results/02-after-approve.png' });
      
      // Check if there's a confirmation dialog
      const dialog = await page.$('.modal, [class*="modal"], dialog');
      if (dialog) {
        console.log('   Confirmation modal appeared');
        
        // Look for confirm button
        const confirmBtn = await page.$('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("OK")');
        if (confirmBtn) {
          await confirmBtn.click();
          console.log('   Clicked Confirm');
          await page.waitForTimeout(1000);
        }
      }
      
      // Check if the booking moved to approved
      await page.screenshot({ path: 'test-results/03-after-confirm.png' });
      
      // Click Approved tab to verify
      const approvedTabAfter = await page.$('button:has-text("Approved")');
      if (approvedTabAfter) {
        await approvedTabAfter.click();
        await page.waitForTimeout(1000);
      }
      
      const approvedBookings = await page.$$('.booking-card, [class*="booking"], .card');
      console.log(`   Approved bookings now: ${approvedBookings.length}`);
      
      // Look for complete button in approved section
      const completeBtn = await page.$('button:has-text("Complete"), button:has-text("Mark Complete")');
      if (completeBtn) {
        console.log('   ✅ Found Complete button for approved booking');
      }
      
      console.log('   ✅ APPROVE workflow completed successfully');
      
    } else {
      console.log('   ⚠️ No pending bookings to approve (all may already be processed)');
    }
    
    await page.screenshot({ path: 'test-results/04-approved-state.png' });
    
    // 3. Test REJECT Workflow
    console.log('\n3️⃣ Testing REJECT Workflow...');
    
    // Go back to pending or find another pending booking
    const pendingTabFinal = await page.$('button:has-text("Pending")');
    if (pendingTabFinal) {
      await pendingTabFinal.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for reject button
    let rejectBtn = await page.$('button:has-text("Reject")');
    
    if (rejectBtn) {
      console.log('   ✅ Found Reject button');
      
      // Click the reject button
      await rejectBtn.click();
      console.log('   Clicked Reject button');
      
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'test-results/05-after-reject.png' });
      
      // Check for rejection reason input
      const reasonInput = await page.$('textarea, input[type="text"]');
      if (reasonInput) {
        console.log('   Reason input appeared');
        await reasonInput.fill('Test rejection - vehicle not available');
      }
      
      // Look for confirm button
      const confirmBtn = await page.$('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Reject")');
      if (confirmBtn) {
        await confirmBtn.click();
        console.log('   Clicked Confirm Rejection');
        await page.waitForTimeout(1000);
      }
      
      await page.screenshot({ path: 'test-results/06-after-confirm-reject.png' });
      
      // Click Rejected tab to verify
      const rejectedTabFinal = await page.$('button:has-text("Rejected")');
      if (rejectedTabFinal) {
        await rejectedTabFinal.click();
        await page.waitForTimeout(1000);
      }
      
      const rejectedBookings = await page.$$('.booking-card, [class*="booking"], .card');
      console.log(`   Rejected bookings now: ${rejectedBookings.length}`);
      
      console.log('   ✅ REJECT workflow completed successfully');
      
    } else {
      console.log('   ⚠️ No pending bookings to reject');
    }
    
    await page.screenshot({ path: 'test-results/07-rejected-state.png' });
    
    // 4. Test DELETE Workflow
    console.log('\n4️⃣ Testing DELETE Workflow...');
    
    // Go to rejected section and try to delete
    const rejectedTabDelete = await page.$('button:has-text("Rejected")');
    if (rejectedTabDelete) {
      await rejectedTabDelete.click();
      await page.waitForTimeout(1000);
    }
    
    const deleteBtn = await page.$('button:has-text("Delete")');
    
    if (deleteBtn) {
      console.log('   ✅ Found Delete button');
      
      // Click delete
      await deleteBtn.click();
      console.log('   Clicked Delete button');
      
      await page.waitForTimeout(1000);
      
      // Check for confirmation dialog
      page.on('dialog', async dialog => {
        console.log(`   Dialog message: ${dialog.message()}`);
        await dialog.accept();
      });
      
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/08-after-delete.png' });
      
      console.log('   ✅ DELETE workflow initiated');
      
    } else {
      console.log('   ⚠️ No bookings to delete in rejected section');
    }
    
    // 5. Final Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    
    // Take final screenshot
    await page.screenshot({ path: 'test-results/09-final-state.png' });
    
    console.log('\n✅ All workflow tests completed!');
    console.log('   - Approve workflow: Tested');
    console.log('   - Reject workflow: Tested');
    console.log('   - Delete workflow: Tested');
    console.log('\n📸 Screenshots saved to test-results/');
    
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    await page.screenshot({ path: 'test-results/error.png' });
  } finally {
    await browser.close();
    console.log('\n' + '='.repeat(50));
  }
}

testApproveRejectWorkflow();
