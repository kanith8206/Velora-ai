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

const CURATED_IMAGES = {
  phones: [
    { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=60', name: 'Google Pixel 8 Pro', brand: 'Google' },
    { url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=600&auto=format&fit=crop&q=60', name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung' },
    { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60', name: 'Premium Midnight Smartphone', brand: 'Velora' },
    { url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=60', name: 'Titanium Flagship Phone', brand: 'Aura' },
    { url: 'https://images.unsplash.com/photo-1565849511593-ed34b2af0975?w=600&auto=format&fit=crop&q=60', name: 'X-Series Creator Phone', brand: 'Nexus' }
  ],
  laptops: [
    { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60', name: 'Apple MacBook Air 13" M3', brand: 'Apple' },
    { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=60', name: 'Dell XPS 15 9530', brand: 'Dell' },
    { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=60', name: 'Creator Studio Ultrabook', brand: 'Studio' },
    { url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=60', name: 'Professional Developer Laptop', brand: 'CodeOS' },
    { url: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&auto=format&fit=crop&q=60', name: 'Executive Travel Notebook', brand: 'TravelMate' }
  ],
  tablets: [
    { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=60', name: 'Apple iPad Pro 13" (M4)', brand: 'Apple' },
    { url: 'https://images.unsplash.com/photo-1561154464-82e9afd32764?w=600&auto=format&fit=crop&q=60', name: 'Digital Artist Canvas Tablet', brand: 'Artisan' },
    { url: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=60', name: 'Business Slate Pro', brand: 'WorkPad' },
    { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60', name: 'Entertainment Max Pad', brand: 'Vision' },
    { url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&auto=format&fit=crop&q=60', name: 'Ultra-Thin Reading Tablet', brand: 'Readr' }
  ],
  headphones: [
    { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60', name: 'Audiophile Studio Monitors', brand: 'Acoustica' },
    { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=60', name: 'Sony WH-1000XM5 ANC', brand: 'Sony' },
    { url: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=600&auto=format&fit=crop&q=60', name: 'Apple AirPods Max', brand: 'Apple' },
    { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=60', name: 'Wireless Freedom Pods', brand: 'SoundWave' },
    { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=60', name: 'Sport Fit Endurance Earbuds', brand: 'ActiveLife' }
  ],
  gaming: [
    { url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=60', name: 'Sony PlayStation 5 Pro', brand: 'Sony' },
    { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=60', name: 'Valve Steam Deck OLED', brand: 'Valve' },
    { url: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop&q=60', name: 'NextGen Portable Console', brand: 'PlayToGo' },
    { url: 'https://images.unsplash.com/photo-1507457379470-08b8006bc60f?w=600&auto=format&fit=crop&q=60', name: 'Retro Arcade Station', brand: 'ClassicGames' },
    { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=60', name: 'Elite Tactical Gamepad', brand: 'ProControl' }
  ],
  'home-appliances': [
    { url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=60', name: 'Dyson V15 Detect Absolute', brand: 'Dyson' },
    { url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=60', name: 'Smart Home Hub Panel', brand: 'HomeSmart' },
    { url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=60', name: 'HEPA Air Purifier Tower', brand: 'PureAir' },
    { url: 'https://images.unsplash.com/photo-1527669225091-7663f73602fc?w=600&auto=format&fit=crop&q=60', name: 'Automated Robot Vacuum', brand: 'SweepBot' },
    { url: 'https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?w=600&auto=format&fit=crop&q=60', name: 'Ambient Lighting Array', brand: 'LuxLight' }
  ],
  books: [
    { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=60', name: 'Atomic Habits by James Clear', brand: 'Avery Publishing' },
    { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=60', name: 'The Art of Modern Design', brand: 'DesignHouse' },
    { url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=60', name: 'Mindful Leadership', brand: 'Penguin' },
    { url: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600&auto=format&fit=crop&q=60', name: 'Creative Workflow Strategies', brand: 'CreatorPress' },
    { url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=60', name: 'Minimalist Wealth', brand: 'FinanceBooks' }
  ],
  fashion: [
    { url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=60', name: 'Patagonia Torrentshell 3L', brand: 'Patagonia' },
    { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=60', name: 'Classic Leather Moto Jacket', brand: 'UrbanStyle' },
    { url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=60', name: 'Minimalist Canvas Sneakers', brand: 'StepComfort' },
    { url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&auto=format&fit=crop&q=60', name: 'Merino Wool Winter Beanie', brand: 'ArcticWear' },
    { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=60', name: 'Waterproof Commuter Backpack', brand: 'CityGear' }
  ],
  beauty: [
    { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=60', name: 'Dyson Airwrap Multi-Styler', brand: 'Dyson' },
    { url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=60', name: 'Revitalizing Night Serum', brand: 'Lumiere' },
    { url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=60', name: 'Sonic Facial Cleansing Brush', brand: 'ClearSkin' },
    { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=60', name: 'Organic Mineral Foundation', brand: 'EarthGlow' },
    { url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=60', name: 'Aromatherapy Essential Oil Kit', brand: 'ZenSpa' }
  ],
  furniture: [
    { url: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=60', name: 'Herman Miller Aeron Chair', brand: 'Herman Miller' },
    { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=60', name: 'Mid-Century Lounge Sofa', brand: 'RetroHome' },
    { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60', name: 'Solid Walnut Dining Table', brand: 'WoodCraft' },
    { url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=60', name: 'Electric Standing Desk', brand: 'ErgoWork' },
    { url: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&auto=format&fit=crop&q=60', name: 'Minimalist Display Shelf', brand: 'NordicDesign' }
  ],
  kitchen: [
    { url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=60', name: 'Breville Barista Express', brand: 'Breville' },
    { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60', name: 'Professional Chef Knife Set', brand: 'ForgeMaster' },
    { url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=60', name: 'High-Power Cyclone Blender', brand: 'VitaPro' },
    { url: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=60', name: 'Digital Smart Air Fryer', brand: 'CrispTech' },
    { url: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=600&auto=format&fit=crop&q=60', name: 'Enameled Cast Iron Dutch Oven', brand: 'Heritage' }
  ],
  sports: [
    { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60', name: 'Deep Tissue Massage Gun', brand: 'TheraFlex' },
    { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=60', name: 'Adjustable Smart Dumbbells', brand: 'IronGrip' },
    { url: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?w=600&auto=format&fit=crop&q=60', name: 'Carbon Fiber Tennis Racket', brand: 'AeroStrike' },
    { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=60', name: 'GPS Multisport Watch', brand: 'TrackPro' },
    { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=60', name: 'Elite Running Shoes', brand: 'Velocity' }
  ],
  travel: [
    { url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=60', name: 'Indestructible Polycarbonate Suitcase', brand: 'AeroTravel' },
    { url: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600&auto=format&fit=crop&q=60', name: 'Expandable Weekender Duffel', brand: 'Nomad' },
    { url: 'https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?w=600&auto=format&fit=crop&q=60', name: 'Security Anti-Theft Backpack', brand: 'SafePack' },
    { url: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&auto=format&fit=crop&q=60', name: 'Compression Packing Cubes', brand: 'SpaceSaver' },
    { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=60', name: 'Global Travel Adapter Kit', brand: 'VoltConnect' }
  ]
};

const finalProducts = [];
let idCounter = 1;

for (const catId of Object.keys(CURATED_IMAGES)) {
  const images = CURATED_IMAGES[catId];
  images.forEach((item, index) => {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    finalProducts.push({
      id: catId + '-' + slug + '-' + (idCounter++),
      name: item.name,
      category: catId,
      price: 100 + (index * 150) + (catId.length * 10),
      discount: index % 3 === 0 ? 10 : 0,
      originalPrice: 100 + (index * 150) + (catId.length * 10),
      rating: 4.5 + (index % 5) * 0.1,
      reviewCount: 50 + (index * 123) % 500,
      brand: item.brand,
      image: item.url,
      keyFeatures: ['Premium Build Quality', 'Extended Warranty', 'Eco-friendly Packaging', 'Award-Winning Design'],
      specs: {
        'Material': 'Aerospace Grade Aluminum',
        'Warranty': '2 Years Standard',
        'Origin': 'Designed in California'
      },
      pros: ['Exceptional performance', 'Beautiful minimalist aesthetic', 'Highly durable materials'],
      cons: ['Premium price point', 'High demand causes stock shortages'],
      description: 'The ' + item.name + ' represents the pinnacle of modern design and engineering. Perfect for discerning users who demand the absolute best in their ' + catId + ' gear.',
      availability: index % 4 === 0 ? 'Low Stock' : 'In Stock',
      accessories: ['Protective Carrying Case', 'Extended Warranty Plan', 'Premium Cleaning Kit'],
      aiScore: 90 + (index % 10),
      trending: index % 3 === 0,
      newArrival: index % 4 === 0,
      bestSeller: index % 5 === 0
    });
  });
}

const fileContent = 'export const CATEGORIES = ' + JSON.stringify(CATEGORIES, null, 2) + ';\n\nexport const PRODUCTS = ' + JSON.stringify(finalProducts, null, 2) + ';\n';

fs.writeFileSync('src/productsData.js', fileContent);
console.log('Successfully generated curated productsData.js with ' + finalProducts.length + ' matched products.');
