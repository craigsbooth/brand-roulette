const fs = require('fs');
const logos = JSON.parse(fs.readFileSync('logo-urls.json', 'utf8'));
let content = fs.readFileSync('brands.js', 'utf8');
let count = 0;

for (const [name, url] of Object.entries(logos)) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('(\\{name:\\s*"' + escaped + '",\\s*logo:\\s*"[^"]+")');
    if (re.test(content)) {
        content = content.replace(re, '$1, logoUrl: "' + url.replace(/\$/g, '$$$$') + '"');
        count++;
    }
}

fs.writeFileSync('brands.js', content);
console.log('Added logoUrl to ' + count + ' brands');
