const fs = require('fs');
const path = require('path');

// Read the file as text first
const filePath = path.join(__dirname, 'src', 'productsData.js');
let fileContent = fs.readFileSync(filePath, 'utf-8');

// We can evaluate the file content to extract the objects, or just use a safer approach if it's purely exports.
// Since it's ES module syntax, we can't easily require it in CommonJS.
// Let's strip the exports and parse it using Function or eval.

let categoriesStr = fileContent.match(/export const CATEGORIES = (\[[\s\S]*?\]);\n\nexport/)[1];
let productsStr = fileContent.match(/export const PRODUCTS = (\[[\s\S]*?\]);$/)[1];

let categories = eval(categoriesStr);
let products = eval(productsStr);

// Update ALL products to have a unique placeholder image based on their name
products = products.map(product => {
  const encodedName = encodeURIComponent(product.name);
  product.image = `https://placehold.co/600x600/121216/E2B53E?text=${encodedName}`;
  return product;
});

// Write it back
const newContent = `export const CATEGORIES = ${JSON.stringify(categories, null, 2)};\n\nexport const PRODUCTS = ${JSON.stringify(products, null, 2)};\n`;

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log('Successfully updated all products with unique name-based images!');
