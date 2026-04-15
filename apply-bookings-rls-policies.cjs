/**
 * Apply Bookings RLS Policies to Supabase
 * 
 * IMPORTANT: This script provides instructions for applying RLS policies
 * Supabase REST API does not support DDL statements, so you MUST run the SQL manually
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 SUPABASE RLS POLICY APPLICATION GUIDE\n');
console.log('='.repeat(60));

const sqlFilePath = path.join(__dirname, 'database', 'BOOKINGS_RLS_POLICIES.sql');

// Check if SQL file exists
if (!fs.existsSync(sqlFilePath)) {
  console.error('❌ SQL file not found:', sqlFilePath);
  process.exit(1);
}

const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

console.log('📋 SQL File Found: database/BOOKINGS_RLS_POLICIES.sql\n');
console.log('='.repeat(60));

console.log('\n⚠️  IMPORTANT: Supabase REST API does not support DDL statements');
console.log('   You MUST apply these policies manually via Supabase Dashboard\n');

console.log('📝 STEP-BY-STEP INSTRUCTIONS:\n');

console.log('1️⃣  Open Supabase Dashboard');
console.log('   → Go to: https://supabase.com/dashboard');
console.log('   → Select project: knghsmttizcoecgwyfdk (HH Asia Tyre)\n');

console.log('2️⃣  Navigate to SQL Editor');
console.log('   → Click "SQL Editor" in the left sidebar\n');

console.log('3️⃣  Create New Query');
console.log('   → Click "New query" button\n');

console.log('4️⃣  Copy and Paste SQL');
console.log('   → Copy the entire content from:');
console.log(`     ${sqlFilePath}`);
console.log('   → Paste into the SQL Editor\n');

console.log('5️⃣  Execute the SQL');
console.log('   → Click "Run" button or press Ctrl+Enter');
console.log('   → Wait for execution to complete\n');

console.log('6️⃣  Verify Policies Applied');
console.log('   → You should see output showing all policies');
console.log('   → Expected tables with policies:');
console.log('     • bookings (5 policies)');
console.log('     • customers (1 policy)');
console.log('     • vehicles (1 policy)');
console.log('     • branches (2 policies)');
console.log('     • service_bays (1 policy)\n');

console.log('='.repeat(60));
console.log('📊 POLICIES THAT WILL BE APPLIED:\n');

const policies = [
  { table: 'bookings', policy: 'Anyone can create bookings', action: 'INSERT' },
  { table: 'bookings', policy: 'Customers can view own bookings', action: 'SELECT' },
  { table: 'bookings', policy: 'Anyone can update bookings', action: 'UPDATE' },
  { table: 'bookings', policy: 'Anyone can delete bookings', action: 'DELETE' },
  { table: 'bookings', policy: 'Full access for now', action: 'ALL' },
  { table: 'customers', policy: 'Full access customers', action: 'ALL' },
  { table: 'vehicles', policy: 'Full access vehicles', action: 'ALL' },
  { table: 'branches', policy: 'Anyone can view active branches', action: 'SELECT' },
  { table: 'branches', policy: 'Full access branches', action: 'ALL' },
  { table: 'service_bays', policy: 'Full access service_bays', action: 'ALL' }
];

policies.forEach((p, i) => {
  console.log(`   ${i + 1}. ${p.table.padEnd(15)} | ${p.policy.padEnd(40)} | ${p.action}`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ VERIFICATION AFTER APPLYING:\n');

console.log('After running the SQL, you can verify policies are applied by:\n');

console.log('Option 1: Via Dashboard');
console.log('   → Go to "Authentication" → "Policies"');
console.log('   → Select each table and verify policies exist\n');

console.log('Option 2: Via SQL Query');
console.log('   → Run this query in SQL Editor:');
console.log('     SELECT tablename, policyname, cmd');
console.log('     FROM pg_policies');
console.log("     WHERE schemaname = 'public'");
console.log('     ORDER BY tablename, policyname;\n');

console.log('Option 3: Run Test');
console.log('   → After applying, run: node test-booking-api.cjs');
console.log('   → All booking operations should pass\n');

console.log('='.repeat(60));
console.log('🎯 NEXT STEPS AFTER APPLYING:\n');

console.log('1. Verify all 10 policies are applied');
console.log('2. Run booking API test: node test-booking-api.cjs');
console.log('3. Run full migration test: node test-full-migration.cjs');
console.log('4. Test booking creation through UI at http://localhost:5175/book\n');

console.log('='.repeat(60));
console.log('⚠️  TROUBLESHOOTING:\n');

console.log('If you get errors:');
console.log('• "policy already exists" → DROP POLICY first, then CREATE');
console.log('• "table does not exist" → Check table names in Supabase');
console.log('• "permission denied" → Ensure you have admin access');
console.log('• RLS blocking inserts → Verify policies allow anonymous access\n');

console.log('='.repeat(60));
console.log('\n📄 SQL file location:');
console.log(`   ${sqlFilePath}\n`);

console.log('💡 Tip: The SQL uses DROP POLICY IF EXISTS before CREATE,');
console.log('   so it\'s safe to run multiple times (idempotent).\n');
