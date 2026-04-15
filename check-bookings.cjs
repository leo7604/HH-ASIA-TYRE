// Check current bookings in localStorage
// Run with: node check-bookings.cjs

const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173');
    
    const result = await page.evaluate(() => {
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      return {
        total: appointments.length,
        byStatus: {
          pending: appointments.filter(a => a.status === 'pending').length,
          approved: appointments.filter(a => a.status === 'approved').length,
          completed: appointments.filter(a => a.status === 'completed').length,
          rejected: appointments.filter(a => a.status === 'rejected').length,
        },
        sampleBooking: appointments[0] || null
      };
    });
    
    console.log('📊 Current Bookings Status:\n');
    console.log(`Total Bookings: ${result.total}\n`);
    console.log('By Status:');
    console.log(`  🟠 Pending:   ${result.byStatus.pending}`);
    console.log(`  🔵 Approved:  ${result.byStatus.approved}`);
    console.log(`  🟢 Completed: ${result.byStatus.completed}`);
    console.log(`  🔴 Rejected:  ${result.byStatus.rejected}\n`);
    
    if (result.sampleBooking) {
      console.log('📋 Sample Booking:');
      console.log(`  Customer: ${result.sampleBooking.customerName || 'N/A'}`);
      console.log(`  Status: ${result.sampleBooking.status}`);
      console.log(`  Branch ID: ${result.sampleBooking.branchId}`);
      console.log(`  Date: ${result.sampleBooking.date}`);
    } else {
      console.log('⚠️  No bookings found in localStorage');
      console.log('\n💡 To create bookings:');
      console.log('   1. Visit: http://localhost:5173/book');
      console.log('   2. Fill out the booking form');
      console.log('   3. Submit the booking');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
