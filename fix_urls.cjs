const fs = require('fs');
let data = fs.readFileSync('src/productsData.js', 'utf8');
data = data.replace(/&sig=[a-zA-Z0-9-]+/g, '');
fs.writeFileSync('src/productsData.js', data);
console.log('Done replacing &sig');
