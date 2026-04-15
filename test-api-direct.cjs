// Test API directly with Node.js
const https = require('https');

const data = JSON.stringify({
  customerName: "Test User",
  phone: "09171234567",
  email: "test@example.com",
  service: "Oil Change",
  serviceType: "Oil Change",
  vehicleMake: "Toyota",
  vehicleModel: "Vios",
  vehicleYear: "2020",
  plateNumber: "TEST-123",
  preferredDate: "2026-04-20",
  preferredTime: "10:00 AM",
  branch: "MNL",  // Branch code as string, not ID as integer
  notes: "Test booking",
  status: "approved",
  bayId: 1,
  bayName: "Bay 1"
});

const options = {
  hostname: 'hh-asia-tyre-crm-inv-sys.vercel.app',
  path: '/api/public/bookings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🔍 Testing API with snake_case fields...\n');
console.log('Payload:', data);
console.log('\n');

const req = https.request(options, (res) => {
  let body = '';
  
  console.log('📡 Response:');
  console.log('   Status:', res.statusCode);
  console.log('   StatusText:', res.statusMessage);
  console.log('   Headers:', JSON.stringify(res.headers, null, 2));
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
      console.log('🔍 Parsed Error:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Could not parse as JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
});

req.write(data);
req.end();
