// ─── CURSOR ───
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + "px";
  cursor.style.top = my + "px";
});
function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animRing);
}
animRing();

// ─── PARTICLE CANVAS ───
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  particles = [];
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? "56,189,248" : "129,140,248";
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

// Lines between nearby particles
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(56,189,248,${(1 - dist / 100) * 0.08})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  drawLines();
  requestAnimationFrame(animCanvas);
}
animCanvas();

// ─── TYPEWRITER ───
const titles = [
  "Web & App Developer",
  "React Native Engineer",
  "Full-Stack Builder",
  "Systems Architect",
];
let ti = 0,
  ci = 0,
  deleting = false;
const tw = document.getElementById("typewriter-target");
if (tw) {
  tw.classList.add("typewriter");
  function typeLoop() {
    const current = titles[ti];
    if (!deleting) {
      tw.textContent = current.slice(0, ci + 1);
      ci++;
      if (ci === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
    } else {
      tw.textContent = current.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        ti = (ti + 1) % titles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 60 : 90);
  }
  typeLoop();
}

// ─── SCROLL REVEAL ───
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        // Animate skill bars
        e.target.querySelectorAll(".bar-fill").forEach((bar) => {
          bar.style.width = bar.dataset.width + "%";
        });
      }
    });
  },
  { threshold: 0.15 },
);

document
  .querySelectorAll(
    ".skill-card,.project-card,.stat-box,.timeline-item,.contact-link,.exp-card",
  )
  .forEach((el) => observer.observe(el));

// Trigger bars if already in view
document.querySelectorAll(".bar-fill").forEach((bar) => {
  const track = bar.closest(".bar-track");
  const inView = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        bar.style.width = bar.dataset.width + "%";
      }
    },
    { threshold: 0.5 },
  );
  inView.observe(track);
});

// ─── MOUSE PARALLAX CARDS ───
document.querySelectorAll(".skill-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty(
      "--mx",
      ((e.clientX - rect.left) / rect.width) * 100 + "%",
    );
    card.style.setProperty(
      "--my",
      ((e.clientY - rect.top) / rect.height) * 100 + "%",
    );
  });
});

// ─── COUNTER ANIMATION ───
function animateCounter(el, end, duration = 1500) {
  let start = 0;
  const step = (end / duration) * 16;
  const timer = setInterval(() => {
    start += step;
    if (start >= end) {
      start = end;
      clearInterval(timer);
    }
    const isFloat = String(end).includes(".");
    el.textContent = isFloat
      ? parseFloat(start).toFixed(2)
      : Math.floor(start) + (el.dataset.suffix || "");
  }, 16);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const num = e.target.querySelector(".stat-num");
        const val = num.textContent;
        if (val === "8.49") animateCounter(num, 8.49);
        else if (val === "2+") {
          num.textContent = "0";
          setTimeout(() => {
            num.textContent = "2+";
          }, 800);
        } else if (val === "6+") {
          num.textContent = "0";
          setTimeout(() => {
            num.textContent = "6+";
          }, 900);
        } else if (val === "2027") animateCounter(num, 2027, 2000);
        statObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.5 },
);
document.querySelectorAll(".stat-box").forEach((b) => statObserver.observe(b));

// ─── SMOOTH ACTIVE NAV ───
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 60) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

// ─── EMAIL CONTACT FORM ───
// Initialize EmailJS with your Public Key
emailjs.init({ publicKey: "3Hnr97CPa6EO58_vu" });

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page from reloading

    const btn = this.querySelector("button");
    const originalText = btn.textContent;
    btn.textContent = "Sending...";

    // Send the email using your Service ID and Template ID
    emailjs.sendForm("service_gm6s0d2", "template_bc2nftg", this).then(
      () => {
        // Success state
        btn.textContent = "Message Sent! ✓";
        btn.style.background = "var(--accent3)"; // Turn green
        btn.style.color = "#000";
        this.reset(); // Clear the form fields

        // Reset the button back to normal after 4 seconds
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "";
          btn.style.color = "";
        }, 4000);
      },
      (error) => {
        // Error state
        btn.textContent = "Failed to send ❌";
        console.log("FAILED...", error);

        setTimeout(() => {
          btn.textContent = originalText;
        }, 4000);
      },
    );
  });
}
