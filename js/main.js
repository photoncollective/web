/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const icon   = item.querySelector('.faq-icon');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(open => {
        const a = open.querySelector('.faq-answer');
        const q = open.querySelector('.faq-question');
        a.style.maxHeight = a.scrollHeight + 'px';
        requestAnimationFrame(() => { a.style.maxHeight = '0'; });
        open.classList.remove('open');
        open.querySelector('.faq-icon').textContent = '+';
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        icon.textContent = '−';
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      } else {
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function initHeroSub() {
  const sub = document.querySelector('.hero-sub');
  if (!sub) return;

  const words = sub.textContent.trim().split(/\s+/);
  const stagger = 0.042;
  const base = 0.05;

  sub.innerHTML = words.map((word, i) => {
    const delay = (base + i * stagger).toFixed(3);
    return `<span class="hero-sub-word" style="animation-delay:${delay}s">${word}</span>`;
  }).join(' ');

  sub.style.opacity = '1';
}

/* ============================================================
   SCROLL PILL NAV
   ============================================================ */
function initScrollPill() {
  const nav = document.querySelector('.nav');
  const navInner = document.querySelector('.nav-inner');
  if (!nav || !navInner) return;

  const update = () => {
    const scrolled = window.scrollY > 50;
    nav.classList.toggle('is-scrolled', scrolled);
    navInner.classList.toggle('is-scrolled', scrolled);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ============================================================
   MOBILE NAV
   ============================================================ */
function initNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  const backdrop   = document.querySelector('.nav-backdrop');
  if (!hamburger || !mobileMenu) return;

  function closeMenu() {
    mobileMenu.classList.remove('open');
    backdrop?.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    backdrop?.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  backdrop?.addEventListener('click', closeMenu);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ============================================================
   SECURITY CARD MATRIX
   ============================================================ */
function initCardMatrix(card) {
  const canvas = card.querySelector('.sec-card-matrix');
  if (!canvas) return;

  const dpr    = window.devicePixelRatio || 1;
  const gap    = 5;
  const baseR  = 1.0;
  const HIDE_DUR = 300;

  let W = 0, H = 0, cx = 0, cy = 0, maxR = 0;
  let dots = [];
  let ctx  = null;
  let raf = null, hoverTs = null, hideTs = null, hiding = false;
  let snap = null;

  function buildCanvas() {
    const newW = card.offsetWidth;
    const newH = card.offsetHeight;
    if (!newW || !newH) return;
    if (newW === W && newH === H) return;

    if (raf) { cancelAnimationFrame(raf); raf = null; }
    hoverTs = null; hideTs = null; hiding = false; snap = null;

    W = newW; H = newH;
    cx = W / 2; cy = H / 2;
    maxR = Math.sqrt(cx * cx + cy * cy);

    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';

    ctx = canvas.getContext('2d');

    const clearR   = maxR * 0.24;
    const blendR   = maxR * 0.18;
    const waveSpan = maxR - clearR;

    dots = [];
    for (let y = 0; y < H; y += gap) {
      for (let x = 0; x < W; x += gap) {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

        let mask = 0;
        if (dist >= clearR + blendR)  mask = 1;
        else if (dist >= clearR)      mask = (dist - clearR) / blendR;
        if (mask < 0.05) continue;

        const radialT      = Math.min((dist - clearR) / (maxR - clearR), 1);
        const radialBright = 0.28 + 0.72 * radialT;

        const roll = Math.random();
        const base = roll < 0.10
          ? 0.50 + Math.random() * 0.40
          : 0.06 + Math.random() * 0.24;

        dots.push({
          x, y, dist,
          a:      base * mask * radialBright,
          delay:  ((dist - clearR) / waveSpan) * 260,
          dur:    70 + Math.random() * 60,
          aPhase: Math.random() * Math.PI * 2,
          aRate:  0.00090 + Math.random() * 0.00080,
          sPhase: Math.random() * Math.PI * 2,
          sRate:  0.00160 + Math.random() * 0.00120,
        });
      }
    }
  }

  new ResizeObserver(buildCanvas).observe(card);

  // Live alpha + radius — runs at all times, even during the wave reveal.
  // By keeping this unified, there is no phase switch and therefore no flicker.
  function liveAR(dot, ts) {
    const a = Math.max(0, dot.a * (1 + 0.09 * Math.sin(ts * dot.aRate + dot.aPhase)));
    const r = baseR * Math.max(0.3, 1 + 0.18 * Math.sin(ts * dot.sRate + dot.sPhase));
    return { a, r };
  }

  // Wave factor: how much of liveAR to show based on where the wave front is.
  // Pre-wave: dots are dim (5% alpha, 50% radius) but already present.
  // As wave passes: ramps smoothly to 1.0. No jump possible.
  function waveFactor(dot, elapsed) {
    if (elapsed === null) return { aMult: 0, rMult: 0 };
    const de = elapsed - dot.delay;
    if (de <= 0) return { aMult: 0.05, rMult: 0.5 };
    let t = Math.min(de / dot.dur, 1);
    t = 1 - Math.pow(1 - t, 2);
    return { aMult: 0.05 + 0.95 * t, rMult: 0.5 + 0.5 * t };
  }

  function drawDots(getAR) {
    ctx.clearRect(0, 0, W * dpr, H * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#87e1fc';
    dots.forEach((dot, i) => {
      const { a, r } = getAR(dot, i);
      if (a < 0.01 || r < 0.1) return;
      ctx.globalAlpha = Math.min(a, 1);
      ctx.beginPath();
      ctx.arc(dot.x + 1, dot.y + 1, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function animate(ts) {
    if (hiding) {
      if (!hideTs) hideTs = ts;
      const elapsed = ts - hideTs;
      const fade    = Math.max(0, 1 - elapsed / HIDE_DUR);
      drawDots((dot, i) => {
        const s = snap ? snap[i] : { a: dot.a, r: baseR };
        return { a: s.a * fade, r: s.r };
      });
      if (elapsed < HIDE_DUR) raf = requestAnimationFrame(animate);
      else raf = null;
      return;
    }

    if (!hoverTs) hoverTs = ts;
    const elapsed = ts - hoverTs;

    drawDots(dot => {
      const { a: lA, r: lR } = liveAR(dot, ts);
      const { aMult, rMult } = waveFactor(dot, elapsed);
      return { a: lA * aMult, r: lR * rMult };
    });

    raf = requestAnimationFrame(animate);
  }

  function onEnter() {
    if (raf) cancelAnimationFrame(raf);
    hiding = false; hoverTs = null; hideTs = null;
    raf = requestAnimationFrame(animate);
  }

  function onLeave() {
    if (raf) cancelAnimationFrame(raf);
    const now     = performance.now();
    const elapsed = hoverTs ? (now - hoverTs) : null;
    snap = dots.map(dot => {
      const { a: lA, r: lR } = liveAR(dot, now);
      const { aMult, rMult } = waveFactor(dot, elapsed);
      return { a: lA * aMult, r: lR * rMult };
    });
    hiding = true; hideTs = null;
    raf = requestAnimationFrame(animate);
  }

  card.addEventListener('mouseenter', onEnter);
  card.addEventListener('mouseleave', onLeave);
}

function initSecurityCards() {
  document.querySelectorAll('.sec-card').forEach(initCardMatrix);
}

/* ============================================================
   ABOUT — PORTRAIT HOVER
   ============================================================ */
function initAboutPhotos() {
  const strip = document.querySelector('.about-photo-strip');
  if (!strip) return;

  const cols   = [...strip.querySelectorAll('.about-photo-col')];
  const labels = [...document.querySelectorAll('.about-photo-label')];
  if (cols.length !== labels.length) return;

  function expandPhoto(index) {
    cols.forEach((c, j) => {
      c.classList.toggle('pc-expanded',  j === index);
      c.classList.toggle('pc-collapsed', j !== index);
      const img = c.querySelector('.about-photo-img');
      if (img) img.setAttribute('aria-hidden', j !== index ? 'true' : 'false');
    });
    labels.forEach((l, j) => {
      l.classList.toggle('pc-visible', j === index);
    });
  }

  function collapsePhotos() {
    cols.forEach(c => {
      c.classList.remove('pc-expanded', 'pc-collapsed');
      const img = c.querySelector('.about-photo-img');
      if (img) img.removeAttribute('aria-hidden');
    });
    labels.forEach(l => l.classList.remove('pc-visible'));
  }

  let touchPending = false;

  cols.forEach((col, i) => {
    col.setAttribute('tabindex', '0');
    col.setAttribute('role', 'button');

    col.addEventListener('touchstart', () => {
      touchPending = true;
      expandPhoto(i);
    }, { passive: true });

    col.addEventListener('mouseenter', () => expandPhoto(i));

    col.addEventListener('click', () => {
      if (touchPending) { touchPending = false; return; }
      if (col.classList.contains('pc-expanded')) collapsePhotos();
      else expandPhoto(i);
    });

    col.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (col.classList.contains('pc-expanded')) collapsePhotos();
        else expandPhoto(i);
      }
    });
  });

  strip.addEventListener('mouseleave', collapsePhotos);

  document.addEventListener('touchstart', function(e) {
    if (!strip.contains(e.target)) collapsePhotos();
  }, { passive: true });
}

/* ============================================================
   BOOKING FORM
   ============================================================ */
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyBtJxjDk5Kc8GQj96CsjOnUiNTAwmOuLtRzkBdySON7X-KXRqF467LQhNiRSyS2AM1/exec';

  const formWrap = document.getElementById('booking-form-wrap');
  const success = document.getElementById('booking-success');
  const errorEl = document.getElementById('booking-form-error');
  const submitBtn = form.querySelector('.booking-submit');

  const topicLabels = {
    workflows: 'Workflow bottlenecks',
    data: 'Data & reporting',
    legacy: 'Legacy systems',
    'new-build': 'New tool or platform',
    exploring: 'Not sure yet',
  };

  function clearErrors() {
    errorEl.hidden = true;
    errorEl.textContent = '';
    form.querySelectorAll('.form-field.has-error').forEach(f => f.classList.remove('has-error'));
  }

  function setFieldError(id) {
    const field = form.querySelector(`#${id}`)?.closest('.form-field');
    if (field) field.classList.add('has-error');
  }

  function showSuccess() {
    if (formWrap) formWrap.hidden = true;
    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const firm = form.firm.value.trim();
    const topic = form.topic.value;
    const message = form.message.value.trim();

    const missing = [];
    if (!name) { missing.push('name'); setFieldError('booking-name'); }
    if (!email) { missing.push('email'); setFieldError('booking-email'); }
    if (!firm) { missing.push('firm'); setFieldError('booking-firm'); }
    if (!topic) { missing.push('topic'); setFieldError('booking-topic'); }

    if (missing.length) {
      errorEl.textContent = 'Please complete the required fields.';
      errorEl.hidden = false;
      form.querySelector(`#booking-${missing[0]}`)?.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('booking-email');
      errorEl.textContent = 'Enter a valid work email address.';
      errorEl.hidden = false;
      form.email.focus();
      return;
    }

    const payload = {
      name,
      email,
      firm,
      topic: topicLabels[topic] || topic,
      message: message || '',
    };

    const submitLabel = submitBtn?.querySelector('span');
    if (submitBtn) {
      submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = 'Sending…';
    }

    // mode: 'no-cors' because Apps Script cannot set CORS headers via ContentService.
    // The request still reaches and executes on the server; an opaque response = success.
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(() => {
        showSuccess();
      })
      .catch(() => {
        showError('Something went wrong. Please email us directly at hello@photoncollective.dev.');
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitLabel) submitLabel.textContent = 'Send request';
        }
      });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initHeroSub();
  initFAQ();
  initNav();
  initScrollPill();
  initReveal();
  initSecurityCards();
  initAboutPhotos();
  initBookingForm();
});
