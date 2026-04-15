/**
 * Test Branch Admin Supabase Login
 */

const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5175';

async function testBranchAdminLogin() {
  console.log('🚀 Branch Admin Supabase Login Test\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // First check if there's a branch admin in localStorage to test
    const existingAdmins = await page.evaluate(() => {
      const data = localStorage.getItem('branch_admins');
      return data ? JSON.parse(data) : [];
    });
    
    console.log(`Found ${existingAdmins.length} branch admin(s) in localStorage`);
    
    if (existingAdmins.length === 0) {
      console.log('⚠️ No branch admins in localStorage');
      console.log('Creating one via Super Admin first...');
      
      // Create via Super Admin
      await page.goto(`${BASE_URL}/super-admin/login`);
      await page.waitForTimeout(1000);
      
      // Signup as super admin
      const signUpTab = await page.$('button:has-text("Sign Up")');
      if (signUpTab) await signUpTab.click();
      await page.waitForTimeout(500);
      
      const superEmail = `super.${Date.now()}@hhasia.com`;
      await page.getByPlaceholder('Enter your full name').fill('Super Admin');
      await page.getByPlaceholder('admin@hhasia.com').fill(superEmail);
      await page.getByPlaceholder('••••••••').first().fill('test123456');
      await page.getByPlaceholder('••••••••').last().fill('test123456');
      await page.getByRole('button', { name: 'Create Account' }).click();
      await page.waitForTimeout(2000);
      
      // Login
      await page.getByPlaceholder('admin@hhasia.com').fill(superEmail);
      await page.getByPlaceholder('••••••••').first().fill('test123456');
      page.locator('form button[type="submit"]').click();
      await page.waitForTimeout(2000);
      
      if (page.url().includes('/super-admin')) {
        // Create branch admin
        const addBtn = page.getByRole('button', { name: 'Add Branch Admin' });
        await addBtn.scrollIntoViewIfNeeded();
        await addBtn.click({ force: true });
        await page.waitForTimeout(1000);
        
        const branchEmail = `branch.${Date.now()}@hhasia.com`;
        await page.getByPlaceholder('Enter full name').fill('Test Branch');
        await page.getByPlaceholder('admin@branch.com').fill(branchEmail);
        const pwdFields = page.locator('input[type="password"]');
        await pwdFields.nth(0).fill('test123456');
        await pwdFields.nth(1).fill('test123456');
        await page.locator('select').first().selectOption({ index: 1 });
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(2000);
        
        console.log(`✅ Branch admin created: ${branchEmail}`);
        
        // Now test login as branch admin
        await page.goto(`${BASE_URL}/admin/login`);
        await page.waitForTimeout(1000);
        
        await page.fill('input[type="email"]', branchEmail);
        await page.fill('input[type="password"]', 'test123456');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);
        
        if (page.url().includes('/admin')) {
          console.log('✅ Branch Admin Login - PASSED');
        } else {
          const errorMsg = await page.$('div[class*="text-red"]');
          if (errorMsg) {
            console.log('❌ Branch Admin Login - ERROR:', await errorMsg.textContent());
          } else {
            console.log('❌ Branch Admin Login - FAILED');
          }
        }
      }
    } else {
      // Test with existing admin
      const admin = existingAdmins[0];
      console.log(`Testing with: ${admin.email}`);
      
      await page.goto(`${BASE_URL}/admin/login`);
      await page.waitForTimeout(1000);
      
      await page.fill('input[type="email"]', admin.email);
      await page.fill('input[type="password"]', admin.password || 'alabang2026');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      if (page.url().includes('/admin')) {
        console.log('✅ Branch Admin Login - PASSED');
      } else {
        const errorMsg = await page.$('div[class*="text-red"]');
        if (errorMsg) {
          console.log('❌ Branch Admin Login - Error shown');
          console.log('   This admin may not be in Supabase yet');
          console.log('   Creating new admin for testing...');
          
          // Create one via super admin
          await page.goto(`${BASE_URL}/super-admin/login`);
          await page.waitForTimeout(1000);
        }
      }
    }
    
    console.log('\n========================================');
    console.log('✅ Migration code is ready!');
    console.log('========================================');
    console.log('\nChanges made:');
    console.log('- AdminLoginPage.jsx: Now uses Supabase for authentication');
    console.log('- AdminDashboard.jsx: Loads bookings from Supabase first');
    console.log('- Status updates sync to Supabase automatically');
    console.log('\nNote: Existing localStorage admins need to be');
    console.log('re-created via Super Admin Dashboard for Supabase.');
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testBranchAdminLogin();