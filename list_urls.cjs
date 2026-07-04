const fs = require('fs');
const raw = fs.readFileSync('src/productsData.js', 'utf8');
const regex = /"image":\s*"([^"]+)"/g;
const urls = new Set();
let m;
while ((m = regex.exec(raw)) !== null) { urls.add(m[1]); }
console.log('Total unique image URLs:', urls.size);
[...urls].forEach(u => console.log(u));
