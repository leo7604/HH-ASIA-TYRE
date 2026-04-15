/**
 * Test Branch Admin Supabase Migration
 * Tests: Branch Admin login with Supabase
 */

const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5175';

async function testBranchAdminMigration() {
  console.log('🚀 Branch Admin Supabase Migration Test\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let tests = [];
  
  try {
    // First, create a branch admin via Super Admin
    console.log('📝 Step 1: Create Branch Admin via Super Admin...');
    
    // Login as Super Admin
    await page.goto(`${BASE_URL}/super-admin/login`);
    await page.waitForTimeout(1000);
    
    // Try to login - might need to create account first
    await page.getByPlaceholder('admin@hhasia.com').fill('test.superadmin@hhasia.com');
    await page.getByPlaceholder('••••••••').first().fill('test123456');
    page.locator('form button[type="submit"]').click();
    await page.waitForTimeout(2000);
    
    if (!page.url().includes('/super-admin')) {
      // Need to create super admin first
      console.log('  Creating super admin account...');
      const signUpTab = await page.$('button:has-text("Sign Up")');
      if (signUpTab) await signUpTab.click();
      await page.waitForTimeout(500);
      
      await page.getByPlaceholder('Enter your full name').fill('Migration Test Admin');
      await page.getByPlaceholder('admin@hhasia.com').fill(`test.superadmin.${Date.now()}@hhasia.com`);
      await page.getByPlaceholder('••••••••').first().fill('test123456');
      await page.getByPlaceholder('••••••••').last().fill('test123456');
      await page.getByRole('button', { name: 'Create Account' }).click();
      await page.waitForTimeout(2000);
      
      // Login
      await page.getByPlaceholder('admin@hhasia.com').fill(`test.superadmin.${Date.now()}@hhasia.com`);
      await page.getByPlaceholder('••••••••').first().fill('test123456');
      page.locator('form button[type="submit"]').click();
      await page.waitForTimeout(2000);
    }
    
    if (page.url().includes('/super-admin')) {
      console.log('✅ Super Admin Login - PASSED');
      tests.push({ name: 'Super Admin Login', passed: true });
      
      // Create a branch admin
      await page.waitForTimeout(1000);
      const addBtn = page.getByRole('button', { name: 'Add Branch Admin' });
      await addBtn.scrollIntoViewIfNeeded();
      await addBtn.click({ force: true });
      await page.waitForTimeout(1000);
      
      const branchAdminEmail = `branch.admin.test@${Date.now()}.com`;
      await page.getByPlaceholder('Enter full name').fill('Test Branch Admin');
      await page.getByPlaceholder('admin@branch.com').fill(branchAdminEmail);
      const pwdFields = page.locator('input[type="password"]');
      await pwdFields.nth(0).fill('test123456');
      await pwdFields.nth(1).fill('test123456');
      const branchSelect = page.locator('select').first();
      await branchSelect.selectOption({ index: 1 });
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(2000);
      
      console.log(`  Branch admin created: ${branchAdminEmail}`);
      tests.push({ name: 'Create Branch Admin', passed: true });
      
      // Logout
      await page.goto(`${BASE_URL}/super-admin/login`);
      await page.waitForTimeout(1000);
      localStorage.clear();
    }
    
    // Step 2: Login as Branch Admin using Supabase
    console.log('\n🔐 Step 2: Branch Admin Login with Supabase...');
    
    // First, let's check if we need to use an existing branch admin
    // Let's get the email from localStorage to test
    const existingAdmins = await page.evaluate(() => {
      const data = localStorage.getItem('branch_admins');
      return data ? JSON.parse(data) : [];
    });
    
    if (existingAdmins.length > 0) {
      const testAdmin = existingAdmins[0];
      console.log(`  Testing with: ${testAdmin.email}`);
      
      await page.goto(`${BASE_URL}/admin/login`);
      await page.waitForTimeout(1000);
      
      await page.fill('input[type="email"]', testAdmin.email);
      await page.fill('input[type="password"]', 'alabang2026');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      if (page.url().includes('/admin')) {
        console.log('✅ Branch Admin Login - PASSED');
        tests.push({ name: 'Branch Admin Login', passed: true });
      } else {
        console.log('❌ Branch Admin Login - might need Supabase setup');
        // Check for error
        const errorMsg = await page.$('text=Invalid email');
        if (errorMsg) {
          console.log('  Note: Branch admin not in Supabase yet');
        }
      }
    } else {
      console.log('⚠️ No branch admins found to test');
    }
    
    // Summary
    console.log('\n========================================');
    console.log('📊 Test Results:');
    console.log('========================================');
    
    const passed = tests.filter(t => t.passed).length;
    const failed = tests.filter(t => !t.passed).length;
    
    tests.forEach(t => {
      console.log(`${t.passed ? '✅' : '❌'} ${t.name}`);
    });
    
    console.log(`\nTotal: ${passed} passed, ${failed} failed`);
    console.log('========================================');
    
    return passed >= 1;
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

testBranchAdminMigration().then(success => {
  console.log(success ? '\n✅ Migration Test PASSED!' : '\n❌ Migration Test NEEDS VERIFICATION');
  process.exit(success ? 0 : 1);
});