/**
 * KERN Landing — vanilla JS
 * GSAP ScrollTrigger: parallax, reveals, counters
 * Vanilla: magnetic buttons, custom cursor, nav, newsletter, swatches
 * Press strip: CSS marquee (no Swiper)
 */

(function () {
  'use strict';

  /* ---- Reduced motion check ---- */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Register GSAP plugins ---- */
  gsap.registerPlugin(ScrollTrigger);


  /* =====================================================
     1. GSAP — Hero Entrance
     ===================================================== */
  if (!reducedMotion) {
    // Badge
    gsap.from('[data-reveal]:not([data-counter])', {
      // We'll handle reveals in section 4, but the hero ones are special (timeline)
    });

    var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .from('.hero__badge', { y: 30, opacity: 0, duration: 0.8 })
      .from('[data-reveal-word]', {
        y: 40,
        rotateX: 20,
        opacity: 0,
        duration: 0.9,
        stagger: 0.06,
        transformOrigin: 'bottom',
      }, 0.1)
      .from('.hero__lede', { y: 30, opacity: 0, duration: 0.8 }, 0.6)
      .from('.hero__actions', { y: 30, opacity: 0, duration: 0.8 }, 0.8)
      .from('.hero__scroll', { y: 20, opacity: 0, duration: 0.6 }, 1.1);
  }


  /* =====================================================
     3. GSAP — Parallax (ScrollTrigger)
     ===================================================== */
  if (!reducedMotion) {
    // Background parallax elements (data-speed)
    document.querySelectorAll('[data-speed]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-speed')) || 0.3;

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


  /* =====================================================
     4. GSAP — Reveal on Scroll
     ===================================================== */
  if (!reducedMotion) {
    // Standard reveals (fade up)
    document.querySelectorAll('[data-reveal]:not(.hero__badge):not(.hero__lede):not(.hero__actions):not(.hero__scroll)').forEach(function (el) {
      var delay = parseFloat(el.getAttribute('data-delay')) || 0;

      // Skip counters — they get their own trigger
      if (el.hasAttribute('data-counter')) return;

      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      });
    });

    // Reveal from left
    document.querySelectorAll('[data-reveal-left]').forEach(function (el) {
      gsap.from(el, {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    });

    // Reveal from right
    document.querySelectorAll('[data-reveal-right]').forEach(function (el) {
      gsap.from(el, {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    });

    // Quote lines
    document.querySelectorAll('[data-reveal-line]').forEach(function (el) {
      var delay = parseFloat(el.getAttribute('data-delay')) || 0;

      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
      });
    });
  }


  /* =====================================================
     5. GSAP — Number Counters
     ===================================================== */
  document.querySelectorAll('[data-counter]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-counter'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var obj = { val: 0 };

    // Also animate the parent .stat container
    var statEl = el.closest('.stat');

    ScrollTrigger.create({
      trigger: statEl || el,
      start: 'top 80%',
      once: true,
      onEnter: function () {
        // Fade in stat
        if (statEl && !reducedMotion) {
          var delay = parseFloat(statEl.getAttribute('data-delay')) || 0;
          gsap.from(statEl, { y: 30, opacity: 0, duration: 0.9, delay: delay, ease: 'power3.out' });
        }

        // Count up
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function () {
            var v = Math.floor(obj.val);
            el.textContent = (target >= 1000 ? v.toLocaleString('it-IT') : v) + suffix;
          },
        });
      },
    });
  });


  /* =====================================================
     6. Sticky Nav + Progress Bar
     ===================================================== */
  var nav = document.getElementById('nav');
  var progressBar = document.getElementById('progressBar');

  function updateScrollUI() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (nav) {
      nav.classList.toggle('is-scrolled', y > 50);
    }
    if (progressBar && max > 0) {
      progressBar.style.width = ((y / max) * 100) + '%';
    }
  }

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();


  /* =====================================================
     7. Mobile Nav (Hamburger)
     ===================================================== */
  var burger = document.getElementById('navBurger');
  var navLinks = document.getElementById('navLinks');

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('is-open');
      navLinks.classList.toggle('is-open');
      document.body.style.overflow = navLinks.classList.contains('is-open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('is-open');
        navLinks.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }


  /* =====================================================
     8. Smooth Anchor Scroll
     ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* =====================================================
     9. Magnetic Buttons
     ===================================================== */
  if (!reducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var strength = 0.35;

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.3, ease: 'power2.out' });
      });

      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }


  /* =====================================================
     10. Custom Cursor
     ===================================================== */
  var cursor = document.getElementById('cursor');
  var cursorDot = document.getElementById('cursorDot');

  if (cursor && cursorDot && !reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Use GSAP quickTo for buttery smooth cursor
    var xTo = gsap.quickTo(cursor, 'left', { duration: 0.35, ease: 'power3.out' });
    var yTo = gsap.quickTo(cursor, 'top', { duration: 0.35, ease: 'power3.out' });
    var dotXTo = gsap.quickTo(cursorDot, 'left', { duration: 0.15, ease: 'power3.out' });
    var dotYTo = gsap.quickTo(cursorDot, 'top', { duration: 0.15, ease: 'power3.out' });

    window.addEventListener('mousemove', function (e) {
      xTo(e.clientX - 18);
      yTo(e.clientY - 18);
      dotXTo(e.clientX - 2);
      dotYTo(e.clientY - 2);
    });

    // Hover state
    document.querySelectorAll('a, button, [data-magnetic], summary').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hover'); });
    });
  }


  /* =====================================================
     11. Color Swatch Interaction
     ===================================================== */
  var swatches = document.querySelectorAll('.swatch');

  swatches.forEach(function (sw) {
    sw.addEventListener('click', function () {
      swatches.forEach(function (s) { s.classList.remove('swatch--active'); });
      sw.classList.add('swatch--active');
    });
  });


  /* =====================================================
     12. Newsletter Form
     ===================================================== */
  var form = document.getElementById('newsletterForm');
  var success = document.getElementById('newsletterSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input');
      if (!input || !input.value) return;
      form.style.display = 'none';
      if (success) success.classList.add('is-visible');
    });
  }

})();
