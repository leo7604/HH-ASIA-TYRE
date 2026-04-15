/**
 * Debug Super Admin Signup Issue
 */

const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5175';

async function debugSignup() {
  console.log('🔍 Debugging Super Admin Signup...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(`${BASE_URL}/super-admin/login`);
    await page.waitForTimeout(1000);
    
    // Click Sign Up tab
    const signUpTab = await page.$('button:has-text("Sign Up")');
    if (signUpTab) {
      await signUpTab.click();
      await page.waitForTimeout(500);
    }
    
    // Fill form
    await page.fill('input[name="fullName"]', 'Test Super Admin Debug');
    await page.fill('input[name="email"]', 'debug.test@hhasia.com');
    await page.fill('input[name="password"]', 'test123456');
    await page.fill('input[name="confirmPassword"]', 'test123456');
    
    // Get the page content before click
    console.log('📄 Page content before submit:');
    const content = await page.content();
    console.log(content.substring(0, 3000));
    
    // Submit
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Get page content after submit
    console.log('\n📄 Page content after submit:');
    const afterContent = await page.content();
    
    // Check for error messages
    const errorDiv = await page.$('div[style*="red"], .text-red-400, [class*="error"]');
    if (errorDiv) {
      const errorText = await errorDiv.textContent();
      console.log('\n❌ Error message:', errorText);
    }
    
    // Check for any visible text
    const bodyText = await page.textContent('body');
    console.log('\n📄 Body text:', bodyText.substring(0, 500));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugSignup();