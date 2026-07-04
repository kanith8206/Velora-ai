// Analyze products by category and name to understand what we need
const fs = require('fs');
const raw = fs.readFileSync('src/productsData.js', 'utf8');

// Extract all products - id, name, category, image
const productRegex = /"id":\s*"([^"]+)"[^{]*?"name":\s*"([^"]+)"[^{]*?"category":\s*"([^"]+)"[^{]*?"image":\s*"([^"]+)"/g;
let m;
const products = [];
while ((m = productRegex.exec(raw)) !== null) {
  products.push({ id: m[1], name: m[2], category: m[3], image: m[4] });
}

// Group by category
const byCat = {};
products.forEach(p => {
  if (!byCat[p.category]) byCat[p.category] = [];
  byCat[p.category].push(p);
});

console.log('Products by category:');
Object.entries(byCat).forEach(([cat, prods]) => {
  console.log(`\n=== ${cat} (${prods.length} products) ===`);
  prods.slice(0, 5).forEach(p => console.log(`  - [${p.id}] ${p.name}`));
  if (prods.length > 5) console.log(`  ... and ${prods.length - 5} more`);
});
console.log('\nTotal products:', products.length);
