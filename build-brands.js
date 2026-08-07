const fs = require('fs');
const data = require('./logopedia-brands.json');

// Build brands.js from Logopedia data
let output = `// Brand database with verified Logopedia logos
// ${data.length} brands sourced directly from logos.fandom.com
const ALL_BRANDS = [\n`;

data.forEach((brand, i) => {
    // Clean brand name (remove parenthetical info)
    let name = brand.name.replace(/\s*\(.*?\)\s*/g, '').trim();
    // Escape quotes
    name = name.replace(/"/g, '\\"');
    const comma = i < data.length - 1 ? ',' : '';
    output += `    {name: "${name}", logoUrl: "${brand.logoUrl}", category: "${brand.category}"}${comma}\n`;
});

output += '];\n';

fs.writeFileSync('brands.js', output);
console.log(`Created brands.js with ${data.length} brands`);
