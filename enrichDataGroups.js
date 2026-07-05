import fs from 'fs';
import { CATEGORIES, PRODUCTS } from './src/productsData.js';

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

PRODUCTS.forEach(p => {
  if (p.category === 'phones') {
    // Generate some structured data for highlights and specs
    const ramOptions = ['8 GB RAM | 128 GB ROM', '12 GB RAM | 256 GB ROM', '16 GB RAM | 512 GB ROM', '8 GB RAM | 256 GB ROM'];
    const procOptions = ['Snapdragon 8 Gen 3 | Octa Core | 3.3 GHz', 'Dimensity 9300 | Octa Core | 3.25 GHz', 'Apple A17 Pro | Hexa Core', 'Tensor G3 | Nona Core'];
    const camOptions = ['50MP + 12MP + 10MP', '200MP + 50MP + 12MP', '48MP + 12MP + 12MP', '108MP + 8MP + 2MP'];
    const frontCam = ['12MP Front Camera', '32MP Front Camera', '16MP Front Camera'];
    const screenOptions = ['6.7 inch Super AMOLED Display', '6.8 inch Dynamic AMOLED 2X', '6.1 inch Super Retina XDR', '6.78 inch LTPO AMOLED'];
    const batteryOptions = ['5000 mAh Battery', '4500 mAh Battery', '4422 mAh Battery', '6000 mAh Battery'];

    const hRam = sample(ramOptions);
    const hProc = sample(procOptions);
    const hCam = sample(camOptions);
    const hFront = sample(frontCam);
    const hScreen = sample(screenOptions);
    const hBat = sample(batteryOptions);

    p.highlights = [
      { icon: "Cpu", text: hRam },
      { icon: "Microchip", text: hProc },
      { icon: "Camera", text: `${hCam} Rear Camera` },
      { icon: "CameraFront", text: hFront },
      { icon: "Smartphone", text: hScreen },
      { icon: "Battery", text: hBat }
    ];

    p.specGroups = [
      {
        title: "General",
        specs: {
          "Brand": p.brand,
          "Model Name": p.name,
          "Color": sample(['Titanium Black', 'Space Gray', 'Phantom Silver', 'Aura Glow']),
          "In The Box": "1 x Handset, 1 x Charger, 1 x USB Cable, 1 x SIM Ejector, 1 x Quick Guide",
          "SIM Type": "Dual Sim"
        }
      },
      {
        title: "Display Features",
        specs: {
          "Display Size": hScreen,
          "Resolution": "2796 x 1290 Pixels",
          "Display Type": "OLED / AMOLED",
          "Refresh Rate": "120 Hz"
        }
      },
      {
        title: "Os & Processor Features",
        specs: {
          "Operating System": sample(['Android 14', 'iOS 17', 'Android 13']),
          "Processor Type": hProc.split('|')[0].trim(),
          "Processor Core": hProc.split('|')[1]?.trim() || 'Octa Core'
        }
      },
      {
        title: "Memory & Storage Features",
        specs: {
          "Internal Storage": hRam.split('|')[1].trim(),
          "RAM": hRam.split('|')[0].trim()
        }
      },
      {
        title: "Camera Features",
        specs: {
          "Primary Camera": hCam,
          "Secondary Camera": hFront.replace(' Front Camera', ''),
          "Flash": "LED Flash",
          "Video Recording": "4K @ 60fps"
        }
      },
      {
        title: "Battery & Power Features",
        specs: {
          "Battery Capacity": hBat.replace(' Battery', ''),
          "Fast Charging": "Yes"
        }
      }
    ];

  } else if (p.category === 'laptops') {
    
    const hRam = sample(['16GB LPDDR5X RAM', '32GB DDR5 RAM', '8GB Unified Memory']);
    const hStorage = sample(['512GB PCIe NVMe SSD', '1TB PCIe 4.0 SSD', '2TB NVMe SSD']);
    const hProc = sample(['Intel Core Ultra 7', 'AMD Ryzen 9 8945HS', 'Apple M3 Pro', 'Intel Core i9 14900HX']);
    const hScreen = sample(['14 inch Liquid Retina', '16 inch Mini-LED', '15.6 inch OLED Touch', '18 inch QHD+ 240Hz']);
    const hBat = sample(['70Wh Battery', '99.9Wh Battery', '65Wh Battery']);
    const hOs = sample(['Windows 11 Home', 'macOS Sonoma', 'Windows 11 Pro']);

    p.highlights = [
      { icon: "Microchip", text: hProc },
      { icon: "MemoryStick", text: hRam },
      { icon: "HardDrive", text: hStorage },
      { icon: "Laptop", text: hScreen },
      { icon: "MonitorPlay", text: hOs },
      { icon: "Battery", text: hBat }
    ];

    p.specGroups = [
      {
        title: "General",
        specs: {
          "Brand": p.brand,
          "Model Name": p.name,
          "Color": sample(['Space Gray', 'Lunar Silver', 'Midnight Black']),
          "Operating System": hOs
        }
      },
      {
        title: "Processor And Memory Features",
        specs: {
          "Processor Name": hProc,
          "RAM": hRam,
          "Storage": hStorage,
          "Graphic Processor": sample(['NVIDIA RTX 4070', 'Integrated Graphics', 'Apple 14-core GPU', 'AMD Radeon 780M'])
        }
      },
      {
        title: "Display And Audio Features",
        specs: {
          "Screen Size": hScreen,
          "Screen Resolution": sample(['2560 x 1600 Pixel', '3024 x 1964 Pixel', '1920 x 1080 Pixel']),
          "Speakers": "Stereo Speakers with Dolby Atmos"
        }
      },
      {
        title: "Port And Slot Features",
        specs: {
          "USB Port": "2 x Thunderbolt 4, 1 x USB Type-A",
          "HDMI Port": "1 x HDMI 2.1",
          "Headphone Jack": "3.5 mm Combo Jack"
        }
      }
    ];
  } else {
    // Generic fallback for other categories
    p.highlights = [
      { icon: "CheckCircle", text: "Premium Quality Material" },
      { icon: "Shield", text: "Verified Authentication" },
      { icon: "Star", text: "Top Rated by Customers" }
    ];
    
    p.specGroups = [
      {
        title: "General Information",
        specs: {
          "Brand": p.brand,
          "Model Name": p.name,
          "Category": p.category,
          "Origin": "Manufactured in PRC"
        }
      },
      {
        title: "Quality & Assurance",
        specs: {
          "Warranty": "1 Year Manufacturer Warranty",
          "Quality Grade": "Premium A+",
          "Support": "24/7 Priority Support"
        }
      }
    ];
  }
});

const output = `export const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};

export const PRODUCTS = ${JSON.stringify(PRODUCTS, null, 2)};
`;

fs.writeFileSync('src/productsData.js', output);
console.log('Data enriched with specGroups and highlights successfully!');
