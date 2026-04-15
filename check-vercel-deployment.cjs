/**
 * Check Vercel Deployment Status
 * Uses HTTP to verify the deployment is accessible and Supabase is connected
 */

const https = require('https');

const DEPLOYMENT_URL = 'https://hh-asia-tyre-ltqj0et29-leo7604s-projects.vercel.app';

console.log('🚀 VERCEL DEPLOYMENT STATUS CHECK\n');
console.log('='.repeat(70));
console.log(`Testing: ${DEPLOYMENT_URL}\n`);

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
            parseError: e.message
          });
        }
      });
    }).on('error', reject);
  });
}

async function checkDeployment() {
  try {
    // Check homepage
    console.log('📄 CHECK 1: Homepage');
    console.log('-'.repeat(70));
    
    const homeResult = await fetchUrl(DEPLOYMENT_URL);
    console.log(`Status: ${homeResult.status}`);
    
    if (homeResult.status === 200) {
      console.log('✅ Homepage accessible');
      
      // Check for Supabase errors in HTML
      if (homeResult.body.includes('supabaseUrl is required') ||
          homeResult.body.includes('credentials not found')) {
        console.log('❌ Supabase environment variables NOT configured!');
        console.log('   The app is loading but Supabase is disconnected.');
      } else if (homeResult.body.includes('HH Asia') || homeResult.body.includes('HH')) {
        console.log('✅ HH Asia Tyre content detected');
        console.log('✅ App appears to be working');
      } else {
        console.log('⚠️ Page loaded but content unclear');
      }
    } else if (homeResult.status === 404) {
      console.log('❌ Page not found (404)');
      console.log('   Deployment may need to be recreated');
    } else {
      console.log(`⚠️ Unexpected status: ${homeResult.status}`);
    }
    
    // Check booking page
    console.log('\n\n📅 CHECK 2: Booking Page');
    console.log('-'.repeat(70));
    
    const bookingResult = await fetchUrl(`${DEPLOYMENT_URL}/book`);
    console.log(`Status: ${bookingResult.status}`);
    
    if (bookingResult.status === 200) {
      console.log('✅ Booking page accessible');
      
      if (bookingResult.body.includes('Book') || bookingResult.body.includes('book')) {
        console.log('✅ Booking form content detected');
      }
    } else {
      console.log(`⚠️ Booking page status: ${bookingResult.status}`);
    }
    
    // Check admin login
    console.log('\n\n🔐 CHECK 3: Admin Login Page');
    console.log('-'.repeat(70));
    
    const adminResult = await fetchUrl(`${DEPLOYMENT_URL}/admin/login`);
    console.log(`Status: ${adminResult.status}`);
    
    if (adminResult.status === 200) {
      console.log('✅ Admin login page accessible');
    } else {
      console.log(`⚠️ Admin page status: ${adminResult.status}`);
    }
    
    // Final summary
    console.log('\n\n' + '='.repeat(70));
    console.log('📊 DEPLOYMENT STATUS SUMMARY');
    console.log('='.repeat(70));
    
    if (homeResult.status === 200 && 
        !homeResult.body.includes('supabaseUrl is required')) {
      console.log('\n✅ Deployment is WORKING!');
      console.log('   The site loads and Supabase is connected.');
      console.log('   Visit the URL and test manually:');
      console.log(`   ${DEPLOYMENT_URL}`);
    } else if (homeResult.status === 200) {
      console.log('\n⚠️ Deployment needs SUPABASE CONFIGURATION');
      console.log('   Go to Vercel Dashboard → Settings → Environment Variables');
      console.log('   Add these variables:');
      console.log('   • VITE_SUPABASE_URL');
      console.log('   • VITE_SUPABASE_ANON_KEY');
      console.log('   Then redeploy.');
    } else {
      console.log('\n❌ Deployment has ISSUES');
      console.log('   Status code:', homeResult.status);
      console.log('   Consider redeploying from Vercel Dashboard.');
    }
    
    console.log('\n' + '='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Could not connect to deployment.');
    console.error('Check if the URL is correct or deployment exists.');
  }
}

checkDeployment();
