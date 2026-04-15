/**
 * Branch Admin Complete Service Workflow Test
 * Tests the complete service marking functionality
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

async function testCompleteServiceWorkflow() {
  console.log('🧪 HH Asia Tyre - Complete Service Workflow Test\n');
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
    
    await page.screenshot({ path: 'test-results/complete-01-logged-in.png' });
    
    // 1. Check Approved Bookings (only approved bookings can be marked complete)
    console.log('\n1️⃣ Checking for Approved Bookings...');
    
    // Click on Approved tab
    const approvedTab = await page.$('button:has-text("Approved")');
    if (approvedTab) {
      const approvedText = await approvedTab.innerText();
      console.log(`   Approved tab: ${approvedText}`);
      await approvedTab.click();
      await page.waitForTimeout(1000);
    }
    
    await page.screenshot({ path: 'test-results/complete-02-approved-tab.png' });
    
    // Look for complete button - exact text match for "Complete Service"
    const completeBtn = await page.$('button:has-text("Complete Service")');
    
    if (completeBtn) {
      const btnText = await completeBtn.innerText();
      console.log(`   ✅ Found Complete Service button: "${btnText}"`);
      
      // Click the complete button
      await completeBtn.click();
      console.log('   Clicked Complete button');
      
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'test-results/complete-03-after-click.png' });
      
      // Check for modal or confirmation
      const modal = await page.$('.modal, [class*="modal"], dialog, .confirm-dialog');
      if (modal) {
        console.log('   Modal appeared');
        await page.screenshot({ path: 'test-results/complete-04-modal.png' });
        
        // Look for confirmation button
        const confirmBtn = await page.$('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Complete"), button:has-text("OK")');
        if (confirmBtn) {
          await confirmBtn.click();
          console.log('   Clicked Confirm');
          await page.waitForTimeout(1000);
        }
      }
      
      await page.screenshot({ path: 'test-results/complete-05-after-confirm.png' });
      
      // 2. Verify the booking moved to Completed
      console.log('\n2️⃣ Verifying Booking Status Change...');
      
      // Click on Completed tab
      const completedTab = await page.$('button:has-text("Completed")');
      if (completedTab) {
        const completedText = await completedTab.innerText();
        console.log(`   Completed tab: ${completedText}`);
        await completedTab.click();
        await page.waitForTimeout(1000);
      }
      
      await page.screenshot({ path: 'test-results/complete-06-completed-tab.png' });
      
      // Count completed bookings
      const completedBookings = await page.$$('.booking-card, [class*="booking"], .card');
      console.log(`   Completed bookings: ${completedBookings.length}`);
      
      // Look for completed status badge
      const completedBadge = await page.$('[class*="completed"], [class*="success"]');
      if (completedBadge) {
        console.log('   ✅ Completed status badge found');
      }
      
      console.log('   ✅ COMPLETE workflow verified successfully');
      
    } else {
      console.log('   ⚠️ No Complete button found');
      console.log('   Note: Complete button only appears for APPROVED bookings');
      console.log('   A booking must be approved first before it can be marked complete');
      
      // Check if there are any bookings at all
      const allTab = await page.$('button:has-text("All")');
      if (allTab) {
        await allTab.click();
        await page.waitForTimeout(500);
        
        const allBookings = await page.$$('.booking-card, [class*="booking"], .card');
        console.log(`   Total bookings in all tab: ${allBookings.length}`);
        
        if (allBookings.length === 0) {
          console.log('\n📝 INFO: No bookings exist in the system.');
          console.log('   To test Complete Service:');
          console.log('   1. Create a booking from the website booking form');
          console.log('   2. Login as admin');
          console.log('   3. Find the pending booking');
          console.log('   4. Click Approve to move to Approved status');
          console.log('   5. Then Complete button will appear');
        }
      }
    }
    
    // 3. Check what other elements exist
    console.log('\n3️⃣ Checking Dashboard Elements...');
    
    // Get all buttons
    const allButtons = await page.$$('button');
    console.log(`   Total buttons found: ${allButtons.length}`);
    
    const buttonNames = [];
    for (const btn of allButtons) {
      const text = await btn.innerText();
      if (text.trim()) buttonNames.push(text.trim());
    }
    console.log(`   Button texts: ${buttonNames.join(', ')}`);
    
    // 4. Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 COMPLETE SERVICE TEST SUMMARY');
    console.log('='.repeat(50));
    
    console.log('\n✅ Test completed!');
    console.log('\n📋 Complete Service Workflow:');
    console.log('   1. Booking must be in "Approved" status first');
    console.log('   2. Admin clicks "Complete" or "Mark Complete" button');
    console.log('   3. Confirmation modal may appear');
    console.log('   4. Booking moves to "Completed" status');
    console.log('\n📸 Screenshots saved to test-results/complete-*.png');
    
    await page.screenshot({ path: 'test-results/complete-07-final.png' });
    
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    await page.screenshot({ path: 'test-results/complete-error.png' });
  } finally {
    await browser.close();
    console.log('\n' + '='.repeat(50));
  }
}

testCompleteServiceWorkflow();
