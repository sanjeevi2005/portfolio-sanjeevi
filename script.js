// ── CURSOR ──
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0;
document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    trail.style.left = mx + 'px';
    trail.style.top = my + 'px';
});
document.querySelectorAll('a, button, .skill-category, .project-card, .contact-link').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2)';
        trail.style.transform = 'translate(-50%,-50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        trail.style.transform = 'translate(-50%,-50%) scale(1)';
    });
});

// ── BG CANVAS PARTICLES ──
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], lines = [];

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.7 ? '#16f1b4' : Math.random() > 0.5 ? '#07b492' : '#00e5ff';
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

// Floating grid lines
const gridLines = [];
for (let i = 0; i < 8; i++) {
    gridLines.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
        len: Math.random() * 150 + 50,
        angle: Math.random() * Math.PI,
        opacity: Math.random() * 0.06 + 0.02
    });
}

function animateCanvas() {
    ctx.clearRect(0, 0, W, H);

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = '#16f1b4';
                ctx.globalAlpha = (1 - dist / 100) * 0.05;
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }

    particles.forEach(p => { p.update(); p.draw(); });

    // Floating lines
    gridLines.forEach(l => {
        l.x += l.vx; l.y += l.vy;
        if (l.x < -200 || l.x > W + 200 || l.y < -200 || l.y > H + 200) {
            l.x = Math.random() * W; l.y = Math.random() * H;
        }
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.angle);
        ctx.beginPath();
        ctx.moveTo(-l.len / 2, 0);
        ctx.lineTo(l.len / 2, 0);
        ctx.strokeStyle = '#16f1b4';
        ctx.globalAlpha = l.opacity;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    });

    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .skill-category, .project-card, .matrix-row, .about-quote, .about-text, .roadmap, .contact-title, .contact-sub, .contact-links, .avail-badge').forEach(el => {
    revealObserver.observe(el);
});

// ── COUNT UP ──
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            let start = 0;
            const step = () => {
                start++;
                el.textContent = start;
                if (start < target) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            countObserver.unobserve(el);
        }
    });
});
document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

// ── TYPING EFFECT ──
const titles = [
    'Web & App Developer | CS Engineer',
    'React Native Specialist',
    'Full-Stack JavaScript Engineer',
    'Future Systems Architect'
];
let ti = 0, ci = 0, deleting = false;
const typeEl = document.getElementById('heroTitle');
function typeLoop() {
    const current = titles[ti];
    if (!deleting) {
        typeEl.textContent = current.substring(0, ci + 1);
        ci++;
        if (ci === current.length) {
            deleting = true;
            setTimeout(typeLoop, 2000);
            return;
        }
    } else {
        typeEl.textContent = current.substring(0, ci - 1);
        ci--;
        if (ci === 0) {
            deleting = false;
            ti = (ti + 1) % titles.length;
        }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
}
setTimeout(typeLoop, 1600);

// ── PARALLAX HERO ──
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const hero = document.querySelector('.hero-left');
    if (hero) hero.style.transform = `translateY(${y * 0.15}px)`;
});