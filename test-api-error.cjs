// Test: Check API error details
// Run with: node test-api-error.cjs

const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  const page = await browser.newPage();
  
  // Capture full response details
  page.on('response', async response => {
    if (response.url().includes('vercel.app')) {
      console.log('\n📡 API RESPONSE DETAILS:');
      console.log('   URL:', response.url());
      console.log('   Status:', response.status());
      console.log('   Status Text:', response.statusText());
      
      try {
        const text = await response.text();
        console.log('   Response Body:');
        console.log('   ', text);
      } catch (e) {
        console.log('   Could not read response body');
      }
    }
  });
  
  try {
    console.log('🔍 API ERROR DIAGNOSTIC TEST\n');
    
    // Create test booking
    await page.goto('http://localhost:5173');
    await page.evaluate(() => {
      const admins = JSON.parse(localStorage.getItem('branchAdmins') || '[]');
      if (!admins.find(a => a.email === 'admin@hhasia.com')) {
        admins.push({
          id: 50,
          email: 'admin@hhasia.com',
          password: 'Admin123!',
          fullName: 'Test Admin',
          role: 'branch_admin',
          branchId: 1
        });
        localStorage.setItem('branchAdmins', JSON.stringify(admins));
      }
      
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      appointments.push({
        id: Date.now(),
        branchId: 1,
        bayId: null,
        bayName: null,
        customerName: 'API Test User',
        email: 'apitest@test.com',
        phone: '09176666666',
        vehicleYear: '2023',
        vehicleMake: 'Toyota',
        vehicleModel: 'Corolla',
        plateNumber: 'API-1234',
        services: ['Oil Change'],
        date: '2026-04-28',
        time: '10:00 AM',
        status: 'pending',
        createdAt: new Date().toISOString(),
        apiBookingId: null,
        apiSuccess: false,
      });
      localStorage.setItem('appointments', JSON.stringify(appointments));
    });
    
    // Login
    await page.goto('http://localhost:5173/admin/login');
    await page.fill('input[type="email"]', 'admin@hhasia.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    console.log('✅ Logged in, waiting for approval action...\n');
    
    // Find and click approve
    await page.waitForTimeout(1000);
    const approveBtn = await page.$('button:has-text("Approve")');
    if (approveBtn) {
      console.log('🔘 Clicking Approve...');
      await approveBtn.click();
      await page.waitForTimeout(1000);
      
      // Select bay
      const bayBtn = await page.$('button:has-text("Bay 1")');
      if (bayBtn) {
        console.log('🏢 Selecting Bay 1...');
        await bayBtn.click();
        await page.waitForTimeout(500);
      }
      
      // Confirm
      const confirmBtn = await page.$('button:has-text("Assign Bay & Approve"), button:has-text("Confirm")');
      if (confirmBtn) {
        console.log('🔘 Confirming approval...\n');
        await confirmBtn.click();
        await page.waitForTimeout(3000);
      }
    }
    
    console.log('\n✅ Check the API response details above for the error message');
    await page.screenshot({ path: 'screenshots/api-error-diagnostic.png' });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
    console.log('\n👋 Browser closed');
  }
})();
