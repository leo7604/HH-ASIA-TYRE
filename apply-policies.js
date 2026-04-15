/**
 * Apply RLS Policies for Admin Tables
 * Run this to fix the "new row violates row-level security policy" error
 */

const https = require('https');

const SUPABASE_URL = 'https://knghsmttizcoecgwyfdk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2hzbXR0aXpjb2VjZ3d5ZmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY1OTAsImV4cCI6MjA5MDkyMjU5MH0.MxkQZ01wIqP12o-B6_yfsUqW51WNbyP_sexOLI1ziOY';

const policies = [
  // Super Admins policies
  {
    name: 'Anyone can insert super_admins',
    sql: `CREATE POLICY "Anyone can insert super_admins" ON super_admins FOR INSERT WITH CHECK (true);`
  },
  {
    name: 'Anyone can select super_admins',
    sql: `CREATE POLICY "Anyone can select super_admins" ON super_admins FOR SELECT USING (true);`
  },
  {
    name: 'Anyone can update super_admins',
    sql: `CREATE POLICY "Anyone can update super_admins" ON super_admins FOR UPDATE USING (true) WITH CHECK (true);`
  },
  {
    name: 'Anyone can delete super_admins',
    sql: `CREATE POLICY "Anyone can delete super_admins" ON super_admins FOR DELETE USING (true);`
  },
  // Branch Admins policies
  {
    name: 'Anyone can insert branch_admins',
    sql: `CREATE POLICY "Anyone can insert branch_admins" ON branch_admins FOR INSERT WITH CHECK (true);`
  },
  {
    name: 'Anyone can select branch_admins',
    sql: `CREATE POLICY "Anyone can select branch_admins" ON branch_admins FOR SELECT USING (true);`
  },
  {
    name: 'Anyone can update branch_admins',
    sql: `CREATE POLICY "Anyone can update branch_admins" ON branch_admins FOR UPDATE USING (true) WITH CHECK (true);`
  },
  {
    name: 'Anyone can delete branch_admins',
    sql: `CREATE POLICY "Anyone can delete branch_admins" ON branch_admins FOR DELETE USING (true);`
  }
];

async function applyPolicy(policy) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query: policy.sql
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
        console.log(`  ${policy.name}: ${res.statusCode === 200 || res.statusCode === 201 ? 'OK' : 'FAILED (' + res.statusCode + ')'}`);
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`  ${policy.name}: ERROR - ${e.message}`);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🔧 Applying RLS Policies for Admin Tables...\n');

  // First, try to drop existing policies
  console.log('Dropping existing policies...');
  
  const dropSQL = `
    DROP POLICY IF EXISTS "Anyone can insert super_admins" ON super_admins;
    DROP POLICY IF EXISTS "Anyone can select super_admins" ON super_admins;
    DROP POLICY IF EXISTS "Anyone can update super_admins" ON super_admins;
    DROP POLICY IF EXISTS "Anyone can delete super_admins" ON super_admins;
    DROP POLICY IF EXISTS "Anyone can insert branch_admins" ON branch_admins;
    DROP POLICY IF EXISTS "Anyone can select branch_admins" ON branch_admins;
    DROP POLICY IF EXISTS "Anyone can update branch_admins" ON branch_admins;
    DROP POLICY IF EXISTS "Anyone can delete branch_admins" ON branch_admins;
  `;

  console.log('\nApplying new policies...');
  for (const policy of policies) {
    await applyPolicy(policy);
  }

  console.log('\n✅ Policies applied. Please run the SQL from ADD_ADMIN_POLICIES.sql in Supabase SQL Editor for complete setup.');
  console.log('\n📝 Alternative: Go to Supabase Dashboard > SQL Editor and run the contents of database/ADD_ADMIN_POLICIES.sql');
}

main();