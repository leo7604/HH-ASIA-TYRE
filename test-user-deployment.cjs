/**
 * Check Vercel Deployment - Using user's actual URL
 */

const https = require('https');

const DEPLOYMENT_URL = 'https://hh-asia-tyre-git-main-leo7604s-projects.vercel.app';

console.log('🚀 VERCEL DEPLOYMENT TEST\n');
console.log('='.repeat(70));
console.log(`Testing: ${DEPLOYMENT_URL}\n`);

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
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
      
      // Check for Supabase errors
      if (homeResult.body.includes('supabaseUrl is required')) {
        console.log('❌ ERROR: Supabase URL not configured!');
        console.log('   Missing VITE_SUPABASE_URL');
      } else if (homeResult.body.includes('credentials not found')) {
        console.log('❌ ERROR: Supabase credentials not found!');
        console.log('   Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
      } else if (homeResult.body.includes('Invalid API key')) {
        console.log('❌ ERROR: Invalid Supabase API key!');
      } else if (homeResult.body.includes('HH Asia') || homeResult.body.includes('Tyre')) {
        console.log('✅ HH Asia Tyre content detected');
        console.log('✅ App appears to be working');
      } else {
        console.log('⚠️ Page loaded but may have issues');
        // Show first 500 chars of body for debugging
        console.log('\nPage preview (first 500 chars):');
        console.log(homeResult.body.substring(0, 500));
      }
    } else if (homeResult.status === 404) {
      console.log('❌ 404 - Page not found');
    } else {
      console.log(`⚠️ Status: ${homeResult.status}`);
    }
    
    // Check booking page
    console.log('\n\n📅 CHECK 2: Booking Page');
    console.log('-'.repeat(70));
    
    const bookingResult = await fetchUrl(`${DEPLOYMENT_URL}/book`);
    console.log(`Status: ${bookingResult.status}`);
    
    if (bookingResult.status === 200) {
      console.log('✅ Booking page accessible');
      if (bookingResult.body.includes('Book')) {
        console.log('✅ Booking form content detected');
      }
    }
    
    // Check admin login
    console.log('\n\n🔐 CHECK 3: Admin Login Page');
    console.log('-'.repeat(70));
    
    const adminResult = await fetchUrl(`${DEPLOYMENT_URL}/admin/login`);
    console.log(`Status: ${adminResult.status}`);
    
    if (adminResult.status === 200) {
      console.log('✅ Admin login page accessible');
      if (adminResult.body.includes('login') || adminResult.body.includes('admin')) {
        console.log('✅ Admin content detected');
      }
    }
    
    // Summary
    console.log('\n\n' + '='.repeat(70));
    console.log('📊 DEPLOYMENT TEST SUMMARY');
    console.log('='.repeat(70));
    
    if (homeResult.status === 200 && 
        !homeResult.body.includes('supabaseUrl is required') &&
        !homeResult.body.includes('credentials not found')) {
      console.log('\n✅ DEPLOYMENT WORKING!');
      console.log(`   Visit: ${DEPLOYMENT_URL}`);
      console.log('\n✅ Supabase is connected');
      console.log('   Environment variables are set correctly');
    } else {
      console.log('\n⚠️ DEPLOYMENT NEEDS ATTENTION');
      
      if (homeResult.body.includes('supabaseUrl is required') || 
          homeResult.body.includes('credentials not found')) {
        console.log('\n❌ SUPABASE NOT CONFIGURED!');
        console.log('   Action required:');
        console.log('   1. Go to Vercel Dashboard');
        console.log('   2. Settings → Environment Variables');
        console.log('   3. Add these TWO variables:');
        console.log('      Name: VITE_SUPABASE_URL');
        console.log('      Value: https://knghsmttizcoecgwyfdk.supabase.co');
        console.log('      ');
        console.log('      Name: VITE_SUPABASE_ANON_KEY');
        console.log('      Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY');
        console.log('   4. Redeploy the project');
      }
    }
    
    console.log('\n' + '='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }
}

checkDeployment();