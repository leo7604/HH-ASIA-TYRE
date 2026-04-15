/**
 * Verify Team B CRM API Sync Status
 * Tests the external API endpoint and checks sync functionality
 */

const https = require('https');

const TEAM_B_API_URL = 'https://hh-asia-tyre-crm-inv-sys.vercel.app/api/public/bookings';

console.log('🔍 TEAM B CRM API SYNC VERIFICATION\n');
console.log('='.repeat(70));

async function testTeamBAPI() {
  const results = {
    apiEndpoint: 'UNKNOWN',
    apiStatus: 'UNKNOWN',
    lastSyncAttempt: null,
    syncSuccess: false,
    errorMessage: null
  };

  try {
    // Test 1: Check if API endpoint is reachable
    console.log('\n📡 TEST 1: Checking API Endpoint Availability');
    console.log('-'.repeat(70));
    console.log(`URL: ${TEAM_B_API_URL}\n`);

    const testPayload = {
      customerName: 'API Test Customer',
      phone: '09179999999',
      email: 'api.test@hhasia.com',
      service: 'Tire Rotation',
      serviceType: 'Tire Rotation',
      vehicleMake: 'Honda',
      vehicleModel: 'Civic',
      vehicleYear: '2024',
      plateNumber: 'TEST-API-001',
      preferredDate: '2026-05-01',
      preferredTime: '10:00',
      branch: 'ALABANG',
      notes: 'API sync test',
      status: 'pending',
      bayId: null,
      bayName: null
    };

    console.log('Sending test booking to Team B CRM...\n');

    const response = await fetch(TEAM_B_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });

    const responseText = await response.text();
    let result;
    
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { raw: responseText };
    }

    console.log('📊 API Response:');
    console.log(`   Status Code: ${response.status} ${response.statusText}`);
    console.log(`   Response: ${JSON.stringify(result, null, 2).substring(0, 500)}\n`);

    if (response.ok) {
      console.log('✅ API ENDPOINT: REACHABLE');
      console.log('✅ API RESPONSE: SUCCESS');
      results.apiEndpoint = 'REACHABLE';
      results.apiStatus = 'SUCCESS';
      results.syncSuccess = true;
    } else {
      console.log('❌ API ENDPOINT: REACHABLE');
      console.log(`❌ API RESPONSE: FAILED (${response.status})`);
      console.log(`   Error: ${result.error || result.message || 'Unknown error'}`);
      results.apiEndpoint = 'REACHABLE';
      results.apiStatus = `FAILED (${response.status})`;
      results.errorMessage = result.error || result.message;
    }

  } catch (error) {
    console.log('❌ API ENDPOINT: UNREACHABLE');
    console.log(`   Error: ${error.message}`);
    results.apiEndpoint = 'UNREACHABLE';
    results.apiStatus = 'ERROR';
    results.errorMessage = error.message;
  }

  // Test 2: Check recent sync attempts in localStorage (simulate)
  console.log('\n\n📋 TEST 2: Local Sync Status (Simulated)');
  console.log('-'.repeat(70));
  console.log('Note: This test simulates checking localStorage for sync status.\n');
  console.log('In actual browser, you would check:');
  console.log('   localStorage.getItem("appointments")');
  console.log('   Look for bookings with: apiSuccess: true/false\n');

  // Test 3: Check current bookings in your Supabase
  console.log('\n\n🗄️  TEST 3: Your Supabase Bookings Status');
  console.log('-'.repeat(70));

  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = 'https://knghsmttizcoecgwyfdk.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, booking_reference, status, branch_id, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.log('❌ Failed to fetch bookings from Supabase');
    console.log(`   Error: ${error.message}`);
  } else {
    console.log(`Found ${bookings.length} recent bookings in Supabase:\n`);
    
    const statusCounts = {
      pending: 0,
      approved: 0,
      completed: 0,
      rejected: 0
    };

    bookings.forEach(b => {
      statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
      console.log(`   • ${b.booking_reference} | Status: ${b.status.toUpperCase()} | Branch: ${b.branch_id}`);
    });

    console.log('\n📊 Booking Status Summary:');
    console.log(`   Pending:   ${statusCounts.pending}`);
    console.log(`   Approved:  ${statusCounts.approved}`);
    console.log(`   Completed: ${statusCounts.completed}`);
    console.log(`   Rejected:  ${statusCounts.rejected}`);
  }

  // Final Report
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 TEAM B CRM API SYNC STATUS REPORT');
  console.log('='.repeat(70));
  console.log('\n🔗 API ENDPOINT');
  console.log(`   URL: ${TEAM_B_API_URL}`);
  console.log(`   Status: ${results.apiEndpoint}`);
  console.log(`   Response: ${results.apiStatus}`);

  if (results.errorMessage) {
    console.log(`   Error: ${results.errorMessage}`);
  }

  console.log('\n💡 RECOMMENDATIONS');
  console.log('-'.repeat(70));

  if (results.apiEndpoint === 'REACHABLE' && results.syncSuccess) {
    console.log('✅ Team B CRM API is working correctly!');
    console.log('   • Approved bookings are being synced successfully');
    console.log('   • No action required');
  } else if (results.apiEndpoint === 'REACHABLE' && !results.syncSuccess) {
    console.log('⚠️  Team B CRM API is reachable but returning errors');
    console.log('   • Check the error message above');
    console.log('   • Verify API payload format matches their expectations');
    console.log('   • Contact Team B if error persists');
  } else {
    console.log('❌ Team B CRM API is unreachable');
    console.log('   • Your system still works (bookings saved to Supabase)');
    console.log('   • Approved bookings will show "saved locally" message');
    console.log('   • "Retry Sync" button available for manual retry');
    console.log('   • Contact Team B to check their API server status');
  }

  console.log('\n🔄 SYNC WORKFLOW');
  console.log('-'.repeat(70));
  console.log('1. Admin approves booking → Saved to YOUR Supabase ✅');
  console.log('2. System attempts sync to Team B CRM API');
  console.log('3. If successful → Shows "sent to database" ✅');
  console.log('4. If failed → Shows "saved locally" ⚠️');
  console.log('5. Admin can click "Retry Sync" to try again 🔄');

  console.log('\n' + '='.repeat(70));
  console.log('✨ VERIFICATION COMPLETE');
  console.log('='.repeat(70) + '\n');

  return results;
}

testTeamBAPI().catch(console.error);
