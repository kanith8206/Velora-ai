const fs = require('fs');
const content = fs.readFileSync('src/productsData.js', 'utf8');
const urls = content.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^'"]+/g);
if (!urls) {
  console.log('No URLs found');
  process.exit(0);
}
const uniqueUrls = [...new Set(urls)];
Promise.all(uniqueUrls.map(url => 
  fetch(url, {method: 'HEAD'})
    .then(r => ({url, ok: r.ok, status: r.status}))
    .catch(e => ({url, ok: false, error: e.message}))
)).then(results => {
  results.filter(r => !r.ok).forEach(r => console.log('FAIL:', r.url, r.status || r.error));
  console.log('Done testing ' + uniqueUrls.length + ' images.');
});
