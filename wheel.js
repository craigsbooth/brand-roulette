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
    "Entertainment & Gaming": ["Entertainment", "Gaming", "TV", "Music", "Game Services"],
    "Chocolate & Sweets": ["Chocolate", "Confectionery"],
    "Retail & Shopping": ["Retail", "UK", "US", "Home", "DIY", "Outdoor"],
    "Finance & Banking": ["Finance", "Fintech", "Insurance"],
    "Travel & Airlines": ["Airlines", "Travel", "Hotels", "Transport"],
    "Health & Beauty": ["Health", "Beauty", "Household", "Baby", "Pets"],
    "Media & Apps": ["Media", "Apps", "Delivery", "Education"],
    "Energy & Fuel": ["Fuel", "Energy", "Aerospace", "Space", "Tools"],
};

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

            // Segment fill
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = COLORS[i % COLORS.length];
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
        const baseDuration = 3500;
        const variance = Math.random() * 3500;
        this.spinDuration = baseDuration + variance;

        const fullSpins = 10 + Math.floor(Math.random() * 8);
        const extraRotations = fullSpins * 2 * Math.PI;
        const randomOffset = Math.random() * 2 * Math.PI;

        this.startRotation = this.currentRotation;
        this.targetRotation = this.startRotation + extraRotations + randomOffset;
        this.spinStartTime = performance.now();
        this.bounceAmount = 0.012 + Math.random() * 0.025;
        this.animate();
    }

    animate() {
        const now = performance.now();
        const elapsed = now - this.spinStartTime;
        const progress = Math.min(elapsed / this.spinDuration, 1);

        let eased;
        if (progress < 0.6) {
            eased = progress / 0.6 * 0.8;
        } else if (progress < 0.85) {
            const sub = (progress - 0.6) / 0.25;
            eased = 0.8 + sub * 0.14;
        } else if (progress < 0.95) {
            const sub = (progress - 0.85) / 0.10;
            eased = 0.94 + sub * 0.04;
        } else {
            const sub = (progress - 0.95) / 0.05;
            const bounce = Math.sin(sub * Math.PI * 2) * this.bounceAmount * (1 - sub);
            eased = 0.98 + sub * 0.02 + bounce;
        }

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
        const color = COLORS[this.winningIndex % COLORS.length];

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
    wheel2.reset();
    wheel3.reset();

    wheel1.spin();
    wheel2.spin();
    wheel3.spin();

    const checkDone = setInterval(() => {
        if (!wheel1.spinning && !wheel2.spinning && !wheel3.spinning) {
            clearInterval(checkDone);
            spinning = false;
            btn.disabled = false;
            btn.textContent = 'SPIN ALL!';
        }
    }, 100);
}
