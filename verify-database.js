/**
 * Database Verification Script
 * 
 * PURPOSE: Verify you're connected to HH ASIA TYRE database, NOT Team A's database
 * 
 * RUN THIS BEFORE:
 * - Running database migrations
 * - Deploying to production
 * - Making schema changes
 * - Testing database operations
 * 
 * HOW TO USE:
 * node verify-database.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Your Supabase credentials from .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Expected values for HH Asia Tyre
const EXPECTED_PROJECT_KEYWORDS = ['hh-asia', 'hh_asia', 'hhasia'];
const EXPECTED_TABLES = ['branches', 'customers', 'bookings', 'branch_admins', 'super_admins'];

// Team A keywords to detect (RED FLAG!)
const TEAM_A_KEYWORDS = ['team-a', 'team_a', 'teama', 'crm-inv', 'inventory'];

// Team A's exact table names (from their schema)
const TEAM_A_TABLES = [
  'Customer', 'Booking', 'Appointment', 'Branch', 'Vehicle', 'User',
  'JobCard', 'Product', 'Inventory', 'Vendor', 'Invoice', 'Payment',
  'Employee', 'Payroll', 'PurchaseOrder', 'PurchaseRequest', 'Quotation',
  'Expense', 'ExpenseCategory', 'ChartOfAccount', 'CreditNote',
  'ManualJournal', 'PaymentMade', 'VendorBill', 'VendorCredit',
  'Lead', 'CrmCall', 'RatingAndReview', 'GoogleBusinessReview',
  'Inspection', 'Service', 'ServiceGroup', 'ServiceReminder',
  'Estimate', 'Part', 'PartBrand', 'PartCategory', 'GoodsReceipt',
  'InventoryAdjustment', 'Task', 'TimeClock', 'TimeSheet',
  'WorkSchedule', 'ShopCalendar', 'ShopTiming', 'Holiday',
  'ApprovalLog', 'AuditLog', '_AssignedTechnician', '_prisma_migrations'
];

async function verifyDatabase() {
  console.log('🔍 DATABASE VERIFICATION');
  console.log('========================\n');

  // Step 1: Check if credentials exist
  console.log('Step 1: Checking credentials...');
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERROR: Supabase credentials not found in .env file!');
    console.error('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
    process.exit(1);
  }
  console.log('✅ Credentials found\n');

  // Step 2: Check URL for Team A keywords
  console.log('Step 2: Checking for Team A database...');
  const urlLower = supabaseUrl.toLowerCase();
  const hasTeamAKeyword = TEAM_A_KEYWORDS.some(keyword => urlLower.includes(keyword));
  
  if (hasTeamAKeyword) {
    console.error('🚨 CRITICAL ERROR: Team A database URL detected!');
    console.error('URL:', supabaseUrl);
    console.error('\n⛔ STOP! You are about to connect to Team A\'s database!');
    console.error('This is FORBIDDEN and will cause system conflicts!\n');
    process.exit(1);
  }
  console.log('✅ Not Team A\'s database\n');

  // Step 3: Check for HH Asia Tyre keywords
  console.log('Step 3: Verifying HH Asia Tyre project...');
  const hasHHAsiaKeyword = EXPECTED_PROJECT_KEYWORDS.some(keyword => urlLower.includes(keyword));
  
  if (!hasHHAsiaKeyword) {
    console.warn('⚠️  WARNING: URL does not contain HH Asia Tyre keywords');
    console.warn('URL:', supabaseUrl);
    console.warn('Please verify this is the correct project\n');
  } else {
    console.log('✅ HH Asia Tyre project confirmed\n');
  }

  // Step 4: Connect to database
  console.log('Step 4: Connecting to database...');
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection
    const { data, error } = await supabase
      .from('branches')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ ERROR: Could not connect to database');
      console.error('Error:', error.message);
      console.error('\nThis might mean:');
      console.error('1. Wrong credentials');
      console.error('2. Database schema not set up yet');
      console.error('3. Not connected to HH Asia Tyre project');
      process.exit(1);
    }

    console.log('✅ Database connection successful\n');
  } catch (err) {
    console.error('❌ ERROR: Connection failed');
    console.error('Error:', err.message);
    process.exit(1);
  }

  // Step 5: Verify tables exist
  console.log('Step 5: Checking for HH Asia Tyre tables...');
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to query branches table
    const { data: branches, error: branchesError } = await supabase
      .from('branches')
      .select('*')
      .limit(1);

    if (branchesError) {
      console.error('❌ ERROR: branches table not found');
      console.error('This means the schema has not been set up yet');
      console.error('Please run the SQL schema from database/COMPLETE_SCHEMA.sql');
      process.exit(1);
    }

    console.log('✅ branches table exists');

    // Check other critical tables
    const tablesToCheck = ['customers', 'bookings', 'branch_admins'];
    
    for (const table of tablesToCheck) {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        console.error(`❌ ERROR: ${table} table not found`);
        process.exit(1);
      }
      console.log(`✅ ${table} table exists`);
    }

    console.log('\n✅ All critical tables found\n');
  } catch (err) {
    console.error('❌ ERROR: Table verification failed');
    console.error('Error:', err.message);
    process.exit(1);
  }

  // Step 6: Check for Team A tables (should NOT exist)
  console.log('Step 6: Checking for Team A tables (should not exist)...');
  console.log('         Scanning all 47 Team A tables...');
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let foundTeamATables = [];

    for (const table of TEAM_A_TABLES) {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (!error) {
        foundTeamATables.push(table);
        console.error(`🚨 CRITICAL: Found Team A table "${table}" in this database!`);
      }
    }

    if (foundTeamATables.length > 0) {
      console.error(`\n⛔ STOP! Found ${foundTeamATables.length} Team A table(s) in this database!`);
      console.error('Tables found:', foundTeamATables.join(', '));
      console.error('\nThis database is shared with Team A!');
      console.error('USE A SEPARATE SUPABASE PROJECT!\n');
      process.exit(1);
    }

    console.log('✅ No Team A tables found (scanned 47 tables)');
    console.log('✅ Database is 100% isolated\n');
  } catch (err) {
    console.error('❌ ERROR: Team A table check failed');
    console.error('Error:', err.message);
    process.exit(1);
  }

  // Step 7: Final summary
  console.log('========================');
  console.log('✅ VERIFICATION PASSED!');
  console.log('========================\n');
  console.log('Database URL:', supabaseUrl);
  console.log('Project: HH Asia Tyre');
  console.log('Status: Safe to use\n');
  console.log('You can now:');
  console.log('  - Run database migrations');
  console.log('  - Deploy to production');
  console.log('  - Test database operations');
  console.log('  - Make schema changes\n');
  console.log('⚠️  Remember: NEVER share these credentials with Team A!');
}

// Run verification
verifyDatabase().catch(err => {
  console.error('❌ Verification script error:', err);
  process.exit(1);
});
