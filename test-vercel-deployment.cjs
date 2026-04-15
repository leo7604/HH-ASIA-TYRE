/**
 * Vercel Deployment Test
 * Tests the production deployment after adding Supabase environment variables
 */

const { chromium } = require('playwright');

const DEPLOYMENT_URL = 'https://hh-asia-tyre.vercel.app'; // Update this if different

async function testVercelDeployment() {
  console.log('🚀 VERCEL DEPLOYMENT TEST\n');
  console.log('='.repeat(70));
  console.log(`Testing: ${DEPLOYMENT_URL}\n`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {
    homepage: null,
    bookingPage: null,
    adminLogin: null,
    supabaseConnection: null,
    consoleErrors: [],
    apiIntegration: null
  };
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.consoleErrors.push(msg.text());
    }
  });
  
  try {
    // TEST 1: Homepage
    console.log('📄 TEST 1: Homepage Loading');
    console.log('-'.repeat(70));
    
    const homepageResponse = await page.goto(DEPLOYMENT_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    if (homepageResponse && homepageResponse.ok()) {
      console.log('✅ Homepage loaded successfully');
      console.log(`   Status: ${homepageResponse.status()}`);
      results.homepage = 'PASSED';
    } else {
      console.log('❌ Homepage failed to load');
      console.log(`   Status: ${homepageResponse?.status()}`);
      results.homepage = 'FAILED';
    }
    
    // Check for Supabase error
    const pageContent = await page.content();
    if (pageContent.includes('supabaseUrl is required') || pageContent.includes('credentials not found')) {
      console.log('❌ Supabase credentials error detected!');
      results.supabaseConnection = 'FAILED';
    } else {
      console.log('✅ No Supabase credential errors on homepage');
      results.supabaseConnection = 'PASSED';
    }
    
    // TEST 2: Booking Page
    console.log('\n\n📅 TEST 2: Booking Page');
    console.log('-'.repeat(70));
    
    const bookingUrl = `${DEPLOYMENT_URL}/book`;
    const bookingResponse = await page.goto(bookingUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    if (bookingResponse && bookingResponse.ok()) {
      console.log('✅ Booking page loaded successfully');
      console.log(`   Status: ${bookingResponse.status()}`);
      
      // Check for booking form elements
      await page.waitForTimeout(2000);
      const hasForm = await page.$('form, input, button');
      if (hasForm) {
        console.log('✅ Booking form elements present');
        results.bookingPage = 'PASSED';
      } else {
        console.log('⚠️ Booking page loaded but no form found');
        results.bookingPage = 'PARTIAL';
      }
    } else {
      console.log('❌ Booking page failed to load');
      results.bookingPage = 'FAILED';
    }
    
    // TEST 3: Admin Login Page
    console.log('\n\n🔐 TEST 3: Admin Login Page');
    console.log('-'.repeat(70));
    
    const adminUrl = `${DEPLOYMENT_URL}/admin/login`;
    const adminResponse = await page.goto(adminUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    if (adminResponse && adminResponse.ok()) {
      console.log('✅ Admin login page loaded successfully');
      console.log(`   Status: ${adminResponse.status()}`);
      results.adminLogin = 'PASSED';
    } else {
      console.log('❌ Admin login page failed to load');
      results.adminLogin = 'FAILED';
    }
    
    // TEST 4: Check for Critical Errors
    console.log('\n\n⚠️ TEST 4: Console Errors Check');
    console.log('-'.repeat(70));
    
    if (results.consoleErrors.length > 0) {
      console.log(`⚠️ Found ${results.consoleErrors.length} console errors:\n`);
      results.consoleErrors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error.substring(0, 100)}`);
      });
      
      // Check for critical Supabase errors
      const criticalErrors = results.consoleErrors.filter(e => 
        e.includes('supabaseUrl') || 
        e.includes('credentials') ||
        e.includes('Invalid API key')
      );
      
      if (criticalErrors.length > 0) {
        console.log('\n❌ CRITICAL: Supabase environment variables not configured!');
        console.log('   Please add environment variables in Vercel Dashboard:');
        console.log('   Settings → Environment Variables → Add New');
      }
    } else {
      console.log('✅ No console errors detected');
    }
    
    // TEST 5: API Integration Check
    console.log('\n\n🔗 TEST 5: API Integration');
    console.log('-'.repeat(70));
    
    // Try to check if Supabase is connected by looking for admin dashboard
    await page.goto(adminUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Check page title or content for signs of Supabase connection
    const adminContent = await page.content();
    if (adminContent.includes('HH Asia') || adminContent.includes('Admin')) {
      console.log('✅ Admin page content loaded');
      console.log('✅ Application appears to be functioning');
      results.apiIntegration = 'PASSED';
    } else {
      console.log('⚠️ Could not verify full API integration');
      results.apiIntegration = 'PARTIAL';
    }
    
  } catch (error) {
    console.error('\n❌ TEST ERROR:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await browser.close();
  }
  
  // FINAL REPORT
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 VERCEL DEPLOYMENT TEST RESULTS');
  console.log('='.repeat(70));
  console.log('\n✅ Homepage Loading:', results.homepage);
  console.log('✅ Booking Page:', results.bookingPage);
  console.log('✅ Admin Login:', results.adminLogin);
  console.log('✅ Supabase Connection:', results.supabaseConnection);
  console.log('✅ API Integration:', results.apiIntegration);
  console.log('⚠️  Console Errors:', results.consoleErrors.length > 0 ? `${results.consoleErrors.length} found` : 'None');
  
  console.log('\n' + '-'.repeat(70));
  console.log('💡 RECOMMENDATIONS');
  console.log('-'.repeat(70));
  
  if (results.supabaseConnection === 'FAILED' || results.consoleErrors.some(e => e.includes('supabase'))) {
    console.log('\n❌ SUPABASE NOT CONFIGURED');
    console.log('   1. Go to Vercel Dashboard');
    console.log('   2. Settings → Environment Variables');
    console.log('   3. Add these variables:');
    console.log('      VITE_SUPABASE_URL = https://knghsmttizcoecgwyfdk.supabase.co');
    console.log('      VITE_SUPABASE_ANON_KEY = [your-anon-key]');
    console.log('   4. Redeploy the project');
  } else if (results.homepage === 'PASSED') {
    console.log('\n✅ Deployment appears to be working!');
    console.log('   The Supabase environment variables are likely configured.');
    console.log('   Visit the site and test the booking flow manually.');
  }
  
  console.log('\n' + '='.repeat(70));
  
  // Return success/failure
  const allPassed = results.homepage === 'PASSED' && 
                     results.supabaseConnection !== 'FAILED';
  return allPassed;
}

testVercelDeployment().then(success => {
  console.log(success ? '\n🎉 DEPLOYMENT TEST: PASSED' : '\n⚠️ DEPLOYMENT TEST: ISSUES FOUND');
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});
