/* ============================
   TECNORIENTE JB - SCRIPT.JS
   Ultra Futuristic Interactions
   ============================ */

// ─── CUSTOM CURSOR ───────────────────────────────────────────
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;
let raf;

if (window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  (function animRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .service-card, .tab-btn, input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ─── STICKY HEADER ───────────────────────────────────────────
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });

// ─── MOBILE MENU ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ─── SCROLL REVEAL ───────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = parseFloat(getComputedStyle(entry.target).getPropertyValue('--delay')) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay * 1000);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── PARTICLES CANVAS ─────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const NODE_COUNT  = 70;
  const LINK_DIST   = 140;
  const NEON_COLOR  = '0, 212, 255';

  const nodes = Array.from({ length: NODE_COUNT }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r:  Math.random() * 1.5 + 0.5,
  }));

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Update
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${NEON_COLOR}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Dots
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${NEON_COLOR}, 0.6)`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(${NEON_COLOR}, 0.5)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(drawFrame);
  }
  drawFrame();
})();

// ─── AI DASHBOARD COUNTERS ────────────────────────────────────
function animateCounter(el, target, suffix = '', decimals = 0, duration = 2000) {
  if (!el) return;
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    const val  = (target * ease).toFixed(decimals);
    el.textContent = val + suffix;
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Mini bars for dashboard
const miniChart = document.getElementById('mini-chart');
if (miniChart) {
  const heights = [30, 60, 45, 80, 55, 90, 70, 85, 40, 95];
  heights.forEach(h => {
    const bar = document.createElement('div');
    bar.className = 'mini-bar';
    bar.style.height = h + '%';
    miniChart.appendChild(bar);
  });
}

// Node dots for dashboard
const nodeDots = document.getElementById('node-dots');
if (nodeDots) {
  for (let i = 0; i < 24; i++) {
    const dot = document.createElement('div');
    dot.className = 'node-dot' + (Math.random() > 0.4 ? ' active' : '');
    dot.style.animationDelay = (Math.random() * 2) + 's';
    nodeDots.appendChild(dot);
  }
}

// Dashboard live counters
const aiPerfEl  = document.getElementById('ai-perf');
const nodesEl   = document.getElementById('nodes-val');

if (aiPerfEl) {
  setInterval(() => {
    const val = (97.5 + Math.random() * 2).toFixed(1);
    aiPerfEl.innerHTML = val + '<span>%</span>';
  }, 2500);
}

if (nodesEl) {
  setInterval(() => {
    const val = Math.floor(140 + Math.random() * 20);
    nodesEl.textContent = val;
  }, 3000);
}

// Tokens animated counter
const tokensEl = document.getElementById('tokens-val');
if (tokensEl) {
  let base = 2.4;
  setInterval(() => {
    base += Math.random() * 0.05;
    tokensEl.textContent = base.toFixed(1) + 'M';
  }, 1800);
}

// ─── PARALLAX HERO ────────────────────────────────────────────
const heroGrid = document.querySelector('.hero-bg-grid');
window.addEventListener('scroll', () => {
  if (!heroGrid) return;
  const scrollY = window.scrollY;
  heroGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
}, { passive: true });

// ─── PORTFOLIO TABS ───────────────────────────────────────────
const tabBtns    = document.querySelectorAll('.tab-btn');
const tabVideos  = document.getElementById('tab-videos');
const tabFotos   = document.getElementById('tab-fotos');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.tab === 'videos') {
      tabVideos.classList.remove('hidden');
      tabFotos.classList.add('hidden');
    } else {
      tabVideos.classList.add('hidden');
      tabFotos.classList.remove('hidden');
    }
  });
});

// ─── VIDEO CAROUSEL ───────────────────────────────────────────
const slides = document.querySelectorAll('.video-slide');
const dots   = document.querySelectorAll('.dot');
let current  = 0;

function goToSlide(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  // Pause any playing video in previous slide
  const prevVideo = slides[current].querySelector('video');
  if (prevVideo) { prevVideo.pause(); }
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

document.getElementById('prev-vid')?.addEventListener('click', () => goToSlide(current - 1));
document.getElementById('next-vid')?.addEventListener('click', () => goToSlide(current + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

// ─── CONTACT FORM VALIDATION ──────────────────────────────────
const form    = document.getElementById('contact-form');
const formBtn = document.getElementById('form-btn-text');
const formOk  = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'nombre',  type: 'text'  },
      { id: 'email',   type: 'email' },
      { id: 'mensaje', type: 'text'  },
    ];

    fields.forEach(f => {
      const input  = document.getElementById(f.id);
      const group  = input.closest('.form-group');
      const val    = input.value.trim();
      let   isOk   = val.length > 0;

      if (f.type === 'email') {
        isOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }

      group.classList.toggle('has-error', !isOk);
      input.classList.toggle('error', !isOk);
      if (!isOk) valid = false;
    });

    if (!valid) return;

    // Simulate sending
    formBtn.textContent = 'Enviando...';
    form.querySelector('button[type="submit"]').disabled = true;

    setTimeout(() => {
      form.reset();
      formBtn.textContent = 'Enviar Mensaje';
      form.querySelector('button[type="submit"]').disabled = false;
      formOk.classList.remove('hidden');
      setTimeout(() => formOk.classList.add('hidden'), 5000);
    }, 1800);
  });

  // Real-time validation clear
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      group.classList.remove('has-error');
      input.classList.remove('error');
    });
  });
}

// ─── SMOOTH ANCHOR SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── ACTIVE NAV LINK ON SCROLL ────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--neon)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ─── PHOTO ITEMS STAGGER ──────────────────────────────────────
const photoObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      photoObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.photo-item').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  photoObserver.observe(el);
});

// ─── GLITCH TITLE EFFECT (subtle) ────────────────────────────
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  setInterval(() => {
    heroTitle.style.textShadow = '2px 0 var(--neon)';
    setTimeout(() => heroTitle.style.textShadow = 'none', 80);
  }, 6000);
}

// ─── CONSOLE SIGNATURE ────────────────────────────────────────
console.log(
  `%c⬡ TECNORIENTE JB %c\nIA · Blockchain · Trading Bots\nDesarrollado con 🔥 en Colombia`,
  'background:#00d4ff;color:#030712;font-weight:900;font-size:16px;padding:8px 16px;border-radius:6px 0 0 6px;',
  'color:#00d4ff;font-size:11px;padding:4px;'
);
