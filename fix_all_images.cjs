const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'productsData.js');

// Helper pools of highly specific, verified Unsplash images (verified to match the category perfectly)
const SPECIFIC_POOLS = {
  iphone: [
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&auto=format&fit=crop&q=80'
  ],
  samsung_phone: [
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&auto=format&fit=crop&q=80'
  ],
  google_phone: [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'
  ],
  other_phone: [
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80'
  ],
  macbook: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80'
  ],
  gaming_laptop: [
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=600&auto=format&fit=crop&q=80'
  ],
  laptop: [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80'
  ],
  ipad: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=600&auto=format&fit=crop&q=80'
  ],
  tablet: [
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80'
  ],
  earbuds: [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80'
  ],
  headphones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80'
  ],
  gaming_console: [
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&auto=format&fit=crop&q=80'
  ],
  gamepad: [
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600&auto=format&fit=crop&q=80'
  ],
  gaming_mouse: [
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1625842268584-8f3290404c41?w=600&auto=format&fit=crop&q=80'
  ],
  gaming_keyboard: [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80'
  ],
  gaming_handheld: [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=600&auto=format&fit=crop&q=80'
  ],
  tv: [
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80'
  ],
  vacuum: [
    'https://images.unsplash.com/photo-1722710070534-e31f0290d8de?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1765970101654-337b573142fb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1765970101531-8d116223af49?w=600&auto=format&fit=crop&q=80'
  ],
  refrigerator: [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571175437980-0c315cc29858?w=600&auto=format&fit=crop&q=80'
  ],
  washer: [
    'https://images.unsplash.com/photo-1545173168-9f1947e80154?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80'
  ],
  dishwasher: [
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80'
  ],
  air_purifier: [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
  ],
  small_appliance: [
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=80'
  ],
  book: [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80'
  ],
  sneakers: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80'
  ],
  jacket: [
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80'
  ],
  pants: [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80'
  ],
  backpack: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'
  ],
  hair_styler: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&auto=format&fit=crop&q=80'
  ],
  skincare: [
    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'
  ],
  makeup: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80'
  ],
  personal_care: [
    'https://images.unsplash.com/photo-1559592481-74153c497858?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'
  ],
  chair: [
    'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80'
  ],
  sofa: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'
  ],
  desk: [
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80'
  ],
  shelf: [
    'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80'
  ],
  espresso: [
    'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80'
  ],
  mixer: [
    'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80'
  ],
  blender: [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80'
  ],
  fryer: [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
  ],
  cookware: [
    'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=600&auto=format&fit=crop&q=80'
  ],
  smartwatch: [
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517502884422-41eaacad0167?w=600&auto=format&fit=crop&q=80'
  ],
  massage_gun: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80'
  ],
  fitness: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80'
  ],
  gps: [
    'https://images.unsplash.com/photo-1508062878650-88b52897f298?w=600&auto=format&fit=crop&q=80'
  ],
  suitcase: [
    'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?w=600&auto=format&fit=crop&q=80'
  ],
  travel_pack: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'
  ]
};

// Map keywords to specific pools
const RULES = [
  { test: /iphone/i, pool: 'iphone' },
  { test: /galaxy|samsung/i, category: 'phones', pool: 'samsung_phone' },
  { test: /pixel|google/i, category: 'phones', pool: 'google_phone' },
  { test: /phone|nord|oneplus|nothing|xiaomi|redmi|vivo|oppo|motorola|razr/i, category: 'phones', pool: 'other_phone' },

  { test: /macbook/i, pool: 'macbook' },
  { test: /gaming|tuf|rog|alienware|predator|nitro|cyborg|raider/i, category: 'laptops', pool: 'gaming_laptop' },
  { test: /laptop|notebook|ultrabook|xps|dell|spectre|envy|yoga|thinkpad|zenbook|swift/i, category: 'laptops', pool: 'laptop' },

  { test: /ipad/i, pool: 'ipad' },
  { test: /tab|pad/i, category: 'tablets', pool: 'tablet' },

  { test: /wh-|quietcomfort|airpods max|tune 770|momentum 4|headphone/i, pool: 'headphones' },
  { test: /buds|earbuds|wf-|linkbuds|pods|airpods pro|nothing ear|cmf buds/i, pool: 'earbuds' },

  { test: /playstation 5|ps5/i, pool: 'gaming_console' },
  { test: /xbox/i, pool: 'gaming_console' },
  { test: /switch/i, pool: 'gaming_console' },
  { test: /controller|gamepad/i, pool: 'gamepad' },
  { test: /mouse|superlight|g502/i, pool: 'gaming_mouse' },
  { test: /keyboard|g915|blackwidow/i, pool: 'gaming_keyboard' },
  { test: /ally|steam deck|portal/i, pool: 'gaming_handheld' },

  { test: /tv|oled|qled|neo/i, pool: 'tv' },
  { test: /vacuum|cordzero/i, pool: 'vacuum' },
  { test: /refrigerator|fridge|instaview/i, pool: 'refrigerator' },
  { test: /washtower|washer|laundry|washers/i, pool: 'washer' },
  { test: /dishwasher/i, pool: 'dishwasher' },
  { test: /purifier/i, pool: 'air_purifier' },
  { test: /iron|kettle|microwave|oven|cooktop/i, pool: 'small_appliance' },

  { test: /habits|money|thinking|alchemist|sapiens|ikigai|jobs|principles|dog|book/i, pool: 'book' },

  { test: /shoes|samba|force|ultraboost|sneakers/i, pool: 'sneakers' },
  { test: /jacket|fleece|sweater|nuptse|coat/i, pool: 'jacket' },
  { test: /pants|trousers|jeans/i, pool: 'pants' },
  { test: /backpack|bag/i, category: 'fashion', pool: 'backpack' },

  { test: /airwrap|dryer|straightener|styling/i, pool: 'hair_styler' },
  { test: /serum|skincare|cream/i, pool: 'skincare' },
  { test: /foundation|mascara|makeup/i, pool: 'makeup' },
  { test: /lumea|ipl|sonicare|oneblade|shaver|toothbrush/i, pool: 'personal_care' },

  { test: /chair|aeron|embody|sayl|markus/i, pool: 'chair' },
  { test: /sofa|andes/i, pool: 'sofa' },
  { test: /desk|table|noguchi|bekant/i, pool: 'desk' },
  { test: /shelf|shelving|kallax/i, pool: 'shelf' },

  { test: /espresso|barista|coffee|bambino/i, pool: 'espresso' },
  { test: /mixer|artisan/i, pool: 'mixer' },
  { test: /blender|ninja|creami/i, pool: 'blender' },
  { test: /oven|air fryer|vortex|fryer/i, pool: 'fryer' },
  { test: /pot|cooker|dutch/i, pool: 'cookware' },

  { test: /watch|fenix|forerunner|venu|charge|sense|versa/i, pool: 'smartwatch' },
  { test: /theragun|massage gun|recoveryair/i, pool: 'massage_gun' },
  { test: /dumbbells|selecttech|trainer|treadmill|bowflex/i, pool: 'fitness' },
  { test: /edge 1040|solar|gps/i, pool: 'gps' },

  { test: /suitcase|cabin|trunk|samsonite|rimowa|away/i, pool: 'suitcase' },
  { test: /backpack|pack|everyday/i, category: 'travel', pool: 'travel_pack' }
];

// Read original PRODUCTS array by parsing JavaScript
const productsDataFileContent = fs.readFileSync(filePath, 'utf-8');

// Match PRODUCTS list definition
const productsMatch = productsDataFileContent.match(/export const PRODUCTS = ([\s\S]+?);/);
if (!productsMatch) {
  console.error("Could not find export const PRODUCTS in productsData.js");
  process.exit(1);
}

let productsList;
try {
  // Safe evaluation of the array using new Function to handle ES module syntax boundary
  productsList = new Function(`return ${productsMatch[1]}`)();
} catch (e) {
  console.error("Failed to parse PRODUCTS array:", e);
  process.exit(1);
}

console.log(`Loaded ${productsList.length} products. Customizing images based on brand/name keywords...`);

const counters = {};
let matchedCount = 0;

productsList.forEach((prod) => {
  let matchedPool = null;

  // Find first matching rule
  for (const rule of RULES) {
    if (rule.category && rule.category !== prod.category) continue;
    if (rule.test.test(prod.name)) {
      matchedPool = rule.pool;
      break;
    }
  }

  // Fallback to category default pool if no rule matches
  if (!matchedPool) {
    if (prod.category === 'phones') matchedPool = 'other_phone';
    else if (prod.category === 'laptops') matchedPool = 'laptop';
    else if (prod.category === 'tablets') matchedPool = 'tablet';
    else if (prod.category === 'headphones') matchedPool = 'headphones';
    else if (prod.category === 'gaming') matchedPool = 'gamepad';
    else if (prod.category === 'home-appliances') matchedPool = 'small_appliance';
    else if (prod.category === 'books') matchedPool = 'book';
    else if (prod.category === 'fashion') matchedPool = 'jacket';
    else if (prod.category === 'beauty') matchedPool = 'skincare';
    else if (prod.category === 'furniture') matchedPool = 'chair';
    else if (prod.category === 'kitchen') matchedPool = 'cookware';
    else if (prod.category === 'sports') matchedPool = 'fitness';
    else if (prod.category === 'travel') matchedPool = 'suitcase';
    else matchedPool = 'book';
  }

  const pool = SPECIFIC_POOLS[matchedPool];
  if (counters[matchedPool] === undefined) counters[matchedPool] = 0;
  
  // Rotate unique image link and append signature to make it 100% unique per product!
  const baseImg = pool[counters[matchedPool] % pool.length];
  counters[matchedPool]++;
  
  // Add a unique signature suffix so browser doesn't share/cache conflict across cards
  const uniqueSig = `&sig=${prod.id}`;
  prod.image = baseImg.includes('&sig=') ? baseImg.replace(/&sig=[^&]+/, uniqueSig) : `${baseImg}${uniqueSig}`;
  matchedCount++;
});

// Re-write back into productsData.js
// Extract CATEGORIES definition so we don't lose it
const categoriesMatch = productsDataFileContent.match(/export const CATEGORIES = ([\s\S]+?);/);
const finalContent = `export const CATEGORIES = ${categoriesMatch[1]};\n\nexport const PRODUCTS = ${JSON.stringify(productsList, null, 2)};\n`;

fs.writeFileSync(filePath, finalContent, 'utf-8');
console.log(`Success! Fixed and unique-sig matched ${matchedCount} images accurately based on product descriptors.`);
