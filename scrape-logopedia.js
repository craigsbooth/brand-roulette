const https = require('https');
const fs = require('fs');

// Logopedia categories to scrape
const CATEGORIES = [
    // Cars
    {query: "Category:Car companies", category: "Cars"},
    // Technology
    {query: "Category:Computer companies", category: "Technology"},
    {query: "Category:Software companies", category: "Technology"},
    // TV
    {query: "Category:Television channels in the United Kingdom", category: "TV"},
    {query: "Category:Television channels in the United States", category: "TV"},
    {query: "Category:Streaming services", category: "TV"},
    {query: "Category:Television networks in the United States", category: "TV"},
    // Film
    {query: "Category:Film production companies", category: "Film"},
    {query: "Category:Animation studios", category: "Film"},
    // Food & Drink
    {query: "Category:Fast food", category: "Food"},
    {query: "Category:Food", category: "Food"},
    {query: "Category:Drink", category: "Drinks"},
    {query: "Category:Snacks", category: "Snacks"},
    // Chocolate & Confectionery
    {query: "Category:Chocolate", category: "Chocolate"},
    {query: "Category:Confectionery companies", category: "Chocolate"},
    // Retail
    {query: "Category:Supermarkets", category: "Retail"},
    {query: "Category:Department stores", category: "Retail"},
    // Fashion
    {query: "Category:Clothing brands", category: "Fashion"},
    // Airlines
    {query: "Category:Airlines", category: "Airlines"},
    // Sports
    {query: "Category:Football Clubs", category: "Football"},
    {query: "Category:Sport", category: "Sports"},
    // Finance
    {query: "Category:Banks", category: "Finance"},
    // Gaming
    {query: "Category:Video game companies", category: "Gaming"},
];

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {headers: {'User-Agent': 'BrandRoulette/1.0'}}, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch(e) { reject(e); }
            });
        }).on('error', reject);
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getCategoryMembers(categoryTitle) {
    const url = `https://logos.fandom.com/api.php?action=query&format=json&list=categorymembers&cmtitle=${encodeURIComponent(categoryTitle)}&cmlimit=500&cmtype=page`;
    try {
        const data = await fetch(url);
        return (data.query && data.query.categorymembers) || [];
    } catch(e) { return []; }
}

async function getPageLogo(pageId, pageTitle) {
    // Get images from the page
    const url = `https://logos.fandom.com/api.php?action=parse&format=json&pageid=${pageId}&prop=images`;
    try {
        const data = await fetch(url);
        const images = (data.parse && data.parse.images) || [];
        // Filter out non-logo images
        const logoImages = images.filter(img => 
            !img.match(/Info|icon|Flag|Map|Placeholder|Logopedia|SVG_needed/i) &&
            (img.endsWith('.svg') || img.endsWith('.png'))
        );
        if (logoImages.length === 0) return null;
        
        // PRIORITY 1: Find an image whose filename contains the brand name
        const nameWords = pageTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
        const nameMatch = logoImages.find(img => {
            const imgLower = img.toLowerCase();
            // Check if main brand word appears in filename
            return nameWords.some(w => w.length > 2 && imgLower.includes(w));
        });
        
        if (nameMatch) {
            // Among all matching images, pick the last one (most recent)
            const allMatches = logoImages.filter(img => {
                const imgLower = img.toLowerCase();
                return nameWords.some(w => w.length > 2 && imgLower.includes(w));
            });
            const bestMatch = allMatches[allMatches.length - 1];
            return await getImageUrl(bestMatch);
        }
        
        // PRIORITY 2: Take the first SVG that doesn't look like a parent company
        const svgs = logoImages.filter(img => img.endsWith('.svg'));
        if (svgs.length > 0) {
            return await getImageUrl(svgs[0]);
        }
        
        // PRIORITY 3: First image
        return await getImageUrl(logoImages[0]);
    } catch(e) {}
    return null;
}

async function getImageUrl(filename) {
    const fileUrl = `https://logos.fandom.com/api.php?action=query&format=json&prop=imageinfo&titles=File:${encodeURIComponent(filename)}&iiprop=url`;
    try {
        const fileData = await fetch(fileUrl);
        const pages = fileData.query && fileData.query.pages;
        if (!pages) return null;
        const pageData = Object.values(pages)[0];
        if (pageData && pageData.imageinfo && pageData.imageinfo[0]) {
            return pageData.imageinfo[0].url;
        }
    } catch(e) {}
    return null;
}

async function main() {
    const allBrands = [];
    const seen = new Set();
    
    for (const cat of CATEGORIES) {
        console.log(`Fetching: ${cat.query}...`);
        const members = await getCategoryMembers(cat.query);
        console.log(`  Found ${members.length} pages`);
        
        for (const member of members) {
            // Skip if already processed
            if (seen.has(member.title)) continue;
            seen.add(member.title);
            
            // Skip disambiguation/list pages
            if (member.title.includes('/') || member.title.includes('List of')) continue;
            
            await sleep(150); // Rate limit
            const logoUrl = await getPageLogo(member.pageid, member.title);
            
            if (logoUrl) {
                allBrands.push({
                    name: member.title,
                    logoUrl: logoUrl,
                    category: cat.category
                });
            }
        }
        
        await sleep(300);
    }
    
    console.log(`\nTotal brands with logos: ${allBrands.length}`);
    fs.writeFileSync('logopedia-brands.json', JSON.stringify(allBrands, null, 2));
    console.log('Saved to logopedia-brands.json');
}

main().catch(console.error);
