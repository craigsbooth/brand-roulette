const fs = require('fs');
let content = fs.readFileSync('brands.js', 'utf8');
content = content.replace(/,\s*logoUrl:\s*"[^"]+"/g, '');
fs.writeFileSync('brands.js', content);
console.log('Removed all logoUrl entries');
console.log('Lines with logoUrl remaining:', (content.match(/logoUrl/g) || []).length);
