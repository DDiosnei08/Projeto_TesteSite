import { renderVehicles } from './vehicles.js';
import { renderReviews } from './reviews.js';
import { initModals, openFinancingModal } from './modals.js';
import { sanitizeText, validateTradeInForm } from './validation.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

function hideLoadingScreen() {
  const ls = document.getElementById('loadingScreen');
  if (ls) {
    setTimeout(() => {
      ls.classList.add('hidden-load');
      setTimeout(() => ls.remove(), 800);
    }, 1800);
  }
}

function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  const consent = localStorage.getItem('nicolau_cookie_consent');
  if (!consent) {
    setTimeout(() => banner.classList.remove('hidden'), 2200);
  }
  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('nicolau_cookie_consent', 'accepted');
    banner.classList.add('hidden');
  });
  document.getElementById('cookieReject')?.addEventListener('click', () => {
    localStorage.setItem('nicolau_cookie_consent', 'rejected');
    banner.classList.add('hidden');
  });
}

function initPrivacyModal() {
  const modal = document.getElementById('privacyModal');
  if (!modal) return;
  document.querySelectorAll('[data-open-privacy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (window.lucide) window.lucide.createIcons();
    });
  });
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close-privacy]') || e.target.classList.contains('modal-backdrop')) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
}

function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('mobileMenuIcon');
  if (!btn || !menu) return;

  const setState = (open) => {
    if (open) {
      menu.classList.remove('hidden');
      menu.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      if (icon) icon.setAttribute('data-lucide', 'x');
    } else {
      menu.classList.remove('open');
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      if (icon) icon.setAttribute('data-lucide', 'menu');
    }
    if (window.lucide) window.lucide.createIcons();
  };

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    setState(!isOpen);
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setState(false)));
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  renderVehicles('all');
  renderReviews();
  initModals();
  initCookieConsent();
  initPrivacyModal();
  initMobileMenu();

  hideLoadingScreen();

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderVehicles(btn.dataset.filter);
    });
  });

  document.addEventListener('click', (e) => {
    const sim = e.target.closest('[data-simulate]');
    if (sim) {
      e.preventDefault();
      openFinancingModal({
        name: sim.dataset.name,
        price: parseFloat(sim.dataset.price)
      });
    }
  });

  const tradeForm = document.getElementById('tradeInForm');
  if (tradeForm) {
    tradeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(tradeForm);
      const payload = {
        nome: data.get('nome'),
        telefone: data.get('telefone'),
        marca: data.get('marca'),
        modelo: data.get('modelo'),
        ano: data.get('ano'),
        km: data.get('km'),
        obs: data.get('obs')
      };
      const result = validateTradeInForm(payload);
      if (!result.valid) {
        alert('Por favor, verifique os campos: ' + result.errors.join(', '));
        return;
      }
      const safe = sanitizeText;
      const msg = `Olá! Quero avaliar meu veículo:%0A%0A*Nome:* ${encodeURIComponent(safe(payload.nome))}%0A*Telefone:* ${encodeURIComponent(safe(payload.telefone))}%0A*Marca:* ${encodeURIComponent(safe(payload.marca))}%0A*Modelo:* ${encodeURIComponent(safe(payload.modelo))}%0A*Ano:* ${encodeURIComponent(safe(payload.ano))}%0A*KM:* ${encodeURIComponent(safe(payload.km))}%0A*Obs:* ${encodeURIComponent(safe(payload.obs || '-'))}`;
      window.open(`https://wa.me/5542991311244?text=${msg}`, '_blank');
    });
  }

  const shouldAnimate = window.gsap && window.ScrollTrigger && !prefersReducedMotion && !isTouchDevice;

  if (shouldAnimate) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-anim', {
      y: 50, opacity: 0, duration: 1.1, stagger: 0.15, ease: 'power3.out', delay: 0.3
    });

    gsap.to('#heroBg img', {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('#heroContent', {
      yPercent: -15,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    ScrollTrigger.batch('.feature-card', {
      start: 'top 85%',
      onEnter: batch => gsap.to(batch, {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out'
      })
    });

    gsap.utils.toArray('section').forEach(sec => {
      const headings = sec.querySelectorAll('h2, .review-card, .glass:not(.modal-card)');
      gsap.from(headings, {
        scrollTrigger: { trigger: sec, start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out'
      });
    });

    ScrollTrigger.refresh();
  }
});

document.addEventListener('vehiclesRendered', () => {
  if (window.gsap && window.ScrollTrigger && !prefersReducedMotion && !isTouchDevice) {
    gsap.fromTo('.vehicle-card',
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#vehiclesGrid', start: 'top 85%' }
      }
    );
  }
});
