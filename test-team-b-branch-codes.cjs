/**
 * Test Team B API with different branch code formats
 */

const TEAM_B_API_URL = 'https://hh-asia-tyre-crm-inv-sys.vercel.app/api/public/bookings';

async function testBranchCodes() {
  console.log(' Testing Team B API with different branch formats\n');
  console.log('='.repeat(70));

  const branchFormats = [
    { name: 'ALABANG (uppercase)', value: 'ALABANG' },
    { name: 'alabang (lowercase)', value: 'alabang' },
    { name: 'Alabang (title case)', value: 'Alabang' },
    { name: '1 (numeric)', value: 1 },
    { name: 'ALABANG BRANCH', value: 'ALABANG BRANCH' },
    { name: 'Goodyear Alabang', value: 'Goodyear Alabang' }
  ];

  for (const branch of branchFormats) {
    console.log(`\n📡 Testing: ${branch.name} = "${branch.value}"`);
    console.log('-'.repeat(70));

    const payload = {
      customerName: 'Branch Test Customer',
      phone: '09179999999',
      email: 'branch.test@hhasia.com',
      service: 'Tire Rotation',
      serviceType: 'Tire Rotation',
      vehicleMake: 'Honda',
      vehicleModel: 'Civic',
      vehicleYear: '2024',
      plateNumber: `TEST-${Date.now()}`,
      preferredDate: '2026-05-01',
      preferredTime: '10:00',
      branch: branch.value,
      notes: 'Branch code format test',
      status: 'pending'
    };

    try {
      const response = await fetch(TEAM_B_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`✅ SUCCESS! Status: ${response.status}`);
        console.log(`   This format works: branch = "${branch.value}"`);
        console.log(`   Response: ${JSON.stringify(result).substring(0, 200)}`);
        console.log('\n🎯 RECOMMENDED: Use this branch format!');
        return; // Stop testing once we find a working format
      } else {
        console.log(`❌ FAILED - Status: ${response.status}`);
        console.log(`   Error: ${result.error || result.message || 'Unknown'}`);
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }

    // Wait 1 second between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n\n' + '='.repeat(70));
  console.log('⚠️  No working branch format found');
  console.log('='.repeat(70));
  console.log('\nPossible issues:');
  console.log('1. Team B API expects different branch names');
  console.log('2. API may be down or misconfigured');
  console.log('3. Contact Team B for correct branch code format');
}

testBranchCodes();
