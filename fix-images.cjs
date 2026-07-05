const fs = require('fs');
let data = fs.readFileSync('src/productsData.js', 'utf8');

// Replace all raw unsplash urls with properly encoded wsrv.nl proxy urls
data = data.replace(/"image":\s*"https:\/\/images\.unsplash\.com\/([^"]+)"/g, (match, p1) => {
  const rawUrl = 'https://images.unsplash.com/' + p1;
  const encoded = encodeURIComponent(rawUrl);
  return `"image": "https://wsrv.nl/?url=${encoded}"`;
});

fs.writeFileSync('src/productsData.js', data);

let cardData = fs.readFileSync('src/components/ProductCard.jsx', 'utf8');
cardData = cardData.replace(/'https:\/\/images\.unsplash\.com\/([^']+)'/g, (match, p1) => {
  const rawUrl = 'https://images.unsplash.com/' + p1;
  const encoded = encodeURIComponent(rawUrl);
  return `'https://wsrv.nl/?url=${encoded}'`;
});

fs.writeFileSync('src/components/ProductCard.jsx', cardData);
