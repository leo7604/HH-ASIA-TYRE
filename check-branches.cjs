const { locations } = require('./src/data/mockData.js');

console.log('📍 BRANCH ANALYSIS\n');
console.log('='.repeat(80));

// Count by city
const byCity = {};
locations.forEach(l => {
  byCity[l.city] = (byCity[l.city] || 0) + 1;
});

console.log('\n📊 BRANCHES BY CITY:');
Object.entries(byCity).forEach(([city, count]) => {
  console.log(`  ${city}: ${count} branch(es)`);
});

console.log('\n\n📋 ALL BRANCHES:');
locations.forEach(l => {
  console.log(`\n  ID: ${l.id}`);
  console.log(`  Name: ${l.name}`);
  console.log(`  Area: ${l.area}`);
  console.log(`  City: ${l.city}`);
  console.log(`  Status: ${l.status}`);
  console.log(`  ${l.status === 'open' ? '✅ Available for booking' : '⚠️ Coming soon'}`);
});

console.log('\n\n' + '='.repeat(80));
console.log('📌 SUMMARY:');
console.log(`  Total branches: ${locations.length}`);
console.log(`  Open branches: ${locations.filter(l => l.status === 'open').length}`);
console.log(`  Coming soon: ${locations.filter(l => l.status === 'coming-soon').length}`);
console.log(`  Metro Manila & Cavite: ${locations.filter(l => l.city === 'Metro Manila' || l.city === 'Cavite').length}`);
console.log(`  Ilocos Norte (Laoag): ${locations.filter(l => l.city === 'Ilocos Norte').length}`);
