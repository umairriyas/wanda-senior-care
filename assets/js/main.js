// ================================================
//  MILLER SENIOR CARE CLINIC — main.js
// ================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Navbar Scroll Effect ──
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('backToTop')?.classList.toggle('show', window.scrollY > 400);
  });

  // ── 2. Hamburger Mobile Menu ──
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  hamburger?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') hamburger.click();
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── 3. Active Nav Link (per page) ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── 4. Scroll Reveal Animation ──
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 90);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  // ── 5. Stats Counter Animation ──
  const statEls  = document.querySelectorAll('[data-target]');
  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      let current  = 0;
      const step   = Math.ceil(target / 70);
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, 25);
      statsObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statsObs.observe(el));

  // ── 6. Back to Top Button ──
  document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── 7. Contact Form — AJAX via FormSubmit.co ──
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameEl    = form.querySelector('#name');
    const emailEl   = form.querySelector('#email');
    const messageEl = form.querySelector('#message');
    const emailReg  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    clearErrors();

    let valid = true;
    if (!nameEl.value.trim())              { showError(nameEl,    'Please enter your full name.');    valid = false; }
    if (!emailReg.test(emailEl.value.trim())) { showError(emailEl, 'Please enter a valid email address.'); valid = false; }
    if (!messageEl.value.trim())           { showError(messageEl, 'Please enter your message.');      valid = false; }
    if (!valid) return;

    const btn     = form.querySelector('button[type="submit"]');
    const success = document.getElementById('formSuccess');

    btn.disabled  = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      const response = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        btn.disabled  = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        if (success) {
          success.style.display = 'flex';
          setTimeout(() => success.style.display = 'none', 6000);
        }
      } else {
        throw new Error('Server responded with an error.');
      }

    } catch (err) {
      btn.disabled  = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      alert('Something went wrong. Please call Wanda directly at (505) 249-6170.');
    }
  });

  function showError(el, msg) {
    const err       = document.createElement('span');
    err.className   = 'field-error';
    err.style.cssText = 'color:#c62828;font-size:0.80rem;margin-top:4px;display:block;';
    err.textContent = msg;
    el.style.borderColor = '#c62828';
    el.parentNode.appendChild(err);
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(e => e.remove());
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select')
      .forEach(el => el.style.borderColor = '');
  }

  // ── 8. Smooth Anchor Scrolling ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 9. Close mobile menu on outside click ──
  document.addEventListener('click', (e) => {
    if (
      navLinks?.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

});