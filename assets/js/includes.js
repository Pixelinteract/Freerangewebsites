/* ── INCLUDES.JS — runs on every page ───────────────────────────── */

/* ── BUILD SPOTS CONFIG (G1) ──────────────── */
const BUILD_SPOTS = { total: 4, taken: 1 };

(function () {

  /* ── GA4 HELPER (G5) ─────────────────────── */
  function ga(event, params) {
    if (typeof window.gtag === 'function') window.gtag('event', event, params || {});
  }
  window.frwGA = ga;

  /* ── INJECT HEADER + FOOTER ──────────────── */
  function load(id, url, callback) {
    fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        document.getElementById(id).innerHTML = html;
        if (callback) callback();
      });
  }

  var page = (window.location.pathname.split('/').pop() || 'index.html');
  if (page === '') page = 'index.html';
  var onIndex = (page === 'index.html');

  /* ── SPOTS BAR (G1) ──────────────────────── */
  function renderSpotsBar() {
    var bar = document.getElementById('spotsBar');
    var inner = document.getElementById('spotsBarInner');
    if (!bar || !inner) return;

    var now = new Date();
    var monthName = now.toLocaleString('en-AU', { month: 'long' });
    var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    var daysLeft = lastDay - now.getDate();

    if (BUILD_SPOTS.taken >= BUILD_SPOTS.total) {
      // Full — waitlist framing, link to contact
      inner.innerHTML = 'Build spots full for ' + monthName + ' — join the waitlist →';
      bar.setAttribute('href', 'contact.html');
      bar.classList.add('spots-bar-full');
    } else {
      // Zero-pad to two digits and render each digit as a counter tile.
      var dd = String(daysLeft).padStart(2, '0');
      var digits = dd.split('').map(function (d) { return '<b class="sc-digit">' + d + '</b>'; }).join('');
      inner.innerHTML = '⚡ ' + BUILD_SPOTS.total +
        ' free website spots left this month' +
        '<span class="spots-days"><span class="spots-sep">·</span>' +
        '<span class="spots-counter">' + digits + '</span> day' + (daysLeft === 1 ? '' : 's') +
        ' until spots reset</span>';
      bar.setAttribute('href', onIndex ? '#pricing' : 'index.html#pricing');
    }
  }

  /* ── Rewrite cross-page anchors to same-page on index (smooth scroll) ── */
  function rewriteAnchors(root) {
    if (!onIndex) return;
    (root || document).querySelectorAll('a[href^="index.html#"]').forEach(function (a) {
      a.setAttribute('href', a.getAttribute('href').replace('index.html#', '#'));
    });
  }

  load('site-header', 'assets/includes/header.html', function () {

    renderSpotsBar();
    rewriteAnchors(document.getElementById('site-header'));

    /* ── ACTIVE NAV LINK ───────────────────── */
    document.querySelectorAll('.nav-links a, .mob-nav a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0];
      if (href === page || ((href === 'index.html' || href === '') && onIndex)) a.classList.add('active');
    });

    /* ── NAV SCROLL HIDE/SHOW ──────────────── */
    var navPill = document.getElementById('navPill');
    var lastScroll = 0;
    var ticking = false;
    setTimeout(function () { navPill.classList.add('visible'); }, 100);
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var st = window.scrollY;
          var dh = document.documentElement.scrollHeight - window.innerHeight;
          document.getElementById('npFill').style.width = (dh > 0 ? (st / dh * 100) : 0) + '%';
          if (st > lastScroll && st > 120) {
            navPill.classList.remove('visible');
            navPill.classList.add('hidden');
          } else {
            navPill.classList.remove('hidden');
            navPill.classList.add('visible');
          }
          lastScroll = st <= 0 ? 0 : st;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    /* ── MOBILE NAV TOGGLE ─────────────────── */
    document.getElementById('ham').addEventListener('click', function () {
      document.getElementById('mobNav').classList.toggle('open');
    });

    /* ── SMOOTH ANCHORS ────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var hash = this.getAttribute('href');
        if (hash === '#' || hash.length < 2) return;
        var t = document.querySelector(hash);
        if (t) {
          e.preventDefault();
          window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 88, behavior: 'smooth' });
        }
      });
    });
  });

  load('site-footer', 'assets/includes/footer.html', function () {
    var yr = document.getElementById('copyright-year');
    if (yr) yr.textContent = new Date().getFullYear();
    rewriteAnchors(document.getElementById('site-footer'));
  });

  /* ── GA4 EVENT WIRING (G5) — delegated, sitewide ── */
  document.addEventListener('click', function (e) {
    var ctaEl = e.target.closest('[data-ga-cta]');
    if (ctaEl) ga('cta_click', { location: ctaEl.getAttribute('data-ga-cta') });
    var evEl = e.target.closest('[data-ga-event]');
    if (evEl) ga(evEl.getAttribute('data-ga-event'), {});
  });

})();
