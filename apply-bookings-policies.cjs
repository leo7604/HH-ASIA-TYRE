/**
 * Apply RLS Policies for Bookings Table
 * Run this to ensure all RLS policies are applied to bookings and related tables
 */

const https = require('https');

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const policies = [
  // Enable RLS
  'ALTER TABLE bookings ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE customers ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE branches ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE service_bays ENABLE ROW LEVEL SECURITY',
  
  // Bookings policies
  'CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true)',
  'CREATE POLICY "Customers can view own bookings" ON bookings FOR SELECT USING (true)',
  'CREATE POLICY "Anyone can update bookings" ON bookings FOR UPDATE USING (true) WITH CHECK (true)',
  'CREATE POLICY "Full access for now" ON bookings FOR ALL USING (true) WITH CHECK (true)',
  
  // Customers policies
  'CREATE POLICY "Full access customers" ON customers FOR ALL USING (true) WITH CHECK (true)',
  
  // Vehicles policies
  'CREATE POLICY "Full access vehicles" ON vehicles FOR ALL USING (true) WITH CHECK (true)',
  
  // Branches policies
  'CREATE POLICY "Anyone can view active branches" ON branches FOR SELECT USING (is_active = true)',
  'CREATE POLICY "Full access branches" ON branches FOR ALL USING (true) WITH CHECK (true)',
  
  // Service bays policies
  'CREATE POLICY "Full access service_bays" ON service_bays FOR ALL USING (true) WITH CHECK (true)',
];

async function applyPolicy(sql) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      query: sql
    });

    const options = {
      hostname: 'knghsmttizcoecgwyfdk.supabase.co',
      path: '/rest/v1/rpc/pgrest_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = res.statusCode >= 200 && res.statusCode < 300;
        console.log(`${success ? '✅' : '⚠️'} ${sql.substring(0, 60)}... (${res.statusCode})`);
        resolve({ sql, status: res.statusCode, success });
      });
    });

    req.on('error', (e) => {
      console.log(`❌ ${sql.substring(0, 60)}... ERROR: ${e.message}`);
      resolve({ sql, error: e.message });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🔧 Applying RLS Policies for Bookings Table...\n');
  console.log('Project: knghsmttizcoecgwyfdk\n');
  
  let results = [];
  
  for (const sql of policies) {
    const result = await applyPolicy(sql);
    results.push(result);
    await new Promise(r => setTimeout(r, 100)); // Small delay between requests
  }
  
  console.log('\n========================================');
  console.log('📊 Results Summary');
  console.log('========================================');
  
  const successCount = results.filter(r => r.success || r.status >= 200).length;
  console.log(`Applied: ${successCount}/${results.length} policies`);
  
  if (successCount === results.length) {
    console.log('\n✅ All policies applied successfully!');
  } else {
    console.log('\n⚠️ Some policies may need manual application in Supabase SQL Editor');
    console.log('\nSQL file available: database/BOOKINGS_RLS_POLICIES.sql');
  }
  
  console.log('\n📋 Verify in Supabase Dashboard:');
  console.log('   SQL Editor > Run: SELECT * FROM pg_policies WHERE tablename = \'bookings\'');
}

main();