// Fetch accurate logos from Logopedia using better matching logic
// For each brand: search -> get page images -> pick the image whose filename
// best matches the brand name, preferring the most recent one

const fs = require('fs');
const https = require('https');

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'BrandRoulette/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Score how well a filename matches a brand name
function matchScore(filename, brandName) {
    const fn = filename.toLowerCase().replace(/[_\-\(\)\.]/g, ' ').replace(/\d{4}/g, '').trim();
    const bn = brandName.toLowerCase().replace(/[''&]/g, '').trim();
    
    // Exact brand name in filename = best
    if (fn.includes(bn)) return 100;
    
    // First word match
    const bnFirst = bn.split(' ')[0];
    if (bnFirst.length > 2 && fn.includes(bnFirst)) return 70;
    
    // Any significant word match
    const bnWords = bn.split(/\s+/).filter(w => w.length > 2);
    const matches = bnWords.filter(w => fn.includes(w)).length;
    if (matches > 0) return 30 + (matches / bnWords.length) * 40;
    
    return 0;
}

async function main() {
    const content = fs.readFileSync('brands.js', 'utf8');
    const brandMatches = [...content.matchAll(/\{name:\s*"([^"]+)"/g)];
    const brands = brandMatches.map(m => m[1]);
    
    console.log(`Processing ${brands.length} brands...`);
    
    const results = {};
    let found = 0;
    let notfound = 0;
    
    for (let i = 0; i < brands.length; i++) {
        const brand = brands[i];
        if (i % 50 === 0) console.log(`  ${i}/${brands.length} (found: ${found})...`);
        
        try {
            // Search for the brand
            const searchUrl = `https://logos.fandom.com/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(brand)}&srlimit=3`;
            const searchResult = await fetchJSON(searchUrl);
            const pages = searchResult?.query?.search || [];
            
            if (pages.length === 0) { notfound++; await sleep(150); continue; }
            
            // Try each search result page to find a good logo
            let bestUrl = null;
            let bestScore = 0;
            
            for (const page of pages.slice(0, 2)) {
                const imagesUrl = `https://logos.fandom.com/api.php?action=parse&format=json&pageid=${page.pageid}&prop=images`;
                const imagesResult = await fetchJSON(imagesUrl);
                const images = imagesResult?.parse?.images || [];
                
                // Filter out non-logo images
                const logoImages = images.filter(img => 
                    !img.match(/Info|icon|Flag|Map|Placeholder|Wikia/i) &&
                    img.match(/\.(svg|png|jpg)/i)
                );
                
                if (logoImages.length === 0) continue;
                
                // Score each image against the brand name
                for (const img of logoImages) {
                    const score = matchScore(img, brand);
                    // Bonus for being later in the list (more recent)
                    const recencyBonus = logoImages.indexOf(img) / logoImages.length * 10;
                    const totalScore = score + recencyBonus;
                    
                    if (totalScore > bestScore) {
                        bestScore = totalScore;
                        bestUrl = img;
                    }
                }
                
                await sleep(100);
            }
            
            // If we found a good match, get the actual URL
            if (bestUrl && bestScore >= 30) {
                const fileUrl = `https://logos.fandom.com/api.php?action=query&format=json&prop=imageinfo&titles=File:${encodeURIComponent(bestUrl)}&iiprop=url`;
                const fileResult = await fetchJSON(fileUrl);
                const filePages = fileResult?.query?.pages || {};
                const firstPage = Object.values(filePages)[0];
                const url = firstPage?.imageinfo?.[0]?.url;
                
                if (url) {
                    results[brand] = url;
                    found++;
                }
            } else {
                notfound++;
            }
        } catch (e) {
            notfound++;
        }
        
        await sleep(150);
    }
    
    console.log(`\nDone! Found: ${found}, Not found: ${notfound}`);
    fs.writeFileSync('logo-urls-v2.json', JSON.stringify(results, null, 2));
    console.log('Saved to logo-urls-v2.json');
}

main();
