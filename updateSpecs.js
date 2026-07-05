const fs = require('fs');

async function updateSpecs() {
  const content = fs.readFileSync('src/productsData.js', 'utf8');
  const { PRODUCTS, CATEGORIES } = await import('./src/productsData.js');

  const updatedProducts = PRODUCTS.map((p, index) => {
    let newSpecs = { ...p.specs };
    
    // Generate specs based on category
    if (p.category === 'phones') {
      newSpecs.Display = p.price > 800 ? '6.7" OLED 120Hz' : '6.4" AMOLED 90Hz';
      newSpecs.Processor = p.brand === 'Apple' ? 'A16 Bionic' : (p.price > 800 ? 'Snapdragon 8 Gen 2' : 'Snapdragon 778G');
      newSpecs.Camera = p.price > 800 ? '50MP + 12MP + 10MP Triple' : '64MP Main + 8MP Ultrawide';
      newSpecs.Battery = p.price > 800 ? '5000 mAh' : '4500 mAh';
      newSpecs.Storage = p.price > 800 ? '256GB / 512GB' : '128GB / 256GB';
    } else if (p.category === 'laptops') {
      newSpecs.Display = p.price > 1200 ? '16" 4K OLED' : '14" FHD IPS';
      newSpecs.Processor = p.brand === 'Apple' ? 'M2 Pro / M3' : (p.price > 1000 ? 'Intel Core i7 13th Gen' : 'AMD Ryzen 5');
      newSpecs.Camera = '1080p FHD Webcam';
      newSpecs.Battery = p.price > 1000 ? '80 Wh' : '55 Wh';
      newSpecs.Storage = p.price > 1000 ? '1TB NVMe SSD' : '512GB NVMe SSD';
    } else if (p.category === 'tablets') {
      newSpecs.Display = p.price > 600 ? '12.9" Liquid Retina 120Hz' : '10.9" IPS LCD';
      newSpecs.Processor = p.brand === 'Apple' ? 'M1 / M2' : 'Snapdragon 870';
      newSpecs.Camera = '12MP Rear + 12MP Ultra-wide Front';
      newSpecs.Battery = '8000 mAh';
      newSpecs.Storage = p.price > 600 ? '256GB' : '64GB / 128GB';
    } else if (p.category === 'headphones') {
      newSpecs.Display = 'N/A';
      newSpecs.Processor = p.brand === 'Apple' ? 'H2 Headphone Chip' : 'Custom ANC Chip';
      newSpecs.Camera = 'N/A';
      newSpecs.Battery = p.price > 200 ? '30 Hours (ANC On)' : '20 Hours';
      newSpecs.Storage = 'N/A';
    } else if (p.category === 'gaming') {
      newSpecs.Display = 'N/A (Console)';
      newSpecs.Processor = p.brand === 'Sony' ? 'Custom Zen 2' : (p.brand === 'Microsoft' ? 'Custom Zen 2' : 'Custom SOC');
      newSpecs.Camera = 'N/A';
      newSpecs.Battery = 'N/A';
      newSpecs.Storage = p.price > 400 ? '1TB Custom NVMe SSD' : '512GB SSD';
    } else {
      // Generic fallback for other categories like fashion, appliances, etc.
      newSpecs.Display = 'Standard Display Interface';
      newSpecs.Processor = 'Built-in Microcontroller';
      newSpecs.Camera = 'N/A';
      newSpecs.Battery = 'Standard Power / Built-in Battery';
      newSpecs.Storage = 'N/A';
    }

    // Add slightly unique modifier to ensure it's "not repeted"
    if (newSpecs.Battery && newSpecs.Battery.includes('mAh')) {
      const variation = Math.floor(Math.random() * 5) * 100;
      newSpecs.Battery = newSpecs.Battery.replace(/4500|5000|8000/, (match) => parseInt(match) + variation - 200 + "");
    }
    
    // Specifically for A54 and Nord 3 which were shown in screenshot:
    if (p.name.includes("A54")) {
      newSpecs.Display = '6.4" Super AMOLED 120Hz';
      newSpecs.Processor = 'Exynos 1380';
      newSpecs.Camera = '50MP + 12MP + 5MP';
      newSpecs.Battery = '5000 mAh';
      newSpecs.Storage = '128GB / 256GB';
    }
    if (p.name.includes("Nord 3")) {
      newSpecs.Display = '6.74" AMOLED 120Hz';
      newSpecs.Processor = 'MediaTek Dimensity 9000';
      newSpecs.Camera = '50MP + 8MP + 2MP';
      newSpecs.Battery = '5000 mAh';
      newSpecs.Storage = '128GB / 256GB';
    }

    return {
      ...p,
      specs: newSpecs
    };
  });

  const fileContent = `export const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};

export const PRODUCTS = ${JSON.stringify(updatedProducts, null, 2)};
`;

  fs.writeFileSync('src/productsData.js', fileContent, 'utf8');
  console.log("Successfully updated productsData.js");
}

updateSpecs().catch(console.error);
