import fs from 'fs';
import { CATEGORIES, PRODUCTS } from './src/productsData.js';

// Helper to get random item
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

PRODUCTS.forEach(p => {
  if (p.category === 'phones') {
    p.specs = {
      Display: sample(['6.1" OLED, 120Hz', '6.7" AMOLED, 120Hz', '6.8" Dynamic AMOLED 2X', '6.1" Super Retina XDR']),
      Processor: sample(['A17 Pro', 'Snapdragon 8 Gen 3', 'Tensor G3', 'Dimensity 9300']),
      Camera: sample(['48MP Main + 12MP UW + 12MP Tele', '200MP Main + 50MP Tele + 12MP UW', '50MP Main + 48MP Tele']),
      Battery: sample(['4000mAh, 25W fast charge', '5000mAh, 45W fast charge', '4422mAh, 15W wireless', '4600mAh']),
      Storage: sample(['128GB / 256GB / 512GB', '256GB / 512GB / 1TB', '512GB / 1TB']),
      ...p.specs
    };
    p.pros = [
      sample(['Incredible camera performance', 'Stunningly bright display', 'All-day battery life']),
      sample(['Premium titanium build', 'Smooth 120Hz refresh rate', 'Excellent AI features'])
    ];
    p.cons = [
      sample(['Expensive flagship price', 'No charger included in box', 'Heavy weight']),
      sample(['Software takes time to learn', 'Fingerprint magnet', 'Slightly bulky camera bump'])
    ];
  } else if (p.category === 'laptops') {
    p.specs = {
      Display: sample(['14" Liquid Retina XDR', '16" Mini-LED, 120Hz', '13.4" OLED Touch', '15.6" 4K IPS']),
      Processor: sample(['M3 Max, 14-core', 'Intel Core Ultra 7', 'AMD Ryzen 9 8945HS', 'M3 Pro, 12-core']),
      RAM: sample(['16GB Unified', '32GB LPDDR5x', '64GB Unified', '16GB DDR5']),
      Storage: sample(['512GB NVMe SSD', '1TB PCIe 4.0 SSD', '2TB NVMe SSD']),
      Battery: sample(['70Wh, up to 18 hrs', '99.9Wh, up to 22 hrs', '65Wh']),
      ...p.specs
    };
    p.pros = [
      sample(['Class-leading battery life', 'Phenomenal performance', 'Gorgeous display']),
      sample(['Excellent keyboard and trackpad', 'Sleek and lightweight design', 'Great thermals'])
    ];
    p.cons = [
      sample(['Cannot upgrade RAM or storage', 'Expensive configuration upgrades', 'Limited port selection']),
      sample(['No touchscreen option', 'Webcam is only 720p', 'Gets warm under heavy load'])
    ];
  } else {
    // Generic enrichment
    p.specs = {
      Quality: sample(['Premium Grade', 'Standard Grade', 'Professional Grade']),
      Warranty: sample(['1 Year Limited', '2 Year Extended', 'Lifetime Support']),
      ...p.specs
    };
    p.pros = [
      sample(['Highly durable', 'Easy to use', 'Great aesthetics', 'Fast operation']),
      sample(['Good value for money', 'Reliable performance', 'Excellent customer support'])
    ];
    p.cons = [
      sample(['Requires maintenance', 'Higher price point', 'Steep learning curve']),
      sample(['Bulky design', 'Limited color options', 'May not fit all setups'])
    ];
  }
});

const output = \`export const CATEGORIES = \${JSON.stringify(CATEGORIES, null, 2)};

export const PRODUCTS = \${JSON.stringify(PRODUCTS, null, 2)};
\`;

fs.writeFileSync('src/productsData.js', output);
console.log('Data enriched successfully!');
