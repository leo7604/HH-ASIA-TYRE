/**
 * Seed Super Admin Data
 * Run this script to populate localStorage with default super admin credentials
 */

const { chromium } = require('@playwright/test');

const BASE_URL = 'http://localhost:5174';

async function seedSuperAdmin() {
  console.log('🌱 Seeding Super Admin Data to localStorage\n');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();
  
  try {
    // Navigate to super admin login page
    await page.goto(`${BASE_URL}/super-admin/login`);
    await page.waitForLoadState('networkidle');
    
    // Check if there's already a super admin
    const existingAdmins = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('super_admins') || '[]');
    });
    
    console.log(`Existing super admins: ${existingAdmins.length}`);
    
    // Default super admin to seed
    const defaultSuperAdmin = {
      id: 1,
      email: 'superadmin@hhasia.com',
      password: 'SuperAdmin2024!',
      fullName: 'Super Administrator',
      role: 'super_admin',
      createdAt: new Date().toISOString()
    };
    
    // Seed super_admins
    await page.evaluate((admins) => {
      // Keep existing admins and add default if not exists
      const existing = JSON.parse(localStorage.getItem('super_admins') || '[]');
      const exists = existing.some(a => a.email === 'superadmin@hhasia.com');
      
      if (!exists) {
        const updated = [...existing, ...admins];
        localStorage.setItem('super_admins', JSON.stringify(updated));
        return updated.length;
      }
      return existing.length;
    }, [defaultSuperAdmin]);
    
    // Verify seeding
    const seededAdmins = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('super_admins') || '[]');
    });
    
    console.log('\n✅ Seeding Complete!');
    console.log(`   Total super admins: ${seededAdmins.length}`);
    
    console.log('\n📋 Super Admin Credentials:');
    seededAdmins.forEach((admin, i) => {
      console.log(`\n   Account ${i + 1}:`);
      console.log(`     Email: ${admin.email}`);
      console.log(`     Password: ${admin.password}`);
      console.log(`     Name: ${admin.fullName}`);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log('\n🎯 You can now login with:');
    console.log('   URL: http://localhost:5174/super-admin/login');
    console.log('   Email: superadmin@hhasia.com');
    console.log('   Password: SuperAdmin2024!');
    
  } catch (error) {
    console.error('\n❌ Seeding Error:', error.message);
  } finally {
    await browser.close();
  }
}

seedSuperAdmin();
