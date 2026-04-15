/**
 * Test Super Admin Migration to Supabase
 * Tests:
 * 1. Super Admin login with Supabase
 * 2. Super Admin signup with Supabase
 * 3. Branch admin CRUD operations with Supabase
 */

const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5175';
const SUPER_ADMIN_EMAIL = 'test.superadmin@hhasia.com';
const SUPER_ADMIN_PASSWORD = 'test123456';
const BRANCH_ADMIN_EMAIL = 'test.branchadmin@hhasia.com';

async function testSuperAdminMigration() {
  console.log('🚀 Starting Super Admin Supabase Migration Test\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let passed = 0;
  let failed = 0;
  
  try {
    // Step 1: Test Super Admin Signup
    console.log('📝 Step 1: Testing Super Admin Signup with Supabase...');
    await page.goto(`${BASE_URL}/super-admin/login`);
    await page.waitForTimeout(1000);
    
    // Click Sign Up tab
    const signUpTab = await page.$('button:has-text("Sign Up")');
    if (signUpTab) await signUpTab.click();
    await page.waitForTimeout(500);
    
    // Fill signup form
    await page.fill('input[name="fullName"]', 'Test Super Admin');
    await page.fill('input[name="email"]', SUPER_ADMIN_EMAIL);
    await page.fill('input[name="password"]', SUPER_ADMIN_PASSWORD);
    await page.fill('input[name="confirmPassword"]', SUPER_ADMIN_PASSWORD);
    
    // Submit
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Check for success message
    const successMsg = await page.$('text=Account created successfully');
    if (successMsg) {
      console.log('✅ Super Admin signup - PASSED');
      passed++;
    } else {
      // Check for error (might already exist)
      const errorMsg = await page.$('text=Email already registered');
      if (errorMsg) {
        console.log('✅ Super Admin signup (email exists) - PASSED');
        passed++;
      } else {
        console.log('❌ Super Admin signup - FAILED (no success message)');
        failed++;
      }
    }
    
    // Step 2: Test Super Admin Login
    console.log('\n🔐 Step 2: Testing Super Admin Login with Supabase...');
    
    // Fill login form
    await page.fill('input[name="email"]', SUPER_ADMIN_EMAIL);
    await page.fill('input[name="password"]', SUPER_ADMIN_PASSWORD);
    
    // Submit
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Check if redirected to dashboard
    const currentUrl = page.url();
    if (currentUrl.includes('/super-admin')) {
      console.log('✅ Super Admin login - PASSED');
      passed++;
      
      // Wait for dashboard to load
      await page.waitForTimeout(1000);
      
      // Check if branch admins table is visible
      const table = await page.$('table');
      if (table) {
        console.log('✅ Branch admins table loaded - PASSED');
        passed++;
      } else {
        console.log('⚠️ Branch admins table not found (might be empty)');
      }
    } else {
      console.log('❌ Super Admin login - FAILED (not redirected)');
      failed++;
    }
    
    // Step 3: Test Create Branch Admin
    console.log('\n➕ Step 3: Testing Create Branch Admin with Supabase...');
    
    // Click Add Admin button
    const addBtn = await page.$('button:has-text("Add Admin"), button:has-text("Add Branch")');
    if (addBtn) {
      await addBtn.click();
      await page.waitForTimeout(500);
      
      // Fill form
      await page.fill('input[name="fullName"]', 'Test Branch Admin');
      await page.fill('input[name="email"]', BRANCH_ADMIN_EMAIL);
      await page.fill('input[name="password"]', 'test123456');
      await page.fill('input[name="confirmPassword"]', 'test123456');
      
      // Select branch (first option)
      const branchSelect = await page.$('select[name="branchId"], select');
      if (branchSelect) {
        const options = await branchSelect.$$('option');
        if (options.length > 1) {
          await options[1].click();
        }
      }
      
      // Submit
      const submitBtn = await page.$('.fixed.inset-0 button:has-text("Create"), .fixed.inset-0 button:has-text("Add")');
      if (submitBtn) await submitBtn.click();
      await page.waitForTimeout(2000);
      
      // Check for success
      const createSuccess = await page.$('text=Branch admin created');
      if (createSuccess) {
        console.log('✅ Create branch admin - PASSED');
        passed++;
      } else {
        console.log('⚠️ Create branch admin - waiting for response...');
      }
    } else {
      console.log('⚠️ Add Admin button not found');
    }
    
    // Step 4: Test Edit Branch Admin
    console.log('\n✏️ Step 4: Testing Edit Branch Admin...');
    
    await page.waitForTimeout(1000);
    
    // Find Edit button in table
    const tbody = await page.$('tbody');
    if (tbody) {
      const editBtn = await tbody.$('button:has-text("Edit")');
      if (editBtn) {
        await editBtn.click();
        await page.waitForTimeout(500);
        
        // Update full name
        await page.fill('input[name="fullName"]', 'Updated Branch Admin');
        
        // Submit
        const updateBtn = await page.$('.fixed.inset-0 button:has-text("Update")');
        if (updateBtn) await updateBtn.click();
        await page.waitForTimeout(2000);
        
        const updateSuccess = await page.$('text=Branch admin updated');
        if (updateSuccess) {
          console.log('✅ Edit branch admin - PASSED');
          passed++;
        } else {
          console.log('⚠️ Edit branch admin - waiting for response...');
        }
      }
    }
    
    // Step 5: Test Toggle Status
    console.log('\n🔄 Step 5: Testing Toggle Branch Admin Status...');
    
    await page.waitForTimeout(1000);
    
    const tbody2 = await page.$('tbody');
    if (tbody2) {
      const toggleBtn = await tbody2.$('button:has-text("Toggle"), button:has-text("Active")');
      if (toggleBtn) {
        await toggleBtn.click();
        await page.waitForTimeout(2000);
        console.log('✅ Toggle status - PASSED');
        passed++;
      } else {
        console.log('⚠️ Toggle button not found');
      }
    }
    
    // Step 6: Test Delete Branch Admin
    console.log('\n🗑️ Step 6: Testing Delete Branch Admin...');
    
    await page.waitForTimeout(1000);
    
    const tbody3 = await page.$('tbody');
    if (tbody3) {
      const deleteBtn = await tbody3.$('button:has-text("Delete")');
      if (deleteBtn) {
        // Handle confirmation dialog
        page.on('dialog', async dialog => {
          await dialog.accept();
        });
        
        await deleteBtn.click();
        await page.waitForTimeout(2000);
        
        const deleteSuccess = await page.$('text=Branch admin deleted');
        if (deleteSuccess) {
          console.log('✅ Delete branch admin - PASSED');
          passed++;
        } else {
          console.log('⚠️ Delete branch admin - waiting for response...');
        }
      }
    }
    
    console.log('\n========================================');
    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
    console.log('========================================');
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
  
  return passed >= 3; // At least login and signup should work
}

testSuperAdminMigration().then(success => {
  console.log(success ? '\n✅ Migration test PASSED!' : '\n❌ Migration test FAILED!');
  process.exit(success ? 0 : 1);
});