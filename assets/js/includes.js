/* ── INCLUDES.JS — runs on every page ───────────────────────────── */

(function () {

  /* ── INJECT HEADER + FOOTER ──────────────── */
  function load(id, url, callback) {
    fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        document.getElementById(id).innerHTML = html;
        if (callback) callback();
      });
  }

  load('site-header', 'assets/includes/header.html', function () {

    /* ── ACTIVE NAV LINK ───────────────────── */
    var page = (window.location.pathname.split('/').pop() || 'index.html');
    if (page === '') page = 'index.html';
    document.querySelectorAll('.nav-links a, .mob-nav a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0];
      if (href === page || (href === 'index.html' && page === 'index.html')) a.classList.add('active');
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
        var t = document.querySelector(this.getAttribute('href'));
        if (t) {
          e.preventDefault();
          window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 88, behavior: 'smooth' });
        }
      });
    });

  });

  load('site-footer', 'assets/includes/footer.html');

})();
