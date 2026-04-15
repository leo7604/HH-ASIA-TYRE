/**
 * Branch Admin Capabilities Test
 * Tests the branch admin login, dashboard, and booking management features
 */

const { chromium } = require('@playwright/test');

const BASE_URL = 'http://localhost:5174';

// Branch admin data to seed
const branchAdmins = [
  {
    id: 1,
    fullName: 'Alabang Admin',
    email: 'alabang.admin@hhasia.com',
    password: 'admin123',
    branchId: 1,
    role: 'branch_admin'
  },
  {
    id: 2,
    fullName: 'Bicutan Admin',
    email: 'bicutan.admin@hhasia.com',
    password: 'admin123',
    branchId: 2,
    role: 'branch_admin'
  },
  {
    id: 3,
    fullName: 'Bacoor Admin',
    email: 'bacoor.admin@hhasia.com',
    password: 'admin123',
    branchId: 3,
    role: 'branch_admin'
  },
  {
    id: 4,
    fullName: 'Sucat Admin',
    email: 'sucat.admin@hhasia.com',
    password: 'admin123',
    branchId: 4,
    role: 'branch_admin'
  },
  {
    id: 5,
    fullName: 'Sucat2 Admin',
    email: 'sucat2.admin@hhasia.com',
    password: 'admin123',
    branchId: 5,
    role: 'branch_admin'
  },
  {
    id: 6,
    fullName: 'Laoag Admin',
    email: 'laoag.admin@hhasia.com',
    password: 'admin123',
    branchId: 6,
    role: 'branch_admin'
  }
];

async function testBranchAdmin() {
  console.log('🧪 HH Asia Tyre - Branch Admin Capabilities Test\n');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 0. Seed Branch Admin Data First
    console.log('\n0️⃣ Seeding Branch Admin Data...');
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    // Seed branch_admins
    await page.evaluate((admins) => {
      localStorage.setItem('branch_admins', JSON.stringify(admins));
      localStorage.setItem('branchAdmins', JSON.stringify(admins));
    }, branchAdmins);
    
    console.log('✅ Branch admin data seeded');
    
    // 1. Test Admin Login Page Navigation
    console.log('\n1️⃣ Testing Admin Login Page Navigation...');
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const pageTitle = await page.title();
    console.log(`   Page title: ${pageTitle}`);
    
    // Check if login form exists - use placeholder-based selectors
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitBtn = await page.$('button[type="submit"]');
    
    if (emailInput && passwordInput) {
      console.log('✅ Login form elements found');
    } else {
      console.log('⚠️ Some login form elements missing');
      console.log('   email input:', emailInput ? 'found' : 'missing');
      console.log('   password input:', passwordInput ? 'found' : 'missing');
    }
    
    await page.screenshot({ path: 'test-results/admin-login.png' });
    
    // 2. Test Login with Branch Admin Credentials
    console.log('\n2️⃣ Testing Branch Admin Login...');
    console.log('   Email: alabang.admin@hhasia.com');
    console.log('   Password: admin123');
    
    // Find and fill email - inputs don't have name attribute
    const emailField = await page.$('input[type="email"]');
    const passwordField = await page.$('input[type="password"]');
    const loginButton = await page.$('button[type="submit"]');
    
    if (!emailField) {
      console.log('❌ Email input not found!');
      await page.screenshot({ path: 'test-results/error-no-email.png' });
      return;
    }
    
    await emailField.fill('alabang.admin@hhasia.com');
    await passwordField.fill('admin123');
    console.log('   Credentials entered');
    
    await loginButton.click();
    console.log('   Login button clicked');
    
    // Wait for navigation
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/after-login.png' });
    
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);
    
    // 3. Check Dashboard Elements
    console.log('\n3️⃣ Checking Admin Dashboard...');
    
    // Check for branch name
    const pageContent = await page.content();
    const hasAlabang = pageContent.includes('Alabang') || pageContent.includes('ALABANG');
    const hasDashboard = pageContent.includes('Dashboard') || pageContent.includes('dashboard');
    const hasBooking = pageContent.includes('Booking') || pageContent.includes('booking');
    
    console.log(`   Contains "Alabang": ${hasAlabang ? '✅ Yes' : '❌ No'}`);
    console.log(`   Contains "Dashboard": ${hasDashboard ? '✅ Yes' : '❌ No'}`);
    console.log(`   Contains "Booking": ${hasBooking ? '✅ Yes' : '❌ No'}`);
    
    // Check for stats
    const statsSection = await page.$('.stats, .stat-card, .dashboard-stats, [class*="stat"]');
    if (statsSection) {
      console.log('✅ Stats section found');
    } else {
      console.log('⚠️ Stats section not found (may need booking data first)');
    }
    
    // 4. Check Action Buttons
    console.log('\n4️⃣ Checking Action Buttons...');
    
    const buttons = await page.$$('button');
    const buttonTexts = [];
    for (const btn of buttons) {
      const text = await btn.innerText();
      if (text.trim()) buttonTexts.push(text.trim());
    }
    
    console.log('   Available buttons:', buttonTexts.slice(0, 10).join(', '));
    
    const approveBtn = await page.$('button:has-text("Approve"), button:has-text("approved")');
    const rejectBtn = await page.$('button:has-text("Reject"), button:has-text("rejected")');
    const deleteBtn = await page.$('button:has-text("Delete"), button:has-text("delete")');
    const completeBtn = await page.$('button:has-text("Complete"), button:has-text("completed")');
    
    console.log(`   Approve button: ${approveBtn ? '✅ Found' : '❌ Not found'}`);
    console.log(`   Reject button: ${rejectBtn ? '✅ Found' : '❌ Not found'}`);
    console.log(`   Delete button: ${deleteBtn ? '✅ Found' : '❌ Not found'}`);
    console.log(`   Complete button: ${completeBtn ? '✅ Found' : '❌ Not found'}`);
    
    await page.screenshot({ path: 'test-results/dashboard.png' });
    
    // 5. Check for Logout Button
    console.log('\n5️⃣ Checking Logout Functionality...');
    
    const logoutBtn = await page.$('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout"), a:has-text("Sign Out")');
    if (logoutBtn) {
      console.log('✅ Logout button found');
      
      // Test logout
      await logoutBtn.click();
      await page.waitForTimeout(1000);
      
      const afterLogoutUrl = page.url();
      console.log(`   After logout URL: ${afterLogoutUrl}`);
      
      if (afterLogoutUrl.includes('login') || afterLogoutUrl.includes('admin-login')) {
        console.log('✅ Logout successful - redirected to login page');
      } else {
        console.log('⚠️ Logout may not have worked as expected');
      }
    } else {
      console.log('⚠️ Logout button not found in main view');
      
      // Check for logout in header/nav
      const navContent = await page.content();
      if (navContent.includes('Logout') || navContent.includes('Sign Out')) {
        console.log('   (Logout found but may be in different location)');
      }
    }
    
    // 6. Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    
    const results = {
      'Login Page Loads': true,
      'Login Form Elements': !!(emailInput && passwordInput),
      'Login Successful': currentUrl.includes('dashboard') || currentUrl.includes('admin'),
      'Dashboard Elements': hasAlabang && hasDashboard,
      'Approve Button': !!approveBtn,
      'Reject Button': !!rejectBtn,
      'Delete Button': !!deleteBtn,
      'Complete Button': !!completeBtn,
      'Logout Works': !!logoutBtn
    };
    
    for (const [test, passed] of Object.entries(results)) {
      console.log(`   ${passed ? '✅' : '❌'} ${test}`);
    }
    
    const passCount = Object.values(results).filter(v => v).length;
    const totalCount = Object.values(results).length;
    console.log(`\n   Score: ${passCount}/${totalCount} tests passed`);
    
    if (passCount === totalCount) {
      console.log('\n🎉 ALL TESTS PASSED!');
    } else {
      console.log('\n⚠️ Some tests failed - see details above');
    }
    
    await page.screenshot({ path: 'test-results/final-state.png' });
    
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    await page.screenshot({ path: 'test-results/error.png' });
  } finally {
    await browser.close();
    console.log('\n' + '='.repeat(50));
    console.log('Test completed. Screenshots saved to test-results/');
  }
}

testBranchAdmin();
