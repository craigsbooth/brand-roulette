// Shuffle array
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Bright, distinct brand-style colours
const COLORS = [
    '#E30613','#003087','#FF9900','#1DB954','#00A4EF',
    '#FFD700','#ED1C24','#4267B2','#FF6900','#006241',
    '#C8102E','#0066CC','#A3080C','#00704A','#FF0000',
    '#5C2D91','#003DA5','#F5E100','#E31937','#0A8FDC',
    '#34A853','#232F3E','#F48024','#663399','#25D366',
    '#00B2A9','#D62B1F','#1428A0','#FFC72C','#2EBD59',
    '#764ABC','#E60012','#00A0DC','#F7DF1E','#FF4500',
    '#0077B5','#1877F2','#E4405F','#BD081C','#00AFF0',
];

const VISIBLE_SEGMENTS = 100;

// Industry groupings for the category selector
const INDUSTRIES = {
    "All Brands": null, // null means pick from everything
    "Cars & Automotive": ["Cars", "EV", "Motorbikes", "Tyres", "Car Rental", "Fuel"],
    "Technology": ["Technology", "Tech", "Software", "Cloud", "Electronics", "Crypto"],
    "Food & Drink": ["Food", "Drinks", "Alcohol", "Coffee", "Grocery", "Dairy", "Frozen", "Biscuits", "Snacks", "Snacks US", "US Grocery", "US Food", "Condiments", "Breakfast", "Nutrition"],
    "Fashion & Luxury": ["Fashion", "Fragrance", "Watches", "Jewelry"],
    "Sports & Football": ["Sports", "Football", "US Sports", "F1", "Motorsport", "Fitness", "Sports Equipment"],
    "Entertainment & Gaming": ["Entertainment", "Gaming", "TV", "Film", "Music", "Game Services"],
    "Chocolate & Sweets": ["Chocolate", "Confectionery"],
    "Retail & Shopping": ["Retail", "UK", "US", "Home", "DIY", "Outdoor"],
    "Finance & Banking": ["Finance", "Fintech", "Insurance"],
    "Travel & Airlines": ["Airlines", "Travel", "Hotels", "Transport"],
    "Health & Beauty": ["Health", "Beauty", "Household", "Baby", "Pets"],
    "Media & Apps": ["Media", "Apps", "Delivery", "Education"],
    "Energy & Fuel": ["Fuel", "Energy", "Aerospace", "Space", "Tools"],
    "TV & Film": ["TV", "Film"],
};

// Known brand colours - the big recognisable ones
const BRAND_COLOR_MAP = {
    "Cadbury": "#4B0082", "Dairy Milk": "#4B0082", "Wispa": "#4B0082", "Twirl": "#4B0082",
    "Flake": "#4B0082", "Roses": "#4B0082", "Heroes": "#4B0082", "Crunchie": "#4B0082",
    "Double Decker": "#4B0082", "Boost": "#4B0082", "Freddo": "#4B0082", "Buttons": "#4B0082",
    "Fudge": "#4B0082", "Curly Wurly": "#4B0082", "Picnic": "#4B0082", "Timeout": "#4B0082",
    "Bournville": "#4B0082", "Starbar": "#4B0082", "Chomp": "#4B0082", "Caramel": "#4B0082",
    "Fruit & Nut": "#4B0082", "Whole Nut": "#4B0082", "Twirl Bites": "#4B0082",
    "Coca-Cola": "#E30613", "Fanta": "#FF6900", "Sprite": "#008B47",
    "Pepsi": "#003DA5", "7UP": "#006B3F", "Mountain Dew": "#87CF3E",
    "Red Bull": "#223971", "Monster Energy": "#95D600",
    "Ferrari": "#C8102E", "Lamborghini": "#DAA520", "BMW": "#0066B1",
    "Mercedes-Benz": "#333333", "Audi": "#BB0A30", "Porsche": "#C8102E",
    "Toyota": "#EB0A1E", "Honda": "#CC0000", "Ford": "#003478",
    "Tesla": "#CC0000", "Volkswagen": "#001E50", "Nissan": "#C3002F",
    "Hyundai": "#002C5F", "Kia": "#05141F", "Volvo": "#003057",
    "Jaguar": "#1E1E1E", "Land Rover": "#005A2B", "Rolls-Royce": "#1C1C1C",
    "Apple": "#555555", "Microsoft": "#00A4EF", "Google": "#4285F4",
    "Amazon": "#FF9900", "Samsung": "#1428A0", "Netflix": "#E50914",
    "Spotify": "#1DB954", "Meta": "#0668E1", "TikTok": "#000000",
    "YouTube": "#FF0000", "Instagram": "#E4405F", "WhatsApp": "#25D366",
    "Twitter/X": "#000000", "LinkedIn": "#0077B5", "Reddit": "#FF4500",
    "Snapchat": "#FFFC00", "Pinterest": "#BD081C", "Discord": "#5865F2",
    "Nike": "#111111", "Adidas": "#000000", "Puma": "#000000",
    "Gucci": "#000000", "Louis Vuitton": "#8B6914", "Burberry": "#A67B5B",
    "Rolex": "#006039", "Versace": "#FFD700", "Prada": "#000000",
    "McDonald's": "#FFC72C", "Burger King": "#FF8732", "KFC": "#E4002B",
    "Subway": "#008C15", "Starbucks": "#006241", "Costa Coffee": "#6F1E43",
    "Domino's": "#006491", "Pizza Hut": "#EE3A2D", "Nando's": "#C8102E",
    "Greggs": "#004B93", "Taco Bell": "#702082",
    "Tesco": "#00539F", "Sainsbury's": "#F06C00", "Asda": "#7AB648",
    "Morrisons": "#FFD100", "Aldi": "#00457C", "Lidl": "#0050AA",
    "IKEA": "#0058A3", "Walmart": "#0071CE", "Target": "#CC0000",
    "Shell": "#FFD500", "BP": "#009900", "Esso": "#CC0000",
    "Texaco": "#CC0000", "Total": "#FF3333", "ExxonMobil": "#D62631",
    "Barclays": "#00AEEF", "HSBC": "#DB0011", "Lloyds": "#006B3F",
    "NatWest": "#3F1882", "Santander": "#EC0000",
    "Visa": "#1A1F71", "Mastercard": "#FF5F00", "American Express": "#006FCF",
    "Monzo": "#FF5C57", "Revolut": "#0075EB", "Stripe": "#635BFF",
    "PayPal": "#003087",
    "British Airways": "#075AAA", "Ryanair": "#073590", "EasyJet": "#FF6600",
    "Emirates": "#D71921", "Virgin Atlantic": "#E10A0A",
    "Sky": "#0072C9", "BBC": "#000000", "ITV": "#0F8B8D",
    "Channel 4": "#000000", "Netflix": "#E50914", "Disney+": "#113CCF",
    "Vodafone": "#E60000", "EE": "#007B85", "O2": "#0019A5",
    "Three": "#000000", "BT": "#6400AA",
    "Cadbury": "#4B0082", "KitKat": "#CC0000", "Mars": "#911F12",
    "Snickers": "#3C1E10", "M&M's": "#B5121B", "Maltesers": "#960018",
    "Ferrero": "#8B6914", "Lindt": "#C5A258", "Toblerone": "#8B6914",
    "Nutella": "#3C8C28", "Kinder": "#FF6600", "Haribo": "#FFC600",
    "Skittles": "#E30613", "Mentos": "#009B3A",
    "Heineken": "#00843D", "Guinness": "#000000", "Budweiser": "#CC0000",
    "Corona": "#FDB913", "Jack Daniel's": "#000000", "Smirnoff": "#E21B22",
    "Manchester United": "#DA291C", "Liverpool": "#C8102E", "Arsenal": "#EF0107",
    "Chelsea": "#034694", "Manchester City": "#6CABDD", "Tottenham": "#132257",
    "Barcelona": "#A50044", "Real Madrid": "#FEBE10", "Bayern Munich": "#DC052D",
    "Juventus": "#000000", "PSG": "#004170",
    "Premier League": "#3D195B", "Champions League": "#091442",
    "FIFA": "#326295", "NBA": "#1D428A", "NFL": "#013369",
    "Formula 1": "#E10600", "Red Bull Racing": "#1E41FF",
    "Mercedes F1": "#00D2BE", "McLaren": "#FF8700",
    "Nintendo": "#E60012", "PlayStation": "#003791", "Xbox": "#107C10",
    "EA Sports": "#000000", "Roblox": "#E2231A",
    "Disney": "#113CCF", "Warner Bros": "#004B87", "Pixar": "#000000",
    "Marvel": "#EC1D24", "DC Comics": "#0078F0",
    "Dyson": "#7D1979", "Bosch": "#005691",
    "Heinz": "#1C5631", "Kellogg's": "#ED1C24",
    "Dove": "#004B87", "Nivea": "#003478", "Gillette": "#0033A0",
    "Colgate": "#E21836", "L'Oréal": "#000000",
    "Pampers": "#006B3F", "Huggies": "#E31837",
    "LEGO": "#D01012", "Hasbro": "#CF1F2E", "Mattel": "#FF0028",
    "Pokémon": "#FFCB05",
    "Hilton": "#003B5C", "Marriott": "#A50034", "Premier Inn": "#6B2C91",
    "SpaceX": "#000000", "NASA": "#0B3D91", "Boeing": "#0033A0",
};

// Category-based fallback colours
const CATEGORY_COLORS = {
    "Cars": "#1C1C1C", "EV": "#00A550", "Motorbikes": "#333333", "Tyres": "#222222",
    "Fuel": "#FFC107", "Energy": "#FF9800", "Technology": "#2196F3", "Tech": "#1565C0",
    "Software": "#6A1B9A", "Cloud": "#0288D1", "Electronics": "#263238", "Crypto": "#F7931A",
    "Food": "#D32F2F", "Drinks": "#C62828", "Alcohol": "#4E342E", "Coffee": "#5D4037",
    "Grocery": "#388E3C", "Fashion": "#212121", "Fragrance": "#880E4F", "Watches": "#1A237E",
    "Sports": "#1B5E20", "Football": "#2E7D32", "US Sports": "#0D47A1", "F1": "#E10600",
    "Motorsport": "#BF360C", "Fitness": "#F57C00", "Entertainment": "#6A1B9A",
    "Gaming": "#7B1FA2", "TV": "#1565C0", "Film": "#263238", "Music": "#AD1457",
    "Chocolate": "#4E342E", "Confectionery": "#E65100", "Retail": "#00695C",
    "UK": "#1A237E", "US": "#B71C1C", "Home": "#4E342E", "DIY": "#E65100",
    "Outdoor": "#33691E", "Finance": "#1A237E", "Fintech": "#00838F",
    "Insurance": "#004D40", "Airlines": "#01579B", "Travel": "#00838F",
    "Hotels": "#4A148C", "Transport": "#37474F", "Health": "#1B5E20",
    "Beauty": "#AD1457", "Household": "#00695C", "Baby": "#EC407A",
    "Pets": "#8D6E63", "Media": "#37474F", "Apps": "#283593",
    "Delivery": "#E65100", "Education": "#1565C0", "Aerospace": "#1A237E",
    "Space": "#0D47A1", "Tools": "#BF360C", "Car Rental": "#00695C",
};

// Get colour for a brand
function getBrandColor(brand, index) {
    // Try exact name match first
    if (BRAND_COLOR_MAP[brand.name]) return BRAND_COLOR_MAP[brand.name];
    // Try category colour
    if (CATEGORY_COLORS[brand.category]) return CATEGORY_COLORS[brand.category];
    // Fallback to rotating colours
    return COLORS[index % COLORS.length];
}


class SpinWheel {
    constructor(canvasId, resultId, delayMs, selectorId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resultBox = document.getElementById(resultId);
        this.selector = document.getElementById(selectorId);
        this.currentRotation = 0;
        this.spinning = false;
        this.result = null;
        this.winningIndex = -1;
        this.segments = [];
        this.delayMs = delayMs || 0;
        this.assignBrands();
        this.draw();

        // Redraw when industry changes
        if (this.selector) {
            this.selector.addEventListener('change', () => {
                this.assignBrands();
                this.draw();
            });
        }
    }

    getFilteredBrands() {
        const industry = this.selector ? this.selector.value : "All Brands";
        const cats = INDUSTRIES[industry];
        if (!cats) return ALL_BRANDS;
        const filtered = ALL_BRANDS.filter(b => cats.includes(b.category));
        return filtered.length > 0 ? filtered : ALL_BRANDS;
    }

    assignBrands() {
        const pool = this.getFilteredBrands();
        const shuffled = shuffle(pool);
        this.segments = shuffled.slice(0, Math.min(VISIBLE_SEGMENTS, shuffled.length));
    }

    draw() {
        const ctx = this.ctx;
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const radius = Math.min(cx, cy) - 5;
        const segAngle = (2 * Math.PI) / this.segments.length;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.segments.length; i++) {
            const startAngle = this.currentRotation + i * segAngle;
            const endAngle = startAngle + segAngle;

            // Segment fill - use brand's actual colour
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = getBrandColor(this.segments[i], i);
            ctx.fill();

            // White separator lines
            ctx.strokeStyle = 'rgba(255,255,255,0.7)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Brand name text - scale font based on segment count
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(startAngle + segAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fff';
            const fontSize = this.segments.length <= 30 ? 10 : this.segments.length <= 50 ? 8 : 6;
            ctx.font = `bold ${fontSize}px Segoe UI, Arial`;
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 2;
            const name = this.segments[i].name;
            const maxLen = this.segments.length <= 30 ? 16 : this.segments.length <= 50 ? 12 : 10;
            const display = name.length > maxLen ? name.substring(0, maxLen) + '..' : name;
            ctx.fillText(display, radius - 10, fontSize / 3);
            ctx.restore();
        }

        // Inner shadow
        const grad = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.2)');
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.fill();

        // Center hub
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
        ctx.fillStyle = '#1a1a2e';
        ctx.fill();
        ctx.strokeStyle = '#f5a623';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, 2 * Math.PI);
        ctx.fillStyle = '#e94560';
        ctx.fill();

        // Outer ring
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#f5a623';
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    spin() {
        if (this.spinning) return;
        this.spinning = true;
        this.result = null;
        this.winningIndex = -1;
        this.assignBrands();

        setTimeout(() => this.startSpin(), this.delayMs);
    }

    startSpin() {
        // Longer duration for more dramatic slowdown
        this.spinDuration = 6000 + Math.random() * 3000; // 6-9 seconds

        // High initial velocity (radians per second) that decays naturally
        this.initialVelocity = 25 + Math.random() * 15; // 25-40 rad/s
        
        // Calculate total distance using v²/2a deceleration model
        // This gives a natural friction-based slowdown
        const totalDistance = this.initialVelocity * this.spinDuration / 2000;
        
        this.startRotation = this.currentRotation;
        this.targetRotation = this.startRotation + totalDistance;
        this.spinStartTime = performance.now();
        this.animate();
    }

    animate() {
        const now = performance.now();
        const elapsed = now - this.spinStartTime;
        const progress = Math.min(elapsed / this.spinDuration, 1);

        // Real physics: constant deceleration (like friction)
        // position = v0*t - 0.5*a*t²  which normalised gives: p = 2t - t²
        // This means velocity decreases linearly to zero — exactly how a wheel behaves
        const eased = progress * (2 - progress);

        this.currentRotation = this.startRotation + (this.targetRotation - this.startRotation) * eased;
        this.draw();

        if (progress < 1) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.spinning = false;
            this.determineResult();
        }
    }

    determineResult() {
        const segAngle = (2 * Math.PI) / this.segments.length;
        let norm = this.currentRotation % (2 * Math.PI);
        if (norm < 0) norm += 2 * Math.PI;
        const pointerAngle = (2 * Math.PI - norm + (3 * Math.PI / 2)) % (2 * Math.PI);
        this.winningIndex = Math.floor(pointerAngle / segAngle) % this.segments.length;
        this.result = this.segments[this.winningIndex];
        this.drawHighlight();
        this.showResult();
    }

    drawHighlight() {
        // Redraw with a highlight on the winning segment
        this.draw();
        const ctx = this.ctx;
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const radius = Math.min(cx, cy) - 5;
        const segAngle = (2 * Math.PI) / this.segments.length;
        const startAngle = this.currentRotation + this.winningIndex * segAngle;
        const endAngle = startAngle + segAngle;

        // Glow effect on winning segment
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();
    }

    showResult() {
        const domain = this.result.logo.split('domain=')[1];
        // Best quality sources - hunter.io serves full HD logos free
        const primary = `https://api.companyenrich.com/logo/${domain}`;
        const secondary = `https://logos.hunter.io/${domain}`;
        const tertiary = `https://www.google.com/s2/favicons?sz=256&domain=${domain}`;
        const color = getBrandColor(this.result, this.winningIndex);

        this.resultBox.classList.add('winner');
        this.resultBox.style.borderColor = '#ffd700';
        this.resultBox.style.boxShadow = `0 0 30px rgba(255,215,0,0.5), 0 0 60px ${color}40`;
        this.resultBox.innerHTML = `
            <div class="result-logo-wrap" style="border-color:${color}">
                <img src="${primary}" alt="${this.result.name}" 
                     class="result-logo"
                     onerror="this.onerror=function(){this.onerror=null;this.src='${tertiary}';};this.src='${secondary}';"
                     title="Right-click to copy or save image">
            </div>
            <div class="brand-name">${this.result.name}</div>
            <div class="brand-category">${this.result.category}</div>
        `;
    }

    reset() {
        this.resultBox.classList.remove('winner');
        this.resultBox.style.borderColor = '';
        this.resultBox.style.boxShadow = '';
        this.resultBox.innerHTML = '<div class="brand-name">-</div>';
    }

    resize() {
        // Match canvas internal resolution to displayed size
        setTimeout(() => {
            const rect = this.canvas.getBoundingClientRect();
            const size = Math.round(rect.width);
            if (size > 0) {
                this.canvas.width = size;
                this.canvas.height = size;
            }
            this.draw();
        }, 50);
    }
}

// Wheels will be initialized after selects are populated
let wheel1, wheel2, wheel3;
let spinning = false;

function initWheels() {
    wheel1 = new SpinWheel('wheel1', 'result1', 0, 'select1');
    wheel2 = new SpinWheel('wheel2', 'result2', 400, 'select2');
    wheel3 = new SpinWheel('wheel3', 'result3', 800, 'select3');
}

function spinAll() {
    if (spinning || !wheel1) return;
    spinning = true;

    const btn = document.getElementById('spinBtn');
    btn.disabled = true;
    btn.textContent = 'SPINNING...';

    wheel1.reset();
    if (activeWheelCount >= 2) wheel2.reset();
    if (activeWheelCount >= 3) wheel3.reset();

    wheel1.spin();
    if (activeWheelCount >= 2) wheel2.spin();
    if (activeWheelCount >= 3) wheel3.spin();

    const checkDone = setInterval(() => {
        const w1Done = !wheel1.spinning;
        const w2Done = activeWheelCount < 2 || !wheel2.spinning;
        const w3Done = activeWheelCount < 3 || !wheel3.spinning;
        if (w1Done && w2Done && w3Done) {
            clearInterval(checkDone);
            spinning = false;
            btn.disabled = false;
            btn.textContent = 'SPIN!';
        }
    }, 100);
}
