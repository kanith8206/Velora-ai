/**
 * check_and_fix_images.cjs
 * Checks every image URL in productsData.js and replaces broken ones
 * with working, product-appropriate Unsplash images.
 * Preserves all working images.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ─── WORKING FALLBACK IMAGE POOLS ──────────────────────────────────────────
// These are carefully chosen, confirmed-working Unsplash image IDs.
const IMAGE_POOLS = {
  phones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&auto=format&fit=crop&q=60',
  ],
  laptops: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=600&auto=format&fit=crop&q=60',
  ],
  tablets: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=600&auto=format&fit=crop&q=60',
  ],
  headphones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1491927570842-0261e477d937?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1520170350707-b2da59970118?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=600&auto=format&fit=crop&q=60',
  ],
  gaming: [
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&auto=format&fit=crop&q=60',
  ],
  'home-appliances': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=60',
  ],
  books: [
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=600&auto=format&fit=crop&q=60',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=60',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&auto=format&fit=crop&q=60',
  ],
  furniture: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&auto=format&fit=crop&q=60',
  ],
  kitchen: [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1565608438257-fac3c27bdbca?w=600&auto=format&fit=crop&q=60',
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1508062878650-88b52897f298?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1590771998996-8589ec9b5ac6?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=600&auto=format&fit=crop&q=60',
  ],
  travel: [
    'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&auto=format&fit=crop&q=60',
  ],
  default: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600&auto=format&fit=crop&q=60',
  ],
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
function checkUrl(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    try {
      const req = mod.request(url, { method: 'HEAD', timeout: 8000 }, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

// Pool iterators per category (so each broken product gets a different image)
const poolCounters = {};
function getNextImage(category) {
  const pool = IMAGE_POOLS[category] || IMAGE_POOLS.default;
  if (!poolCounters[category]) poolCounters[category] = 0;
  const img = pool[poolCounters[category] % pool.length];
  poolCounters[category]++;
  return img;
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
async function main() {
  const filePath = path.join(__dirname, 'src', 'productsData.js');
  const raw = fs.readFileSync(filePath, 'utf8');

  // Extract every image URL from the file (with line context)
  const imageRegex = /"image":\s*"(https?:\/\/[^"]+)"/g;
  let match;
  const allUrls = new Map(); // url -> first occurrence (to avoid duplicate checks)
  while ((match = imageRegex.exec(raw)) !== null) {
    if (!allUrls.has(match[1])) {
      allUrls.set(match[1], match.index);
    }
  }

  console.log(`\n🔍 Found ${allUrls.size} unique image URLs to check...\n`);

  // Check each unique URL
  const brokenUrls = new Set();
  let checked = 0;
  for (const [url] of allUrls) {
    checked++;
    process.stdout.write(`\r  Checking ${checked}/${allUrls.size}: ${url.substring(0, 60)}...`);
    const ok = await checkUrl(url);
    if (!ok) {
      brokenUrls.add(url);
      console.log(`\n  ❌ BROKEN: ${url}`);
    }
  }

  console.log(`\n\n✅ Check complete. Found ${brokenUrls.size} broken URL(s).\n`);

  if (brokenUrls.size === 0) {
    console.log('All images are working! No changes needed.');
    return;
  }

  // Now fix the file: replace each broken URL in its product context
  // We need to find the category for each broken product occurrence
  // Strategy: parse product blocks and replace image field by field
  let fixed = raw;
  let fixCount = 0;

  // For each product block, find the category and image fields and replace if broken
  const productBlockRegex = /\{[^{}]*?"id":\s*"([^"]+)"[^{}]*?"category":\s*"([^"]+)"[^{}]*?"image":\s*"([^"]+)"[^{}]*?\}/gs;

  // Build a map: broken URL + category -> replacement URL
  // We process the file line-by-line approach: find each "image": "..." line 
  // and look backwards for the nearest "category": "..." to determine what image to use.

  const lines = raw.split('\n');
  const newLines = [...lines];
  let lastCategory = 'default';

  for (let i = 0; i < lines.length; i++) {
    const catMatch = lines[i].match(/"category":\s*"([^"]+)"/);
    if (catMatch) lastCategory = catMatch[1];

    const imgMatch = lines[i].match(/"image":\s*"([^"]+)"/);
    if (imgMatch) {
      const url = imgMatch[1];
      if (brokenUrls.has(url)) {
        const replacement = getNextImage(lastCategory);
        newLines[i] = lines[i].replace(url, replacement);
        console.log(`  🔧 Fixed [${lastCategory}] broken image → ${replacement}`);
        fixCount++;
      }
    }
  }

  const result = newLines.join('\n');
  fs.writeFileSync(filePath, result, 'utf8');
  console.log(`\n✅ Done! Replaced ${fixCount} broken image occurrences in productsData.js\n`);
}

main().catch(console.error);
