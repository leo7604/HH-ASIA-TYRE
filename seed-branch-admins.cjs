/**
 * Seed Branch Admin Data
 * Run this script to populate localStorage with branch admin credentials
 */

const { chromium } = require('@playwright/test');

const BASE_URL = 'http://localhost:5174';

async function seedBranchAdmins() {
  console.log('🌱 Seeding Branch Admin Data to localStorage\n');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();
  
  try {
    // Navigate to a page to access localStorage
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    // Branch admin data to seed
    const branchAdmins = [
      {
        id: 1,
        fullName: 'Alabang Admin',
        email: 'alabang.admin@hhasia.com',
        password: 'admin123',
        branchId: 1,
        role: 'branch_admin'
      },
      {
        id: 2,
        fullName: 'Bicutan Admin',
        email: 'bicutan.admin@hhasia.com',
        password: 'admin123',
        branchId: 2,
        role: 'branch_admin'
      },
      {
        id: 3,
        fullName: 'Bacoor Admin',
        email: 'bacoor.admin@hhasia.com',
        password: 'admin123',
        branchId: 3,
        role: 'branch_admin'
      },
      {
        id: 4,
        fullName: 'Sucat Admin',
        email: 'sucat.admin@hhasia.com',
        password: 'admin123',
        branchId: 4,
        role: 'branch_admin'
      },
      {
        id: 5,
        fullName: 'Sucat2 Admin',
        email: 'sucat2.admin@hhasia.com',
        password: 'admin123',
        branchId: 5,
        role: 'branch_admin'
      },
      {
        id: 6,
        fullName: 'Laoag Admin',
        email: 'laoag.admin@hhasia.com',
        password: 'admin123',
        branchId: 6,
        role: 'branch_admin'
      }
    ];
    
    // Seed branch_admins (snake_case key)
    await page.evaluate((admins) => {
      localStorage.setItem('branch_admins', JSON.stringify(admins));
      console.log('Seeded branch_admins:', admins.length, 'admins');
    }, branchAdmins);
    
    // Also seed branchAdmins (camelCase key) for compatibility
    await page.evaluate((admins) => {
      localStorage.setItem('branchAdmins', JSON.stringify(admins));
      console.log('Seeded branchAdmins:', admins.length, 'admins');
    }, branchAdmins);
    
    // Verify seeding
    const seededAdmins = await page.evaluate(() => {
      const admins1 = JSON.parse(localStorage.getItem('branch_admins') || '[]');
      const admins2 = JSON.parse(localStorage.getItem('branchAdmins') || '[]');
      return {
        branch_admins: admins1.length,
        branchAdmins: admins2.length
      };
    });
    
    console.log('\n✅ Seeding Complete!');
    console.log(`   branch_admins: ${seededAdmins.branch_admins} admins`);
    console.log(`   branchAdmins: ${seededAdmins.branchAdmins} admins`);
    
    console.log('\n📋 Branch Admin Credentials:');
    console.log('   (All passwords are: admin123)\n');
    
    branchAdmins.forEach(admin => {
      console.log(`   ${admin.email}`);
    });
    
    console.log('\n' + '='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Seeding Error:', error.message);
  } finally {
    await browser.close();
  }
}

seedBranchAdmins();
