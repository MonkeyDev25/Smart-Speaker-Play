'use strict';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

gsap.registerPlugin(ScrollTrigger);

requestAnimationFrame(() => {

/* ── 1. Hero Entrance ─────────────────────────────────────────── */
if (!reducedMotion) {
  // h1 words animate via CSS (@keyframes heroWordIn) — no JS needed for them.
  // gsap.set() establishes initial transforms so .to() can animate from the right position.
  gsap.set(['.hero__badge', '.hero__lede', '.hero__actions'], { y: 30 });

  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to('.hero__badge',   { y: 0, opacity: 1, duration: 0.8 })
    .to('.hero__lede',    { y: 0, opacity: 1, duration: 0.8 }, 0.6)
    .to('.hero__actions', { y: 0, opacity: 1, duration: 0.8 }, 0.8);
}


/* ── 2. Parallax ──────────────────────────────────────────────── */
if (!reducedMotion) {
  document.querySelectorAll('[data-speed]').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-speed')) || 0.3;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}


/* ── 3. Reveal on Scroll ──────────────────────────────────────── */
if (!reducedMotion) {
  document
    .querySelectorAll('[data-reveal]:not(.hero__badge):not(.hero__lede):not(.hero__actions)')
    .forEach(el => {
      if (el.hasAttribute('data-counter')) return;
      gsap.from(el, {
        y: 30, opacity: 0, duration: 0.9,
        delay: parseFloat(el.getAttribute('data-delay')) || 0,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

  document.querySelectorAll('[data-reveal-left]').forEach(el =>
    gsap.from(el, {
      x: -60, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
  );

  document.querySelectorAll('[data-reveal-right]').forEach(el =>
    gsap.from(el, {
      x: 60, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
  );

  document.querySelectorAll('[data-reveal-line]').forEach(el =>
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.9,
      delay: parseFloat(el.getAttribute('data-delay')) || 0,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  );
}


/* ── 4. Number Counters ───────────────────────────────────────── */
document.querySelectorAll('[data-counter]').forEach(el => {
  const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
  const suffix = el.getAttribute('data-suffix') || '';
  const statEl = el.closest('.stat');
  const obj    = { val: 0 };

  ScrollTrigger.create({
    trigger: statEl || el,
    start: 'top 80%',
    once: true,
    onEnter() {
      if (statEl && !reducedMotion) {
        const delay = parseFloat(statEl.getAttribute('data-delay')) || 0;
        gsap.from(statEl, { y: 30, opacity: 0, duration: 0.9, delay, ease: 'power3.out' });
      }
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate() {
          const v = Math.floor(obj.val);
          el.textContent = (target >= 1000 ? v.toLocaleString('it-IT') : v) + suffix;
        },
      });
    },
  });
});


/* ── 5. Sticky Nav + Progress Bar ────────────────────────────── */
const nav         = document.getElementById('nav');
const progressBar = document.getElementById('progressBar');

function updateScrollUI() {
  const y   = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  nav?.classList.toggle('is-scrolled', y > 50);
  if (progressBar && max > 0) progressBar.style.width = `${(y / max) * 100}%`;
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();


/* ── 6. Mobile Nav ───────────────────────────────────────────── */
const burger   = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('is-open');
    navLinks.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', isOpen);
    burger.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav__link').forEach(link =>
    link.addEventListener('click', () => {
      burger.classList.remove('is-open');
      navLinks.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Apri menu');
      document.body.style.overflow = '';
    })
  );
}


/* ── 7. Smooth Anchor Scroll ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link =>
  link.addEventListener('click', e => {
    const href   = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  })
);


/* ── 8. Magnetic Buttons ─────────────────────────────────────── */
if (!reducedMotion) {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    let rect = el.getBoundingClientRect();
    window.addEventListener('resize', () => { rect = el.getBoundingClientRect(); }, { passive: true });

    el.addEventListener('mousemove', e => {
      gsap.to(el, {
        x: (e.clientX - rect.left - rect.width  / 2) * 0.35,
        y: (e.clientY - rect.top  - rect.height / 2) * 0.35,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
    el.addEventListener('mouseleave', () => {
      rect = el.getBoundingClientRect();
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}


/* ── 9. Custom Cursor ────────────────────────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

if (cursor && cursorDot && !reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const xTo    = gsap.quickTo(cursor,    'left', { duration: 0.35, ease: 'power3.out' });
  const yTo    = gsap.quickTo(cursor,    'top',  { duration: 0.35, ease: 'power3.out' });
  const dotXTo = gsap.quickTo(cursorDot, 'left', { duration: 0.15, ease: 'power3.out' });
  const dotYTo = gsap.quickTo(cursorDot, 'top',  { duration: 0.15, ease: 'power3.out' });

  window.addEventListener('mousemove', e => {
    xTo(e.clientX - 18);
    yTo(e.clientY - 18);
    dotXTo(e.clientX - 2);
    dotYTo(e.clientY - 2);
  });

  document.querySelectorAll('a, button, [data-magnetic], summary').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}


/* ── 10. Color Swatches ──────────────────────────────────────── */
const swatches = document.querySelectorAll('.swatch');
swatches.forEach(sw =>
  sw.addEventListener('click', () => {
    swatches.forEach(s => {
      s.classList.remove('swatch--active');
      s.setAttribute('aria-pressed', 'false');
    });
    sw.classList.add('swatch--active');
    sw.setAttribute('aria-pressed', 'true');
  })
);


/* ── 11. Newsletter Form ─────────────────────────────────────── */
const form    = document.getElementById('newsletterForm');
const success = document.getElementById('newsletterSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.querySelector('input')?.value) return;
    form.style.display = 'none';
    success?.classList.add('is-visible');
  });
}

}); // end requestAnimationFrame
