/**
 * Sanjeevi S. — Portfolio Scripts
 * --------------------------------------------------------
 * 1. Custom Cursor
 * 2. Canvas Particle Background
 * 3. Typewriter Effect
 * 4. Scroll Reveal & Skill Bars
 * 5. Mouse Parallax Cards
 * 6. Stat Counters
 * 7. Navigation (Scroll Spy & Mobile Toggle)
 * 8. EmailJS Contact Form
 */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     1. CUSTOM CURSOR
     ========================================= */
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");

  if (cursor && ring) {
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
  }

  /* =========================================
     2. CANVAS PARTICLE BACKGROUND
     ========================================= */
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let W, H;
    const particles = [];

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
        // Wrap around screen
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }

    // Draw connecting lines between nearby particles
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
  }

  /* =========================================
     3. TYPEWRITER EFFECT
     ========================================= */
  const tw = document.getElementById("typewriter-target");
  if (tw) {
    const titles = [
      "Web & App Developer",
      "React Native Engineer",
      "Full-Stack Builder",
      "Systems Architect",
    ];
    let ti = 0,
      ci = 0,
      deleting = false;

    tw.classList.add("typewriter");

    function typeLoop() {
      const current = titles[ti];
      if (!deleting) {
        tw.textContent = current.slice(0, ci + 1);
        ci++;
        if (ci === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1800); // Pause at full word
          return;
        }
      } else {
        tw.textContent = current.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          ti = (ti + 1) % titles.length; // Move to next word
        }
      }
      setTimeout(typeLoop, deleting ? 60 : 90);
    }
    typeLoop();
  }

  /* =========================================
     4. SCROLL REVEAL & SKILL BARS
     ========================================= */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");

          // Trigger inner skill bars if present
          const skillBars = e.target.querySelectorAll(".bar-fill");
          skillBars.forEach((bar) => {
            bar.style.width = bar.dataset.width + "%";
          });
        }
      });
    },
    { threshold: 0.15 },
  );

  document
    .querySelectorAll(
      ".skill-card, .project-card, .stat-box, .timeline-item, .contact-link, .exp-card",
    )
    .forEach((el) => {
      revealObserver.observe(el);
    });

  // Independent trigger for skill bars just in case they aren't inside a reveal container
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.dataset.width + "%";
        }
      });
    },
    { threshold: 0.5 },
  );

  document.querySelectorAll(".bar-fill").forEach((bar) => {
    barObserver.observe(bar);
  });

  /* =========================================
     5. MOUSE PARALLAX CARDS (SKILLS)
     ========================================= */
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

  /* =========================================
     6. STAT COUNTERS
     ========================================= */
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
          if (!num) return;

          const val = num.textContent;

          // Specific animations based on your hardcoded values
          if (val === "8.49") {
            animateCounter(num, 8.49);
          } else if (val === "2+") {
            num.textContent = "0";
            setTimeout(() => {
              num.textContent = "2+";
            }, 800);
          } else if (val === "6+") {
            num.textContent = "0";
            setTimeout(() => {
              num.textContent = "6+";
            }, 900);
          } else if (val === "2027") {
            animateCounter(num, 2027, 2000);
          }

          statObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  document
    .querySelectorAll(".stat-box")
    .forEach((b) => statObserver.observe(b));

  /* =========================================
     7. NAVIGATION (SCROLL SPY & MOBILE)
     ========================================= */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  // Scroll Spy Highlighting
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

  // Mobile Menu Toggle
  const mobileBtn = document.getElementById("mobile-btn");
  const navMenu = document.querySelector(".nav-links");
  const navOverlay = document.getElementById("nav-overlay");

  if (mobileBtn && navOverlay && navMenu) {
    const closeMenu = () => {
      mobileBtn.classList.remove("active");
      navMenu.classList.remove("active");
      navOverlay.classList.remove("active");
    };

    mobileBtn.addEventListener("click", () => {
      mobileBtn.classList.toggle("active");
      navMenu.classList.toggle("active");
      navOverlay.classList.toggle("active");
    });

    navOverlay.addEventListener("click", closeMenu);

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  /* =========================================
     8. EMAILJS CONTACT FORM
     ========================================= */
  // Initialize EmailJS with Public Key
  if (typeof emailjs !== "undefined") {
    emailjs.init({ publicKey: "3Hnr97CPa6EO58_vu" });
  } else {
    console.warn("EmailJS is not loaded.");
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const btn = this.querySelector("button");
      const originalText = btn.textContent;
      btn.textContent = "Sending...";

      // Send the email (ensure Service ID and Template ID are correct)
      emailjs.sendForm("service_gm6s0d2", "template_bc2nftg", this).then(
        () => {
          // Success state
          btn.textContent = "Message Sent! ✓";
          btn.style.background = "var(--accent3)";
          btn.style.color = "#000";
          this.reset();

          // Reset button
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = "";
            btn.style.color = "";
          }, 4000);
        },
        (error) => {
          // Error state
          btn.textContent = "Failed to send ❌";
          console.error("FAILED...", error);

          setTimeout(() => {
            btn.textContent = originalText;
          }, 4000);
        },
      );
    });
  }
});