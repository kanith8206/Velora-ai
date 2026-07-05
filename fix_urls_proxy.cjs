const fs = require('fs');
let data = fs.readFileSync('src/productsData.js', 'utf8');

// Replace any existing wsrv.nl prefix just in case
data = data.replace(/https:\/\/wsrv\.nl\/\?url=/g, '');

// Prepend wsrv.nl to all images
data = data.replace(/"image": "(https:\/\/images\.unsplash\.com\/[^"]+)"/g, '"image": "https://wsrv.nl/?url=$1"');

fs.writeFileSync('src/productsData.js', data);

// Also fix ProductCard.jsx
let cardData = fs.readFileSync('src/components/ProductCard.jsx', 'utf8');
cardData = cardData.replace(/https:\/\/wsrv\.nl\/\?url=/g, '');
cardData = cardData.replace(/'(https:\/\/images\.unsplash\.com\/[^']+)'/g, "'https://wsrv.nl/?url=$1'");
fs.writeFileSync('src/components/ProductCard.jsx', cardData);

// Also fix ProductDetails.jsx
let detailData = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');
detailData = detailData.replace(/https:\/\/wsrv\.nl\/\?url=/g, '');
detailData = detailData.replace(/'(https:\/\/images\.unsplash\.com\/[^']+)'/g, "'https://wsrv.nl/?url=$1'");
fs.writeFileSync('src/pages/ProductDetails.jsx', detailData);

console.log('Done adding proxy');
