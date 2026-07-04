const fs = require('fs');

const CATEGORIES = [
  { id: 'phones', name: 'Smartphones', description: 'Latest smartphones with high-end cameras and powerful chips.', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60' },
  { id: 'laptops', name: 'Laptops', description: 'Premium notebooks for productivity, creativity, and development.', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60' },
  { id: 'tablets', name: 'Tablets', description: 'Versatile tablets for entertainment, drawing, and portable work.', icon: 'Tablet', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=60' },
  { id: 'headphones', name: 'Headphones', description: 'Premium noise-canceling headphones and audiophile gear.', icon: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60' },
  { id: 'gaming', name: 'Gaming', description: 'Consoles, high-refresh monitors, and gaming hardware.', icon: 'Gamepad2', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=60' },
  { id: 'home-appliances', name: 'Home Appliances', description: 'Smart vacuums, purifiers, and automated home helpers.', icon: 'Home', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=60' },
  { id: 'books', name: 'Books', description: 'Best-selling self-help, non-fiction, and design books.', icon: 'BookOpen', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=60' },
  { id: 'fashion', name: 'Fashion', description: 'Timeless outerwear, footwear, and designer accessories.', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=60' },
  { id: 'beauty', name: 'Beauty', description: 'Advanced hair care, skincare, and high-tech styling tools.', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=60' },
  { id: 'furniture', name: 'Furniture', description: 'Ergonomic chairs and design-focused home furniture.', icon: 'Armchair', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=60' },
  { id: 'kitchen', name: 'Kitchen', description: 'Espresso machines, multi-cookers, and design cookware.', icon: 'Coffee', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60' },
  { id: 'sports', name: 'Sports', description: 'Smartwatches, recovery tools, and premium fitness gear.', icon: 'Flame', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60' },
  { id: 'travel', name: 'Travel', description: 'Indestructible suitcases, travel packs, and organizers.', icon: 'Compass', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=60' }
];

const BRAND_MODELS = {
  phones: [
    { brand: 'Apple', models: ['iPhone 15 Pro Max', 'iPhone 15', 'iPhone 14 Pro', 'iPhone SE'] },
    { brand: 'Samsung', models: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy A54'] },
    { brand: 'Google', models: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel Fold'] },
    { brand: 'OnePlus', models: ['OnePlus 12', 'OnePlus 12R', 'OnePlus Open', 'OnePlus Nord 3'] },
    { brand: 'Nothing', models: ['Nothing Phone (2)', 'Nothing Phone (2a)'] },
    { brand: 'Xiaomi', models: ['Xiaomi 14 Ultra', 'Xiaomi 14 Pro', 'Redmi Note 13 Pro+'] },
    { brand: 'Vivo', models: ['Vivo X100 Pro', 'Vivo V30 Pro'] },
    { brand: 'OPPO', models: ['OPPO Find X7 Ultra', 'OPPO Reno 11 Pro'] },
    { brand: 'Motorola', models: ['Motorola Edge 50 Pro', 'Motorola Razr 40 Ultra', 'Moto G Power'] }
  ],
  laptops: [
    { brand: 'Apple', models: ['MacBook Pro 16" M3 Max', 'MacBook Pro 14" M3', 'MacBook Air 15" M3', 'MacBook Air 13" M2'] },
    { brand: 'Dell', models: ['XPS 15', 'XPS 13 Plus', 'Alienware m18', 'Inspiron 16 Plus'] },
    { brand: 'HP', models: ['Spectre x360 14', 'Envy x360', 'Omen Transcend 16', 'Pavilion Plus 14'] },
    { brand: 'Lenovo', models: ['Yoga 9i', 'ThinkPad X1 Carbon Gen 11', 'Legion Pro 7i', 'IdeaPad Slim 5'] },
    { brand: 'ASUS', models: ['Zenbook 14 OLED', 'ROG Zephyrus G14', 'Vivobook Pro 15', 'TUF Gaming A15'] },
    { brand: 'Acer', models: ['Swift Go 14', 'Predator Helios 16', 'Nitro 5', 'Aspire 5'] },
    { brand: 'MSI', models: ['Stealth 16 Studio', 'Raider GE78', 'Prestige 14 Evo', 'Cyborg 15'] }
  ],
  tablets: [
    { brand: 'Apple', models: ['iPad Pro 12.9" M2', 'iPad Air 5th Gen', 'iPad mini 6', 'iPad 10th Gen'] },
    { brand: 'Samsung', models: ['Galaxy Tab S9 Ultra', 'Galaxy Tab S9+', 'Galaxy Tab S9 FE', 'Galaxy Tab A9+'] },
    { brand: 'OnePlus', models: ['OnePlus Pad', 'OnePlus Pad Go'] },
    { brand: 'Xiaomi', models: ['Xiaomi Pad 6', 'Xiaomi Pad 6 Pro'] }
  ],
  headphones: [
    { brand: 'Sony', models: ['WH-1000XM5', 'WF-1000XM5', 'LinkBuds S', 'Inzone H9'] },
    { brand: 'Bose', models: ['QuietComfort Ultra Headphones', 'QuietComfort Ultra Earbuds', 'QuietComfort 45'] },
    { brand: 'Apple', models: ['AirPods Pro (2nd Gen)', 'AirPods Max', 'AirPods (3rd Gen)'] },
    { brand: 'JBL', models: ['Tour One M2', 'Live Pro 2', 'Quantum 910', 'Tune 770NC'] },
    { brand: 'Sennheiser', models: ['Momentum 4 Wireless', 'Momentum True Wireless 3', 'HD 660S2'] },
    { brand: 'Nothing', models: ['Ear (2)', 'Ear (stick)', 'CMF Buds Pro'] },
    { brand: 'Samsung', models: ['Galaxy Buds2 Pro', 'Galaxy Buds FE', 'Galaxy Buds Live'] }
  ],
  gaming: [
    { brand: 'Sony', models: ['PlayStation 5 Pro', 'PlayStation 5 Slim', 'PlayStation Portal', 'DualSense Edge Controller'] },
    { brand: 'Microsoft', models: ['Xbox Series X', 'Xbox Series S - 1TB', 'Xbox Elite Wireless Controller Series 2'] },
    { brand: 'Nintendo', models: ['Nintendo Switch OLED', 'Nintendo Switch Lite', 'Switch Pro Controller'] },
    { brand: 'Logitech', models: ['G Pro X Superlight 2', 'G915 Lightspeed Keyboard', 'G502 X Plus', 'Astro A50 X'] },
    { brand: 'Razer', models: ['Viper V3 Pro', 'BlackWidow V4 Pro', 'Kraken V3 Hypersense', 'Wolverine V2 Pro'] },
    { brand: 'ASUS', models: ['ROG Ally Z1 Extreme', 'ROG Raikiri Pro', 'ROG Cetra True Wireless'] }
  ],
  'home-appliances': [
    { brand: 'LG', models: ['OLED evo C3 65" TV', 'WashTower Smart Laundry', 'InstaView Refrigerator', 'CordZero A9 Stick Vacuum'] },
    { brand: 'Samsung', models: ['Neo QLED 8K TV', 'Bespoke 4-Door Flex Refrigerator', 'Bespoke Jet AI Vacuum', 'Smart Dial Washer'] },
    { brand: 'Whirlpool', models: ['Smart Front Load Washer', 'French Door Refrigerator', 'Smart Double Wall Oven'] },
    { brand: 'Bosch', models: ['800 Series Dishwasher', '500 Series Refrigerator', 'Benchmark Induction Cooktop'] },
    { brand: 'IFB', models: ['Senator WSS 8kg Washer', 'Neptune VX Dishwasher', 'Microwave Oven 30L'] },
    { brand: 'Philips', models: ['Air Purifier 3000i', 'PerfectCare Elite Steam Iron', 'Eco Conscious Edition Kettle'] }
  ],
  books: [
    { brand: 'Penguin', models: ['Atomic Habits', 'The Psychology of Money', 'Thinking, Fast and Slow'] },
    { brand: 'HarperCollins', models: ['The Alchemist', 'Sapiens: A Brief History of Humankind', 'Ikigai'] },
    { brand: 'Simon & Schuster', models: ['Steve Jobs Biography', 'Principles by Ray Dalio', 'Shoe Dog'] }
  ],
  fashion: [
    { brand: 'Nike', models: ['Air Force 1 \'07', 'Tech Fleece Full-Zip', 'Sportswear Club Fleece Pants'] },
    { brand: 'Adidas', models: ['Ultraboost Light', 'Samba OG Shoes', 'Adicolor Classics Track Jacket'] },
    { brand: 'Patagonia', models: ['Better Sweater Fleece', 'Torrentshell 3L Rain Jacket', 'Nano Puff Jacket'] },
    { brand: 'The North Face', models: ['Nuptse 1996 Retro Jacket', 'Borealis Backpack', 'Apex Bionic Jacket'] }
  ],
  beauty: [
    { brand: 'Dyson', models: ['Airwrap Multi-Styler', 'Supersonic Hair Dryer', 'Corrale Hair Straightener'] },
    { brand: 'L\'Oréal', models: ['Revitalift Derm Intensives Serum', 'True Match Foundation', 'Voluminous Lash Paradise'] },
    { brand: 'Estée Lauder', models: ['Advanced Night Repair Serum', 'Double Wear Foundation', 'Revitalizing Supreme+ Cream'] },
    { brand: 'Philips', models: ['Lumea IPL Hair Removal', 'Sonicare DiamondClean 9000', 'OneBlade Pro'] }
  ],
  furniture: [
    { brand: 'Herman Miller', models: ['Aeron Ergonomic Chair', 'Embody Chair', 'Sayl Chair', 'Noguchi Table'] },
    { brand: 'Steelcase', models: ['Gesture Office Chair', 'Leap Fabric Chair', 'Series 2 Chair'] },
    { brand: 'IKEA', models: ['MARKUS Office Chair', 'BEKANT Standing Desk', 'KALLAX Shelving Unit', 'POÄNG Armchair'] },
    { brand: 'West Elm', models: ['Mid-Century Show Wood Chair', 'Andes Sofa', 'Industrial Storage Desk'] }
  ],
  kitchen: [
    { brand: 'Breville', models: ['Barista Express Impress', 'Smart Oven Air Fryer Pro', 'the Bambino Plus'] },
    { brand: 'KitchenAid', models: ['Artisan Series 5-Quart Stand Mixer', 'Pro Line Series Blender', 'Digital Countertop Oven'] },
    { brand: 'Ninja', models: ['Foodi 10-in-1 Smart XL Air Fry Oven', 'Creami Ice Cream Maker', 'Professional Plus Blender'] },
    { brand: 'Instant Pot', models: ['Duo Plus 9-in-1', 'Vortex Plus 6-Quart Air Fryer', 'Pro Crisp 8-Quart'] }
  ],
  sports: [
    { brand: 'Garmin', models: ['Fenix 7X Sapphire Solar', 'Forerunner 965', 'Venu 3', 'Edge 1040 Solar'] },
    { brand: 'Therabody', models: ['Theragun PRO', 'Theragun mini', 'RecoveryAir PRO'] },
    { brand: 'Bowflex', models: ['SelectTech 552 Dumbbells', 'Max Trainer M9', 'Treadmill 22'] },
    { brand: 'Fitbit', models: ['Charge 6', 'Sense 2', 'Versa 4'] }
  ],
  travel: [
    { brand: 'Samsonite', models: ['Omni PC Hardside Expandable', 'Winfield 2 Hardside', 'Freeform Hardside Spinner'] },
    { brand: 'Rimowa', models: ['Original Cabin', 'Essential Trunk Plus', 'Classic Check-In L'] },
    { brand: 'Away', models: ['The Bigger Carry-On', 'The Medium', 'The Everywhere Bag'] },
    { brand: 'Peak Design', models: ['Travel Backpack 45L', 'Everyday Backpack V2', 'Wash Pouch'] }
  ]
};

const GENERIC_IMAGES = {
  phones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60',
  laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60',
  tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=60',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60',
  gaming: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=60',
  'home-appliances': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=60',
  books: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=60',
  fashion: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=60',
  beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=60',
  furniture: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=60',
  kitchen: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60',
  sports: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60',
  travel: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=60'
};

const finalProducts = [];
let idCounter = 1;

for (const catId of Object.keys(BRAND_MODELS)) {
  const brandList = BRAND_MODELS[catId];
  
  brandList.forEach((brandData) => {
    brandData.models.forEach((model, index) => {
      const slug = (brandData.brand + '-' + model).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const basePrice = 50 + (model.length * 15) + (index * 45);
      
      finalProducts.push({
        id: catId + '-' + slug + '-' + (idCounter++),
        name: brandData.brand + ' ' + model,
        category: catId,
        price: basePrice,
        discount: index % 4 === 0 ? 15 : 0,
        originalPrice: basePrice,
        rating: 4.0 + (index % 10) * 0.1,
        reviewCount: 20 + (index * 89) % 1000,
        brand: brandData.brand,
        image: GENERIC_IMAGES[catId] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        keyFeatures: ['Premium Quality', 'Latest Technology', 'Durable Materials', 'Ergonomic Design'],
        specs: {
          'Brand': brandData.brand,
          'Model': model,
          'Year': '2024'
        },
        pros: ['Industry leading performance', 'Great value for money'],
        cons: ['May require setup', 'Availability can be limited'],
        description: 'The ' + brandData.brand + ' ' + model + ' is one of the most sought-after products in the ' + catId + ' category. It features cutting edge design and uncompromising quality. NOTE: Image is a placeholder and will be updated shortly by the administrator.',
        availability: index % 5 === 0 ? 'Low Stock' : 'In Stock',
        accessories: ['Official Case/Cover', 'Extended Warranty', 'Care Kit'],
        aiScore: 85 + (index % 15),
        trending: index % 3 === 0,
        newArrival: index % 4 === 0,
        bestSeller: index % 2 === 0
      });
    });
  });
}

const fileContent = 'export const CATEGORIES = ' + JSON.stringify(CATEGORIES, null, 2) + ';\n\nexport const PRODUCTS = ' + JSON.stringify(finalProducts, null, 2) + ';\n';

fs.writeFileSync('src/productsData.js', fileContent);
console.log('Successfully generated massive curated productsData.js with ' + finalProducts.length + ' specific brand models.');
