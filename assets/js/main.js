/* ═══════════════════════════════════════════════════════════
   URSUS Landing — main.js
   ═══════════════════════════════════════════════════════════ */

// ── Navbar scroll effect ─────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// ── Hamburger menu ───────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
});

// Cerrar menú al hacer clic en un link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => {
            s.style.transform = ''; s.style.opacity = '';
        });
    });
});

// ── Scroll reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger delay basado en la posición en su grid
            const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
            const index    = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = (index % 4) * 80 + 'ms';
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Screenshot tabs ──────────────────────────────────────────
const tabs   = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t   => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`[data-panel="${target}"]`).classList.add('active');
        // Re-trigger reveal on new panel
        document.querySelector(`[data-panel="${target}"]`)
            .querySelectorAll('.reveal')
            .forEach(el => { el.classList.remove('visible'); setTimeout(() => el.classList.add('visible'), 50); });
    });
});

// ── Smooth active nav link on scroll ────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navItems.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── CTA Form ─────────────────────────────────────────────────
const ctaForm = document.getElementById('cta-form');
ctaForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = ctaForm.querySelector('button[type="submit"]');
    btn.textContent = '¡Solicitud enviada! Te contactaremos pronto.';
    btn.disabled = true;
    btn.style.background = '#10b981';
    btn.style.boxShadow  = '0 0 30px rgba(16,185,129,0.3)';
    ctaForm.querySelectorAll('.form-input').forEach(i => { i.value = ''; i.disabled = true; });
});

// ── Floating cards micro-animation on hover ──────────────────
document.querySelectorAll('.float-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.animation = 'none';
        card.style.transform = 'scale(1.04)';
        card.style.boxShadow = '0 12px 40px rgba(14,165,233,0.2)';
        card.style.borderColor = 'rgba(14,165,233,0.4)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.borderColor = '';
        void card.offsetWidth; // reflow
        card.style.animation = '';
    });
});

// ── Counter animation on stats ───────────────────────────────
function animateCounter(el, target, suffix = '', prefix = '') {
    const duration = 1800;
    const start    = performance.now();
    const isFloat  = target.toString().includes('.');
    const from     = 0;
    const to       = parseFloat(target);

    const step = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const value    = from + (to - from) * eased;
        el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(el => {
            const raw = el.textContent.trim();
            if (raw.includes('+'))    animateCounter(el, raw.replace(/[^0-9.]/g,''), '+', '+');
            else if (raw.includes('%')) animateCounter(el, raw.replace('%',''), '%');
            else if (raw.includes('<')) { /* leave as-is */ }
        });
        statsObserver.unobserve(entry.target);
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── Currency toggle COP ↔ USD ─────────────────────────────
const currToggle  = document.getElementById('currency-toggle');
const labelCop    = document.getElementById('label-cop');
const labelUsd    = document.getElementById('label-usd');

if (currToggle) {
    currToggle.addEventListener('click', () => {
        const isUSD = currToggle.getAttribute('aria-checked') === 'true';
        const nowUSD = !isUSD;

        currToggle.setAttribute('aria-checked', nowUSD ? 'true' : 'false');

        // Mostrar/ocultar precios
        document.querySelectorAll('.price-cop').forEach(el => el.classList.toggle('hidden', nowUSD));
        document.querySelectorAll('.price-usd').forEach(el => el.classList.toggle('hidden', !nowUSD));

        // Highlight label activo
        labelCop.classList.toggle('active', !nowUSD);
        labelUsd.classList.toggle('active', nowUSD);
    });

    // Estado inicial: COP activo
    labelCop.classList.add('active');
}
