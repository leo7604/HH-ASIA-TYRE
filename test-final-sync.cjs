// Final verification test for database sync
// Run with: node test-final-sync.cjs

const https = require('https');

console.log('🚀 FINAL DATABASE SYNC VERIFICATION\n');
console.log('='.repeat(60));

// Test payload with correct format
const testData = {
  customerName: "Final Test Customer",
  phone: "09179998888",
  email: "finaltest@verification.com",
  service: "Tire Rotation",
  serviceType: "Tire Rotation, Oil Change",
  vehicleMake: "Honda",
  vehicleModel: "Civic",
  vehicleYear: "2021",
  plateNumber: "FINAL-TEST",
  preferredDate: "2026-04-30",
  preferredTime: "2:00 PM",
  branch: "ALABANG",  // String branch code
  notes: "Final verification test",
  status: "approved",
  bayId: 1,
  bayName: "Bay 1"
};

console.log('📦 Payload:');
console.log(JSON.stringify(testData, null, 2));
console.log('\n');

const data = JSON.stringify(testData);

const options = {
  hostname: 'hh-asia-tyre-crm-inv-sys.vercel.app',
  path: '/api/public/bookings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  
  console.log('📡 API Response:');
  console.log('   Status:', res.statusCode, res.statusMessage);
  console.log('\n');
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('📦 Response Body:');
    console.log(body);
    console.log('\n');
    
    try {
      const parsed = JSON.parse(body);
      
      console.log('='.repeat(60));
      console.log('📊 TEST RESULTS');
      console.log('='.repeat(60));
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('\n✅✅✅ DATABASE SYNC SUCCESSFUL! ✅✅✅\n');
        console.log('The booking was successfully created in the database!');
        console.log('\nResponse Details:');
        console.log(JSON.stringify(parsed, null, 2));
      } else if (res.statusCode === 429) {
        console.log('\n⚠️  Rate limited - wait', parsed.retryAfter, 'seconds and retry');
      } else if (res.statusCode === 400) {
        console.log('\n❌ Validation Error:');
        console.log('   Missing fields:', parsed.missingFields?.join(', ') || 'Unknown');
      } else {
        console.log('\n❌ Unexpected status:', res.statusCode);
        console.log('   Error:', parsed.error || 'Unknown error');
      }
      
    } catch (e) {
      console.log('Could not parse response as JSON');
      console.log('Raw response:', body);
    }
    
    console.log('\n' + '='.repeat(60));
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request failed:', error.message);
  console.log('\nPossible causes:');
  console.log('   - Network connectivity issue');
  console.log('   - API server is down');
  console.log('   - DNS resolution failed');
});

req.write(data);
req.end();

console.log('⏳ Sending request to database API...\n');
