const https = require('https');

const pages = [
  ['Homepage', 'https://hh-asia-tyre.vercel.app'],
  ['Booking', 'https://hh-asia-tyre.vercel.app/book'],
  ['Admin Login', 'https://hh-asia-tyre.vercel.app/admin/login'],
  ['Branches', 'https://hh-asia-tyre.vercel.app/branches']
];

async function checkAll() {
  console.log('🚀 Testing hh-asia-tyre.vercel.app\n');
  
  for (const [name, url] of pages) {
    try {
      const res = await new Promise((resolve, reject) => {
        https.get(url, resolve).on('error', reject);
      });
      
      let data = '';
      for await (const chunk of res) {
        data += chunk;
      }
      
      const status = res.statusCode;
      let result = status === 200 ? '✅' : '❌';
      let note = '';
      
      if (status === 200) {
        if (data.includes('supabaseUrl is required') || data.includes('VITE_SUPABASE')) {
          note = 'Missing env vars!';
          result = '❌';
        } else if (data.includes('credentials not found')) {
          note = 'Credentials missing!';
          result = '❌';
        } else if (data.includes('HH Asia') || data.includes('Tyre')) {
          note = 'App loaded!';
        } else {
          note = 'Loaded';
        }
      } else {
        note = `HTTP ${status}`;
      }
      
      console.log(`${result} ${name}: ${status} - ${note}`);
    } catch (e) {
      console.log(`❌ ${name}: ERROR - ${e.message}`);
    }
  }
  
  console.log('\n✅ All pages tested!');
}

checkAll();