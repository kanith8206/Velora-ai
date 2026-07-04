const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'productsData.js');
let content = fs.readFileSync(filePath, 'utf-8');

const imagePools = {
  Apple: [
    'https://images.unsplash.com/photo-1695048133142-1a20a5bf616f?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1603898037225-b467e4dd33d6?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=60'
  ],
  Samsung: [
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&auto=format&fit=crop&q=60'
  ],
  Google: [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&auto=format&fit=crop&q=60'
  ],
  phones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=60'
  ],
  laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1531297172867-4f509e51cdb0?w=600&auto=format&fit=crop&q=60'
  ],
  headphones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=60'
  ],
  default: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600&auto=format&fit=crop&q=60'
  ]
};

const counters = {};
const lines = content.split('\n');

let currentBrand = null;
let currentCategory = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const categoryMatch = line.match(/"category":\s*"([^"]+)"/);
  if (categoryMatch) {
    currentCategory = categoryMatch[1];
  }

  const brandMatch = line.match(/"brand":\s*"([^"]+)"/);
  if (brandMatch) {
    currentBrand = brandMatch[1];
  }

  if (line.includes('"image":')) {
    let poolKey = 'default';
    if (imagePools[currentBrand]) {
      poolKey = currentBrand;
    } else if (imagePools[currentCategory]) {
      poolKey = currentCategory;
    }
    
    if (counters[poolKey] === undefined) counters[poolKey] = 0;
    
    const pool = imagePools[poolKey];
    const newImage = pool[counters[poolKey] % pool.length];
    counters[poolKey]++;

    lines[i] = line.replace(/"image":\s*"[^"]+"/, `"image": "${newImage}"`);
  }

  if (line.trim() === '},') {
    currentBrand = null;
    currentCategory = null;
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
console.log('Successfully updated images using diverse image pools!');
