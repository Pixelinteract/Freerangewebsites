/* ── HOME.JS — index.html only ───────────────────────────────────── */

(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── HERO ENTRANCE (GSAP — hero only) ─────── */
  // Guarantee the final (visible) state — the hero headline is the LCP element,
  // so it must never be left hidden if the tween stalls or GSAP fails.
  function finalizeHero() {
    var hero = document.querySelector('.hero');
    if (hero) hero.classList.add('motion-ready');
    document.querySelectorAll('.hero .hero-anim').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    ['sketchLine1', 'sketchLine2'].forEach(function (id) {
      var p = document.getElementById(id);
      if (p) p.style.strokeDashoffset = '0';
    });
  }

  var heroRan = false;
  function runHeroEntrance() {
    if (heroRan) return;
    heroRan = true;
    var hero = document.querySelector('.hero');
    if (hero) hero.classList.add('motion-ready');
    if (reduce || !window.gsap) { finalizeHero(); return; }

    var items = document.querySelectorAll('.hero .hero-anim');
    // Watchdog: if the timeline hasn't completed shortly (e.g. rAF throttled),
    // kill it and snap the hero to its visible final state.
    var watchdog = setTimeout(function () { if (tl) tl.kill(); finalizeHero(); }, 1800);

    var tl = window.gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: function () { clearTimeout(watchdog); }
    });
    tl.from(items, { opacity: 0, y: 24, duration: 0.6, stagger: 0.12 });

    // Scribble draws left-to-right as the final beat.
    ['#sketchLine1', '#sketchLine2'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) window.gsap.set(el, { strokeDasharray: 300, strokeDashoffset: 300 });
    });
    tl.to('#sketchLine1', { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.1')
      .to('#sketchLine2', { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.35');
  }

  if (window.gsap) {
    runHeroEntrance();
  } else {
    // GSAP is deferred — wait for load, with a safety fallback.
    window.addEventListener('load', runHeroEntrance);
    setTimeout(function () { if (!window.gsap) finalizeHero(); else runHeroEntrance(); }, 1500);
  }

  /* ── SCROLL REVEAL (Intersection Observer) ── */
  var rvEls = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    rvEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var rvObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
    rvEls.forEach(function (el) { rvObs.observe(el); });
  }

  /* ── COUNT-UP ANIMATION (Intersection Observer) ── */
  var countEls = document.querySelectorAll('[data-count-to]');
  function runCount(el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
    if (reduce) { el.textContent = target; return; }
    var duration = parseInt(el.getAttribute('data-count-duration'), 10) || 900;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  if (reduce || !('IntersectionObserver' in window)) {
    countEls.forEach(function (el) { el.textContent = el.getAttribute('data-count-to'); });
  } else {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); countObs.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    countEls.forEach(function (el) { countObs.observe(el); });
  }

  /* ── FAQ ACCORDION ────────────────────────── */
  window.toggleFaq = function (item) {
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function (el) {
      el.classList.remove('open');
      el.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) { item.classList.add('open'); item.setAttribute('aria-expanded', 'true'); }
  };
  // Make accordion headers keyboard-operable.
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-expanded', 'false');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.toggleFaq(item); }
    });
  });

  /* ── SHOWCASE FILTER + SHOW MORE ──────────── */
  var filters = document.querySelectorAll('.sc-filter');
  var cards = document.querySelectorAll('.showcase-grid .show-card');
  var SHOW_LIMIT = 8;
  var expanded = false;
  var activeFilter = 'all';

  function applyShowcase() {
    var shown = 0;
    cards.forEach(function (card) {
      var match = (activeFilter === 'all' || card.getAttribute('data-trade') === activeFilter);
      if (match && (expanded || shown < SHOW_LIMIT)) {
        card.style.display = '';
        shown++;
      } else {
        card.style.display = 'none';
      }
    });
    // Count total matches to decide Show more visibility.
    var totalMatch = 0;
    cards.forEach(function (card) {
      if (activeFilter === 'all' || card.getAttribute('data-trade') === activeFilter) totalMatch++;
    });
    var wrap = document.getElementById('showMoreWrap');
    if (wrap) wrap.hidden = !(totalMatch > SHOW_LIMIT && !expanded);
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      expanded = false;
      applyShowcase();
    });
  });
  var showMoreBtn = document.getElementById('showMoreBtn');
  if (showMoreBtn) showMoreBtn.addEventListener('click', function () { expanded = true; applyShowcase(); });
  if (cards.length) applyShowcase();

  /* ── REVIEWS TICKER — two rows, 15 real quotes each ────────── */
  var revGoogleSvg = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44a5.5 5.5 0 0 1-2.39 3.6v3h3.86c2.26-2.08 3.56-5.14 3.56-8.84z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.86-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.29a12 12 0 0 0 0 10.78z"/><path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.61l3.98 3.1C6.22 6.86 8.87 4.77 12 4.77z"/></svg>';
  var revAvatarColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#7C5CBF', '#FF6F61', '#00A79D', '#F4511E', '#5C6BC0', '#26A69A', '#EC407A', '#8D6E63'];
  function randomAvatar() {
    var letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    var color = revAvatarColors[Math.floor(Math.random() * revAvatarColors.length)];
    return { letter: letter, color: color };
  }
  var revCards = [
    // Row 1 — flat pricing, speed, no-fluff setup
    { row: 'a', role: 'Local Electrician', suburb: 'Richmond, VIC', qt: "Finally, an agency that doesn't speak in tech jargon. Had a clean site live in days without paying a five-grand deposit." },
    { row: 'a', role: 'Roof Tiler', suburb: 'Frankston, VIC', qt: "No lock-in contracts and unlimited updates completely changed the game for us. Best decision we've made this year." },
    { row: 'a', role: 'Commercial Cleaner', suburb: 'Box Hill, VIC', qt: "Paid the small setup fee, filled out a quick form, and they took care of the rest. Absolute legends to deal with." },
    { row: 'a', role: 'Landscaper', suburb: 'Werribee, VIC', qt: "Most web guys drag things out for months. These guys had our business completely set up online in just over a week." },
    { row: 'a', role: 'Mobile Mechanic', suburb: 'Brunswick, VIC', qt: "Love the flat monthly rate. No random invoices or hourly fees hitting my inbox whenever I need a quick text change." },
    { row: 'a', role: 'Earthmoving Contractor', suburb: 'Moorabbin, VIC', qt: "Straight up, honest pricing with zero hidden extras. Exactly what small businesses actually need online." },
    { row: 'a', role: 'Boutique Fitness Studio', suburb: 'Sunbury, VIC', qt: "We needed a fast, technical build without the agency markup. Delivered exactly what was promised on day one." },
    { row: 'a', role: 'Local Cafe Owner', suburb: 'Dandenong, VIC', qt: "Cancelled our old corporate contract and switched. Save heaps of cash every month and the layout looks twice as good." },
    { row: 'a', role: 'Independent Plumber', suburb: 'Essendon, VIC', qt: "Dead simple process from start to finish. They built the foundation perfectly while I stayed focused on running the business." },
    { row: 'a', role: 'Tree Surgeon', suburb: 'Ringwood, VIC', qt: "An absolute breath of fresh air. No slick sales talk, just a solid website that loads incredibly fast on mobile." },
    { row: 'a', role: 'Cabinet Maker', suburb: 'Geelong, VIC', qt: "The unlimited updates feature is unmatched. Sent over our new service rates and it was updated the same afternoon." },
    { row: 'a', role: 'Concrete Contractor', suburb: 'Sunshine, VIC', qt: "They handled the hosting, the security settings, and the setup without trying to upsell me on features I don't need." },
    { row: 'a', role: 'Local Locksmith', suburb: 'Preston, VIC', qt: "No drama, no queues, and no corporate fluff. Just a straightforward monthly plan that keeps our business visible." },
    { row: 'a', role: 'Painting Service', suburb: 'Camberwell, VIC', qt: "Genuinely cage-free setup. Being able to cancel with short notice gives you complete peace of mind as a business owner." },
    { row: 'a', role: 'Excavation Expert', suburb: 'Cranbourne, VIC', qt: "They did more for our brand in ten days than our previous digital agency managed to do over an entire six-month contract." },
    // Row 2 — trust, local bookings, Google profile syncing
    { row: 'b', role: 'Tiler & Waterproofer', suburb: 'St Kilda, VIC', qt: "It finally pulls all our scattered social profiles and Google reviews together into one central business headquarters." },
    { row: 'b', role: 'Split System Installer', suburb: 'Epping, VIC', qt: "Our local business travels around a lot, and this setup finally gives us a proper digital presence beyond just social media." },
    { row: 'b', role: 'Rendering Specialist', suburb: 'Coburg, VIC', qt: "They sync our site directly with our local listings so our business actually rings whenever customers search for our trade." },
    { row: 'b', role: 'Handyman Services', suburb: 'Narre Warren, VIC', qt: "Customers keep telling us how easy it was to find our number and trust our work. It pays for itself every single month." },
    { row: 'b', role: 'Fencing Contractor', suburb: 'Craigieburn, VIC', qt: "Weaponized our existing five-star reviews and brought them straight to the front page where new locals can see them." },
    { row: 'b', role: 'Bricklayer', suburb: 'Glen Waverley, VIC', qt: "Makes it dead simple for local clients to find our services, trust our team, and call us up straight away for quotes." },
    { row: 'b', role: 'Residential Builder', suburb: 'Melton, VIC', qt: "Our business profile used to be completely invisible on search engines. Now we have a highly technical foundation that works." },
    { row: 'b', role: 'Plastering Contractor', suburb: 'Thornbury, VIC', qt: "Perfect layout for tradies. It shows our past work clearly and lets people instantly connect to our messaging apps." },
    { row: 'b', role: 'Gas Fitter', suburb: 'Berwick, VIC', qt: "Stop trying to build your own template on weekends. Let these guys handle the code so you can get back on the tools." },
    { row: 'b', role: 'Carpet Cleaner', suburb: 'Malvern, VIC', qt: "The technical SEO build is incredibly healthy. Site speed is blazing fast and ticks every single box Google looks for." },
    { row: 'b', role: 'Mobile Detailer', suburb: 'Footscray, VIC', qt: "Brings our scattered Facebook photos and local reviews under one roof. Makes us look like the top choice in our region." },
    { row: 'b', role: 'Concreter', suburb: 'Point Cook, VIC', qt: "The ultimate conversion engine for local jobs. It turns our online traffic into actual phone calls and booked quotes." },
    { row: 'b', role: 'Solar Installer', suburb: 'Doncaster, VIC', qt: "An essential foundation for getting found by locals. Solid performance metrics and flawless viewing on mobile devices." },
    { row: 'b', role: 'Glazier & Window Repair', suburb: 'Cheltenham, VIC', qt: "Our website now acts like a 24/7 sales representative, handling the trust building while we are busy working on site." },
    { row: 'b', role: 'Test & Tag Technician', suburb: 'Mornington, VIC', qt: "Having a fast-loading, professional hub has completely separated our brand from the cheap backyard operators." }
  ];
  function buildRevCard(d) {
    var el = document.createElement('div');
    el.className = 'htc htc-quote';
    var av = randomAvatar();
    el.innerHTML = '<div class="htc-google">' + revGoogleSvg + '</div>' +
      '<div class="htc-head"><div class="htc-avatar" style="background:' + av.color + '">' + av.letter + '</div>' +
      '<div><div class="htc-nm">' + d.role + '</div><div class="htc-rl">' + d.suburb + '</div></div></div>' +
      '<div class="htc-stars">★★★★★</div><div class="htc-qt">"' + d.qt + '"</div>';
    return el;
  }
  var revA = document.getElementById('revTmA');
  var revB = document.getElementById('revTmB');
  if (revA || revB) {
    var setRevA = revCards.filter(function (d) { return d.row === 'a'; });
    var setRevB = revCards.filter(function (d) { return d.row === 'b'; });
    [].concat(setRevA, setRevA).forEach(function (d) { if (revA) revA.appendChild(buildRevCard(d)); });
    [].concat(setRevB, setRevB).forEach(function (d) { if (revB) revB.appendChild(buildRevCard(d)); });

    if (!reduce) {
      var revSpA = 0.5, revSpB = 0.32, revXA = 0, revXB = 0;
      (function animRevTm() {
        revXA -= revSpA; revXB -= revSpB;
        if (revA) { var mA = revA.scrollWidth / 2; if (Math.abs(revXA) >= mA) revXA = 0; revA.style.transform = 'translateX(' + revXA + 'px)'; }
        if (revB) { var mB = revB.scrollWidth / 2; if (Math.abs(revXB) >= mB) revXB = 0; revB.style.transform = 'translateX(' + revXB + 'px)'; }
        requestAnimationFrame(animRevTm);
      })();
    }
  }

  /* ── STICKY MOBILE CTA BAR (G4) ───────────── */
  var sticky = document.getElementById('stickyCta');
  var hero = document.querySelector('.hero');
  var finalBand = document.getElementById('final-cta');
  var footer = document.getElementById('site-footer');
  if (sticky && hero) {
    var onScroll = function () {
      var pastHero = window.scrollY > (hero.offsetTop + hero.offsetHeight - 120);
      var band = finalBand || document.getElementById('final-cta');
      var foot = footer || document.getElementById('site-footer');
      var atEnd = false;
      var checkEl = band || foot;
      if (checkEl) {
        var top = checkEl.getBoundingClientRect().top;
        if (top < window.innerHeight) atEnd = true;
      }
      if (pastHero && !atEnd) {
        sticky.classList.add('show');
        sticky.setAttribute('aria-hidden', 'false');
      } else {
        sticky.classList.remove('show');
        sticky.setAttribute('aria-hidden', 'true');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }
})();
