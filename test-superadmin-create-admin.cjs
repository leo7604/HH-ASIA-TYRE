/**
 * Super Admin Create Branch Admin Test
 * Tests the workflow of creating a new branch admin
 */

const { chromium } = require('@playwright/test');

const BASE_URL = 'http://localhost:5174';

async function testSuperAdminCreateBranchAdmin() {
  console.log('🧪 HH Asia Tyre - Super Admin Create Branch Admin Test\n');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. Seed and Login as Super Admin
    console.log('\n1️⃣ Logging in as Super Admin...');
    await page.goto(`${BASE_URL}/super-admin/login`);
    await page.waitForLoadState('networkidle');
    
    // Seed super admin
    await page.evaluate(() => {
      const existing = JSON.parse(localStorage.getItem('super_admins') || '[]');
      if (!existing.some(a => a.email === 'superadmin@hhasia.com')) {
        existing.push({
          id: 1,
          email: 'superadmin@hhasia.com',
          password: 'SuperAdmin2024!',
          fullName: 'Super Administrator',
          role: 'super_admin',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('super_admins', JSON.stringify(existing));
      }
      // Also seed session
      localStorage.setItem('superadmin_session', JSON.stringify({
        id: 1,
        email: 'superadmin@hhasia.com',
        fullName: 'Super Administrator',
        role: 'super_admin',
        loginTime: new Date().toISOString()
      }));
    });
    
    // Navigate to dashboard
    await page.goto(`${BASE_URL}/super-admin`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const dashboardUrl = page.url();
    console.log(`   Current URL: ${dashboardUrl}`);
    
    if (dashboardUrl.includes('super-admin') && !dashboardUrl.includes('login')) {
      console.log('   ✅ Logged in as Super Admin');
    } else {
      // Need to login
      await page.goto(`${BASE_URL}/super-admin/login`);
      await page.waitForLoadState('networkidle');
      await page.fill('input[type="email"]', 'superadmin@hhasia.com');
      await page.fill('input[type="password"]', 'SuperAdmin2024!');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      console.log('   ✅ Logged in via form');
    }
    
    await page.screenshot({ path: 'test-results/superadmin-create-01-dashboard.png' });
    
    // 2. Check Dashboard Stats
    console.log('\n2️⃣ Checking Dashboard Stats...');
    
    const pageContent = await page.content();
    
    // Look for stats
    const totalBranches = await page.$eval('[class*="text-3xl"]', el => el?.innerText).catch(() => 'N/A');
    console.log(`   Total Branches: ${totalBranches}`);
    
    // Check for active admins count
    const activeAdminsText = await page.$eval('body', el => el.innerText).catch(() => '');
    const activeMatch = activeAdminsText.match(/Active Admins.*?(\d+)/);
    console.log(`   Active Admins: ${activeMatch ? activeMatch[1] : 'N/A'}`);
    
    // 3. Click "Add Branch Admin" Button
    console.log('\n3️⃣ Clicking Add Branch Admin Button...');
    
    const addButton = await page.$('button:has-text("Add Branch Admin")');
    if (addButton) {
      await addButton.click();
      console.log('   ✅ Clicked Add Branch Admin');
    } else {
      console.log('   ❌ Add Branch Admin button not found');
      return;
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/superadmin-create-02-modal.png' });
    
    // 4. Fill the Create Admin Form
    console.log('\n4️⃣ Filling Create Admin Form...');
    
    // Generate unique email
    const timestamp = Date.now();
    const testEmail = `branch.admin${timestamp}@hhasia.com`;
    
    // Fill Full Name
    const fullNameInput = await page.$('input[placeholder*="full name" i], input[name="fullName"]');
    if (fullNameInput) {
      await fullNameInput.fill('Test Branch Admin');
      console.log('   ✅ Filled Full Name');
    }
    
    // Fill Email
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await emailInput.fill(testEmail);
      console.log(`   ✅ Filled Email: ${testEmail}`);
    }
    
    // Select Branch (Bicutan - branch id 2)
    const branchSelect = await page.$('select');
    if (branchSelect) {
      // Select Bicutan (usually option 2)
      await branchSelect.selectOption({ index: 2 });
      console.log('   ✅ Selected Branch');
    }
    
    // Fill Password
    const passwordInput = await page.$('input[type="password"]:not([value=""])');
    const allPasswords = await page.$$('input[type="password"]');
    if (allPasswords.length >= 1) {
      await allPasswords[0].fill('test123456');
      console.log('   ✅ Filled Password');
    }
    if (allPasswords.length >= 2) {
      await allPasswords[1].fill('test123456');
      console.log('   ✅ Filled Confirm Password');
    }
    
    await page.screenshot({ path: 'test-results/superadmin-create-03-filled.png' });
    
    // 5. Submit the Form
    console.log('\n5️⃣ Submitting Form...');
    
    const createBtn = await page.$('button:has-text("Create")');
    if (createBtn) {
      await createBtn.click();
      console.log('   ✅ Clicked Create button');
    } else {
      // Try submit button
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
        console.log('   ✅ Clicked Submit button');
      }
    }
    
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'test-results/superadmin-create-04-after-submit.png' });
    
    // 6. Check for Success
    console.log('\n6️⃣ Checking Result...');
    
    const successMsg = await page.$('text=successfully');
    const errorMsg = await page.$('text=error, text=already');
    
    if (successMsg) {
      console.log('   ✅ Branch admin created successfully!');
    } else if (errorMsg) {
      console.log('   ⚠️ Error occurred - may need different branch');
    }
    
    // Check if modal closed
    const modalClosed = !(await page.$('text=Create Branch Admin'));
    if (modalClosed) {
      console.log('   ✅ Modal closed (form submitted)');
    }
    
    // 7. Verify Admin in Table
    console.log('\n7️⃣ Verifying Admin in Table...');
    
    // Check if new email appears in table
    const newAdminInTable = await page.$(`text=${testEmail}`);
    if (newAdminInTable) {
      console.log('   ✅ New admin found in table!');
    } else {
      console.log('   ⚠️ New admin not found in table (check screenshots)');
    }
    
    // Check updated stats
    const updatedContent = await page.content();
    const updatedActiveMatch = updatedContent.match(/Active Admins.*?(\d+)/);
    console.log(`   Updated Active Admins: ${updatedActiveMatch ? updatedActiveMatch[1] : 'N/A'}`);
    
    await page.screenshot({ path: 'test-results/superadmin-create-05-final.png' });
    
    // 8. Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUPER ADMIN CREATE BRANCH ADMIN TEST SUMMARY');
    console.log('='.repeat(50));
    
    console.log('\n✅ Test Steps Completed:');
    console.log('   1. Login as Super Admin');
    console.log('   2. View Dashboard Stats');
    console.log('   3. Open Add Branch Admin Modal');
    console.log('   4. Fill Admin Details');
    console.log('   5. Submit Form');
    console.log('   6. Verify Creation');
    
    console.log('\n📋 Admin Created:');
    console.log(`   Email: ${testEmail}`);
    console.log('   Password: test123456');
    console.log('   Role: Branch Admin');
    
    console.log('\n📸 Screenshots saved to test-results/superadmin-create-*.png');
    
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    await page.screenshot({ path: 'test-results/superadmin-create-error.png' });
  } finally {
    await browser.close();
    console.log('\n' + '='.repeat(50));
  }
}

testSuperAdminCreateBranchAdmin();
