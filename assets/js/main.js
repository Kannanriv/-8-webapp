/* #8 — page interactions */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PRODUCTS = window.HASH8_PRODUCTS || [];

  function onView(el, cb, opts) {
    if (!el) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { cb(e.isIntersecting, e); });
    }, opts || { threshold: 0.25 });
    io.observe(el);
  }

  /* ---------------- Nav ---------------- */
  var nav = $('#nav');
  var lastY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    var menuOpen = $('.nav__menu-btn').getAttribute('aria-expanded') === 'true' || !$('#drawer').hidden;
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !menuOpen);
    lastY = y;
  }, { passive: true });

  // Mega menu
  var megaBtn = $('.nav__menu-btn'), mega = $('#mega');
  $('#megaGrid').innerHTML = PRODUCTS.map(function (p) {
    return '<a class="mega__item" href="' + p.url + '"><i>' + p.no + '</i><b>' + p.name + '</b><span>' + p.short + '</span></a>';
  }).join('');
  function setMega(open) {
    megaBtn.setAttribute('aria-expanded', String(open));
    mega.hidden = !open;
  }
  megaBtn.addEventListener('click', function (e) { e.stopPropagation(); setMega(mega.hidden); });
  document.addEventListener('click', function (e) { if (!mega.hidden && !mega.contains(e.target)) setMega(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMega(false); setDrawer(false); } });

  // Mobile drawer
  var burger = $('.nav__burger'), drawer = $('#drawer');
  function setDrawer(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.hidden = !open;
  }
  burger.addEventListener('click', function () { setDrawer(drawer.hidden); });
  $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });

  // Footer product links
  $('#footProducts').innerHTML = PRODUCTS.map(function (p) {
    return '<li><a href="' + p.url + '">' + p.name + '</a></li>';
  }).join('');
  $('#year').textContent = new Date().getFullYear();

  /* ---------------- Hero counters ---------------- */
  function fmt(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    return Math.round(n).toLocaleString();
  }
  $$('[data-count]').forEach(function (el) {
    var target = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }
    var t0 = null, dur = 1800, delay = 900;
    function tick(now) {
      if (!t0) t0 = now + delay;
      var k = Math.max(0, Math.min(1, (now - t0) / dur));
      var e = 1 - Math.pow(1 - k, 4);
      el.textContent = fmt(target * e) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  /* ---------------- 02 The Shift ---------------- */
  var shiftStage = $('#shiftStage'), shiftSwitch = $('.shift__switch');
  $$('.shift__flow').forEach(function (ol) {
    $$('li', ol).forEach(function (li, i) { li.style.setProperty('--i', i); });
  });
  function setMode(mode) {
    shiftStage.dataset.mode = mode;
    shiftSwitch.dataset.mode = mode;
    $$('button', shiftSwitch).forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.mode === mode)); });
  }
  shiftSwitch.dataset.mode = 'ops';
  $$('button', shiftSwitch).forEach(function (b) {
    b.addEventListener('click', function () { userPickedShift = true; setMode(b.dataset.mode); });
  });
  // On first view, play data-driven first, then flip to #8 — the "aha" moment.
  var userPickedShift = false, shiftPlayed = false;
  onView($('#shift'), function (vis) {
    if (!vis) return;
    $('#shift').classList.add('in-view');
    if (shiftPlayed || reduceMotion) return;
    shiftPlayed = true;
    setMode('data');
    setTimeout(function () { if (!userPickedShift) setMode('ops'); }, 2600);
  }, { threshold: 0.35 });

  /* ---------------- 03 AEP — Outcome Studio ---------------- */
  // Each outcome maps to a complete application assembled from all eight products.
  var OUTCOMES = [
    { key: 'cold', match: /cold|temperat|fridge|freez|vaccine|pharma|food|spoil|reefer/i,
      title: 'Zero spoiled stock across our cold chain', tag: 'Cold chain', kpi: 'Target: every breach resolved in under 30 min',
      app: 'FreshTrack', devices: 'Temperature sensors & compressors', protocol: 'MQTT over TLS', assets: 'Cold rooms & reefer trucks', rules: 4, team: 'refrigeration engineers',
      cards: [['Cold Room 14', '3.6°C', 'Normal'], ['Open tickets', '0', 'All clear']], cta: 'Call engineer' },
    { key: 'meter', match: /meter|utility|utilities|electric|energy|water|gas|power|grid/i,
      title: 'Read every meter remotely and cut field visits by 90%', tag: 'Utilities', kpi: 'Target: 99% daily read rate',
      app: 'MeterOne', devices: 'Smart electricity & water meters', protocol: 'LwM2M + DLMS', assets: 'Feeders, transformers & sites', rules: 5, team: 'field crews',
      cards: [['Meters reporting', '99.2%', 'Today'], ['Field visits', '−91%', 'This month']], cta: 'Pay bill' },
    { key: 'fleet', match: /fleet|vehicle|truck|logistic|transport|driver|delivery|car/i,
      title: 'Know where every vehicle is and stop data-cost overruns', tag: 'Fleet & logistics', kpi: 'Target: 0 SIM bill surprises',
      app: 'FleetPulse', devices: 'Telematics units & fuel sensors', protocol: 'TCP binary codec', assets: 'Vehicles, trailers & depots', rules: 6, team: 'fleet controllers',
      cards: [['On the road', '128', 'of 134'], ['Data spend', '₹0.42', 'per vehicle / day']], cta: 'Track vehicle' },
    { key: 'health', match: /hospital|medical|health|patient|clinic|ventilator|infusion|care/i,
      title: 'Keep critical medical equipment ready around the clock', tag: 'Healthcare', kpi: 'Target: 99.9% equipment readiness',
      app: 'CareReady', devices: 'Infusion pumps, monitors & trackers', protocol: 'BLE gateways + HTTPS', assets: 'Wards, beds & equipment', rules: 5, team: 'biomedical engineers',
      cards: [['Ready now', '412', 'of 418 devices'], ['Service due', '6', 'This week']], cta: 'Locate equipment' },
    { key: 'factory', match: /machine|factory|manufactur|downtime|plant|motor|pump|oee|industrial/i,
      title: 'Fix machine faults before they cause downtime', tag: 'Manufacturing', kpi: 'Target: −40% unplanned downtime',
      app: 'UptimeOS', devices: 'Vibration & current sensors', protocol: 'Modbus + OPC-UA via edge', assets: 'Lines, machines & spares', rules: 5, team: 'maintenance technicians',
      cards: [['Line 3 health', '94', 'Good'], ['Faults predicted', '7', 'This week']], cta: 'Raise work order' },
    { key: 'building', match: /building|hvac|lift|elevator|office|facility|mall|hotel|campus/i,
      title: 'Keep every building system running without manual checks', tag: 'Smart buildings', kpi: 'Target: 98% systems uptime',
      app: 'BuildingSense', devices: 'HVAC, lift & energy controllers', protocol: 'BACnet + MQTT', assets: 'Floors, plant rooms & lifts', rules: 6, team: 'facility teams',
      cards: [['Systems online', '98.7%', 'All sites'], ['Energy saved', '18%', 'vs last year']], cta: 'Report an issue' },
    { key: 'farm', match: /farm|agri|crop|soil|irrigat|field|harvest|livestock/i,
      title: 'Water every field only when it needs it', tag: 'Agriculture', kpi: 'Target: −30% water use',
      app: 'AgriFlow', devices: 'Soil probes & pump controllers', protocol: 'LoRaWAN', assets: 'Fields, pumps & tanks', rules: 3, team: 'farm operators',
      cards: [['Soil moisture', '41%', 'Field B'], ['Water saved', '32%', 'This season']], cta: 'Start pump' }
  ];

  // Used when a written outcome doesn't match an industry blueprint.
  var CUSTOM = {
    key: 'custom', tag: 'Custom', app: 'MyOutcome', devices: 'Your devices', protocol: 'Auto-detected protocol',
    assets: 'Your sites & assets', rules: 4, team: 'your field team',
    cards: [['Outcome progress', '72%', 'On track'], ['Open actions', '3', 'Assigned']], cta: 'View outcome'
  };

  var MODULE_TEXT = {
    'device-management': function (o) { return o.devices + ' modelled'; },
    'sim-management': function () { return 'Pooled data plan with usage caps'; },
    'device-gateway': function (o) { return o.protocol + ' ingest and decoding'; },
    'asset-management': function (o) { return o.assets + ' linked'; },
    'iot-crm': function () { return 'Customers, contracts and SLAs'; },
    'ticketing': function (o) { return o.rules + ' outcome rules → tickets and alerts'; },
    'installation-app': function (o) { return 'Install checklist for ' + o.team; },
    'customer-apps': function (o) { return o.app + ' for iOS, Android and web'; }
  };

  var studio = $('#studio'), track = $$('#aepTrack li'), outcomeList = $('#outcomeList');
  var studioRun = 0, studioTimers = [], studioStarted = false;

  outcomeList.innerHTML = OUTCOMES.map(function (o, i) {
    return '<button type="button" class="outcome" role="radio" aria-checked="false" data-i="' + i + '"><b>' + o.title + '</b><small>' + o.tag + '</small><i></i></button>';
  }).join('');
  var outcomeBtns = $$('.outcome', outcomeList);

  $('#studioModules').innerHTML = PRODUCTS.map(function (p) {
    return '<li class="mod" data-slug="' + p.slug + '"><i></i><div><b>' + p.name + '</b><span>Waiting</span></div><em>' + p.no + '</em></li>';
  }).join('');
  var mods = $$('.mod');

  function setStudioStage(n) {
    studio.dataset.stage = n;
    track.forEach(function (li, i) {
      li.classList.toggle('is-done', i < n);
      li.classList.toggle('is-on', i === n);
    });
  }
  function later(fn, ms) { studioTimers.push(setTimeout(fn, reduceMotion ? Math.min(ms, 60) : ms)); }

  function phoneBody(o) {
    return o.cards.map(function (c) {
      return '<div class="scard"><span>' + c[0] + '</span><b>' + c[1] + '</b><em>' + c[2] + '</em></div>';
    }).join('') +
      '<div class="sbars"><span style="--h:40%"></span><span style="--h:58%"></span><span style="--h:36%"></span><span style="--h:72%"></span><span style="--h:60%"></span><span style="--h:84%"></span><span style="--h:66%"></span></div>' +
      '<div class="sbtn">' + o.cta + '</div>';
  }

  function runOutcome(o, text) {
    studioTimers.forEach(clearTimeout); studioTimers = [];
    var run = ++studioRun;
    studioStarted = true;
    $('#studioOutcome').textContent = text || o.title;
    $('#studioKpi').textContent = !text ? o.kpi
      : o === CUSTOM ? 'Custom blueprint generated' : 'Matched to the ' + o.tag.toLowerCase() + ' blueprint';
    $('#sphoneName').textContent = o.app;
    $('#sphoneBody').innerHTML = phoneBody(o);
    $('#studioUrl').textContent = 'Live at ' + o.app.toLowerCase() + '.app';
    $('#studioBar').style.setProperty('--p', 0);
    mods.forEach(function (m) { m.className = 'mod'; $('span', m).textContent = 'Waiting'; });
    setStudioStage(0);
    $('#studioStatus').textContent = 'Outcome received';

    later(function () {
      if (run !== studioRun) return;
      setStudioStage(1);
      mods.forEach(function (m, i) {
        later(function () {
          if (run !== studioRun) return;
          m.classList.add('is-building');
          $('span', m).textContent = 'Configuring…';
          $('#studioStatus').textContent = 'Building · ' + (i + 1) + ' / 8';
          later(function () {
            if (run !== studioRun) return;
            m.classList.remove('is-building'); m.classList.add('is-done');
            $('span', m).textContent = MODULE_TEXT[m.dataset.slug](o);
            $('#studioBar').style.setProperty('--p', (i + 1) / 8);
          }, 320);
        }, i * 360);
      });
      later(function () {
        if (run !== studioRun) return;
        setStudioStage(2);
        $('#studioStatus').textContent = 'Customise your app';
        later(function () { if (run === studioRun) pickSwatch(Math.max(0, OUTCOMES.indexOf(o)) % 5); }, 700);
        later(function () {
          if (run !== studioRun) return;
          setStudioStage(3);
          $('#studioStatus').textContent = 'Live';
        }, 2400);
      }, 8 * 360 + 500);
    }, 600);
  }

  var swatchBtns = $$('#swatches button');
  function pickSwatch(i) {
    swatchBtns.forEach(function (b, j) { b.setAttribute('aria-checked', String(j === i)); });
    studio.style.setProperty('--brand', swatchBtns[i].style.getPropertyValue('--s'));
  }
  swatchBtns.forEach(function (b, i) { b.addEventListener('click', function () { pickSwatch(i); }); });

  function selectOutcome(i, text) {
    outcomeBtns.forEach(function (b, j) { b.setAttribute('aria-checked', String(j === i && !text)); });
    runOutcome(i < 0 ? CUSTOM : OUTCOMES[i], text);
  }
  outcomeBtns.forEach(function (b, i) { b.addEventListener('click', function () { selectOutcome(i); }); });
  outcomeList.addEventListener('keydown', function (e) {
    var cur = outcomeBtns.indexOf(document.activeElement);
    if (cur < 0) return;
    var next = e.key === 'ArrowDown' ? cur + 1 : e.key === 'ArrowUp' ? cur - 1 : null;
    if (next === null) return;
    e.preventDefault();
    outcomeBtns[(next + outcomeBtns.length) % outcomeBtns.length].focus();
  });

  $('#outcomeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('#outcomeInput'), text = input.value.trim();
    if (!text) { input.focus(); return; }
    var idx = OUTCOMES.findIndex(function (o) { return o.match.test(text); });
    selectOutcome(idx, text.charAt(0).toUpperCase() + text.slice(1));
  });

  // Play the first outcome once, when the studio first scrolls into view.
  setStudioStage(0);
  $('#sphoneBody').innerHTML = phoneBody(OUTCOMES[0]);
  onView(studio, function (vis) {
    if (vis && !studioStarted) selectOutcome(0);
  }, { threshold: 0.35 });

  /* ---------------- 04 Product suite ---------------- */
  var list = $('#suiteList'), stage = $('#suiteStage');
  list.innerHTML = PRODUCTS.map(function (p, i) {
    return '<button class="suite__tab" role="tab" id="tab-' + p.slug + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) +
      '" style="--c:var(--' + p.color + ')" data-i="' + i + '"><i>' + p.no + '</i><b>' + p.name + '</b><small>' + p.short + '</small></button>';
  }).join('');
  var tabs = $$('.suite__tab', list);

  function miniUI(p) {
    var i;
    switch (p.ui) {
      case 'devices':
        var cells = '';
        for (i = 0; i < 60; i++) cells += '<i class="' + (i === 23 || i === 47 ? 'warn' : (Math.random() > 0.12 ? 'on' : '')) + '" style="--i:' + i + '"></i>';
        return '<div class="mini"><div class="mini__h"><span>Fleet · 48,210 devices</span><span>Firmware 4.2.1 rollout</span></div>' +
          '<div class="mini__kpis"><div><b>99.2%</b><span>online</span></div><div><b>68%</b><span>rolled out</span></div><div><b>2</b><span>auto-healed</span></div></div>' +
          '<div class="mini__grid">' + cells + '</div>' +
          '<div style="margin-top:12px" class="bar"><i style="--w:68%"></i></div></div>';
      case 'sims':
        var sims = [['Airtel', '82%', '4.1 GB'], ['Jio', '64%', '3.2 GB'], ['Vodafone', '91%', '4.6 GB'], ['eSIM pool', '37%', '1.8 GB']];
        return '<div class="mini"><div class="mini__h"><span>Connectivity · 12,880 SIMs</span><span>This month</span></div>' +
          sims.map(function (s, k) {
            return '<div class="mini__row" style="--i:' + k + ';grid-template-columns:90px 1fr auto"><span>' + s[0] + '</span><div class="bar"><i style="--w:' + s[1] + ';--i:' + k + '"></i></div><span>' + s[2] + '</span></div>';
          }).join('') +
          '<div class="mini__row" style="--i:5"><span class="dot dot--ember"></span><span>SIM 8991…4412 over cap — auto-throttled</span><span>now</span></div></div>';
      case 'gateway':
        var protos = ['MQTT', 'CoAP', 'LwM2M', 'HTTP', 'Modbus', 'TCP', 'UDP', 'LoRaWAN', 'NB-IoT', 'OPC-UA', 'BLE', 'Custom'];
        return '<div class="mini"><div class="mini__h"><span>Gateway · 1.2M sessions</span><span>p99 18 ms</span></div>' +
          '<div class="chips">' + protos.map(function (x, k) { return '<span style="--i:' + k + '">' + x + '</span>'; }).join('') + '</div>' +
          '<div class="mini__flow"><div class="box"><b>Devices</b>raw bytes</div><div class="pipe"></div><div class="box"><b>Decode</b>codec · rules</div><div class="pipe"></div><div class="box"><b>Apps</b>clean JSON</div></div></div>';
      case 'assets':
        return '<div class="mini"><div class="mini__h"><span>Assets · Chennai region</span><span>3 in geofence</span></div>' +
          '<div class="mini__map"><div class="fence"></div>' +
          '<span class="pin" style="--i:0;left:40%;top:40%"></span><span class="pin" style="--i:1;left:58%;top:62%"></span><span class="pin" style="--i:2;left:66%;top:30%"></span><span class="pin" style="--i:3;left:14%;top:70%;background:var(--ember)"></span></div>' +
          '<div class="mini__row" style="--i:0"><span class="dot dot--ion"></span><span>Reefer trailer TN-09-4471</span><span>3.2°C</span></div>' +
          '<div class="mini__row" style="--i:1"><span class="dot dot--ember"></span><span>Generator G-12 · service due</span><span>2 days</span></div></div>';
      case 'crm':
        return '<div class="mini"><div class="cust"><div class="av">FC</div><div><b>FreshCart Logistics</b><span class="muted">Enterprise · 3 sites · SLA 4h</span></div></div>' +
          '<div class="mini__kpis"><div><b>1,284</b><span>devices</span></div><div><b>99.6%</b><span>uptime</span></div><div><b>₹18.4L</b><span>ARR</span></div></div>' +
          '<div class="mini__row" style="--i:0"><span class="dot dot--signal"></span><span>Renewal in 42 days · health good</span><span>auto</span></div>' +
          '<div class="mini__row" style="--i:1"><span class="dot dot--ember"></span><span>1 open ticket · P1 · resolving</span><span>18m</span></div></div>';
      case 'tickets':
        var t = [['P1', 'Cold room 14 above 4°C', 'Assigned · Ravi K.', '03:42'], ['P2', 'Gateway G-221 offline', 'Auto-restart queued', '11:08'], ['P3', 'Low battery · 14 sensors', 'Batched for Thursday', '2d']];
        return '<div class="mini"><div class="mini__h"><span>Tickets · auto-created from events</span><span>SLA</span></div>' +
          t.map(function (x, k) {
            return '<div class="ticket" style="--i:' + k + '"><span class="p ' + (k === 2 ? 'p3' : '') + '">' + x[0] + '</span><div>' + x[1] + '<small>' + x[2] + '</small></div><span class="sla">' + x[3] + '</span></div>';
          }).join('') +
          '<div class="channels"><span class="on">WhatsApp</span><span class="on">SMS</span><span>Email</span><span class="on">Push</span><span>Voice</span></div></div>';
      case 'install':
        return '<div class="mini"><div class="mini__phone"><div class="scan"></div>' +
          '<div class="step" style="--i:0">Device scanned · IMEI bound</div>' +
          '<div class="step" style="--i:1">SIM activated</div>' +
          '<div class="step" style="--i:2">Photos & GPS captured</div>' +
          '<div class="step" style="--i:3">Live signal −71 dBm ✓</div>' +
          '<div class="step todo" style="--i:4">Customer sign-off</div></div></div>';
      case 'customer':
        return '<div class="mini" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:center">' +
          '<div class="mini__phone" style="width:100%"><b style="font-size:14px">YourBrand</b>' +
          '<div class="step" style="--i:0">Pump 2 · running</div><div class="step" style="--i:1">Tank 78% full</div><div class="step todo" style="--i:2">Pay invoice ₹2,400</div></div>' +
          '<div><div class="chips"><span style="--i:0">Your logo</span><span style="--i:1">Your domain</span><span style="--i:2">Your colours</span><span style="--i:3">iOS</span><span style="--i:4">Android</span><span style="--i:5">Web</span></div>' +
          '<p class="muted" style="font-size:12px;margin-top:12px">Generated from your AEP model. Published under your name.</p></div></div>';
    }
    return '';
  }

  function renderStage(i, focus) {
    var p = PRODUCTS[i];
    tabs.forEach(function (t, j) {
      t.setAttribute('aria-selected', String(j === i));
      t.tabIndex = j === i ? 0 : -1;
    });
    stage.style.setProperty('--c', 'var(--' + p.color + ')');
    stage.dataset.color = p.color;
    stage.setAttribute('aria-labelledby', 'tab-' + p.slug);
    stage.innerHTML =
      '<div><div class="stage__no">' + p.no + ' / 08</div><h3 class="stage__title">' + p.name + '</h3><p class="stage__short">' + p.short + '</p></div>' +
      '<p class="stage__lede">' + p.lede + '</p>' +
      '<div class="stage__split"><ul class="stage__features">' + p.features.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' + miniUI(p) + '</div>' +
      '<div class="stage__with"><small>Hands work to</small>' + p.worksWith.map(function (slug) {
        var k = PRODUCTS.findIndex(function (x) { return x.slug === slug; });
        return '<button type="button" data-goto="' + k + '">' + PRODUCTS[k].name + '</button>';
      }).join('') + '</div>' +
      '<div class="stage__foot"><a class="btn btn--signal" href="' + p.url + '">Open ' + p.name + '</a><a class="btn btn--ghost" href="#contact">See it on your devices</a></div>';
    stage.classList.remove('is-swapping');
    void stage.offsetWidth;
    stage.classList.add('is-swapping');
    if (focus) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { renderStage(i); });
  });
  stage.addEventListener('click', function (e) {
    var b = e.target.closest('[data-goto]');
    if (b) renderStage(+b.dataset.goto, true);
  });
  list.addEventListener('keydown', function (e) {
    var cur = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
    var next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (cur + 1) % tabs.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (cur - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next !== null) { e.preventDefault(); renderStage(next, true); }
  });
  renderStage(0);

  // Deep link: index.html#product-<slug>
  var hashMatch = location.hash.match(/^#product-(.+)$/);
  if (hashMatch) {
    var idx = PRODUCTS.findIndex(function (p) { return p.slug === hashMatch[1]; });
    if (idx > -1) { renderStage(idx); $('#products').scrollIntoView(); }
  }

  /* ---------------- Ecosystem: one event travels through all eight ---------------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var SHORT = ['Devices', 'SIMs', 'Gateway', 'Assets', 'IoT CRM', 'Ticketing', 'Installation', 'Customer apps'];
  var STORY = [
    [6, 'A technician installs a sensor in Cold Room 14 and certifies it on site.'],
    [1, 'Its SIM switches on, on the right data plan, with no portal or phone call.'],
    [2, 'Readings stream in through the gateway, decoded and secured at the edge.'],
    [0, 'The sensor joins the fleet, gets a health score and the latest firmware.'],
    [3, 'At 2:14 AM the room passes 4°C, and the cold room’s full history is already linked.'],
    [5, 'A P1 ticket opens and the nearest on-call engineer is dispatched.'],
    [4, 'The customer’s contract, SLA clock and service history update on their own.'],
    [7, 'The customer watches it get fixed, live, in their own branded app.']
  ];
  var ecoSvg = $('#ecoSvg'), ecoNodes = [], ecoTrails = [], ecoPulse, ecoPts = [];
  var ecoStep = 0, ecoT0 = 0, ecoActive = false, ecoNarrow = null;
  var STEP_MS = 3400, TRAVEL_MS = 900;

  function el(name, attrs, parent) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function buildEco() {
    var narrow = window.innerWidth < 760;
    if (narrow === ecoNarrow) return;
    ecoNarrow = narrow;
    var W = narrow ? 600 : 1000, H = narrow ? 860 : 500;
    var cx = W / 2, cy = H / 2, rx = narrow ? 190 : 375, ry = narrow ? 340 : 190;
    var pw = narrow ? 200 : 204, ph = narrow ? 56 : 48, fs = narrow ? 22 : 15;
    ecoSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    ecoSvg.innerHTML = '';
    var defs = el('defs', {}, ecoSvg);
    var lg = el('linearGradient', { id: 'ecoGrad', x1: '0', x2: '1' }, defs);
    el('stop', { offset: '0', 'stop-color': '#5B7CFF' }, lg);
    el('stop', { offset: '1', 'stop-color': '#5EE6C8' }, lg);

    ecoPts = PRODUCTS.map(function (_, i) {
      var a = (-90 + i * 45) * Math.PI / 180;
      return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
    });
    var gMesh = el('g', {}, ecoSvg);
    for (var i = 0; i < 8; i++) for (var j = i + 1; j < 8; j++) {
      el('line', { class: 'eco__mesh', x1: ecoPts[i][0], y1: ecoPts[i][1], x2: ecoPts[j][0], y2: ecoPts[j][1] }, gMesh);
    }
    ecoPts.forEach(function (p) { el('line', { class: 'eco__spoke', x1: cx, y1: cy, x2: p[0], y2: p[1] }, gMesh); });

    ecoTrails = STORY.map(function (s, k) {
      var a = ecoPts[s[0]], b = ecoPts[STORY[(k + 1) % STORY.length][0]];
      return el('line', { class: 'eco__trail', x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, ecoSvg);
    });

    var core = el('g', { class: 'eco__core' }, ecoSvg);
    var cr = narrow ? 74 : 64;
    el('circle', { class: 'ring', cx: cx, cy: cy, r: cr }, core);
    el('circle', { cx: cx, cy: cy, r: cr }, core);
    var logo = el('svg', { x: cx - 26, y: cy - 34, width: 52, height: 44, viewBox: '0 0 96 82', fill: '#F4F2EE', color: '#F4F2EE' }, core);
    el('use', { href: '#logo' }, logo);
    var ct = el('text', { x: cx, y: cy + 30, 'font-size': narrow ? 18 : 13 }, core);
    ct.textContent = 'AEP core';

    // The pulse travels beneath the nodes so it never covers a label
    ecoPulse = el('circle', { class: 'eco__pulse', r: narrow ? 8 : 6, cx: ecoPts[STORY[0][0]][0], cy: ecoPts[STORY[0][0]][1] }, ecoSvg);

    ecoNodes = PRODUCTS.map(function (p, i) {
      var g = el('g', { class: 'eco__node', tabindex: '0', role: 'button', 'aria-label': 'Explore ' + p.name }, ecoSvg);
      var x = ecoPts[i][0] - pw / 2, y = ecoPts[i][1] - ph / 2;
      el('rect', { x: x, y: y, width: pw, height: ph, rx: ph / 2 }, g);
      var no = el('text', { class: 'eco__no', x: x + 18, y: ecoPts[i][1] + fs * 0.36, 'font-size': fs * 0.8 }, g);
      no.textContent = p.no;
      var t = el('text', { x: x + 18 + fs * 1.6, y: ecoPts[i][1] + fs * 0.36, 'font-size': fs }, g);
      t.textContent = narrow ? SHORT[i] : (p.name.length > 20 ? SHORT[i] : p.name);
      function go() { renderStage(i); $('#suiteStage').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }); }
      g.addEventListener('click', go);
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      return g;
    });
    showEcoStep(ecoStep);
  }

  function showEcoStep(k) {
    var idx = STORY[k][0];
    ecoNodes.forEach(function (n, i) {
      n.classList.toggle('is-on', i === idx);
      n.classList.toggle('was-on', STORY.slice(0, k).some(function (s) { return s[0] === i; }));
    });
    ecoTrails.forEach(function (t, i) { t.classList.toggle('is-on', i < k); });
    $('#ecoStep').textContent = (k + 1) + ' / 8';
    var cap = $('#ecoCaption');
    cap.textContent = STORY[k][1];
    cap.style.animation = 'none'; void cap.offsetWidth; cap.style.animation = '';
  }

  function ecoFrame(now) {
    if (!ecoActive) return;
    if (!ecoT0) ecoT0 = now;
    var el2 = now - ecoT0;
    if (el2 >= STEP_MS) {
      ecoStep = (ecoStep + 1) % STORY.length;
      ecoT0 = now; el2 = 0;
      showEcoStep(ecoStep);
    }
    // travel from previous node into the current one, then rest there
    var prev = ecoPts[STORY[(ecoStep - 1 + STORY.length) % STORY.length][0]], cur = ecoPts[STORY[ecoStep][0]];
    var k = ecoStep === 0 ? 1 : Math.min(1, el2 / TRAVEL_MS);
    var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    ecoPulse.setAttribute('cx', prev[0] + (cur[0] - prev[0]) * e);
    ecoPulse.setAttribute('cy', prev[1] + (cur[1] - prev[1]) * e);
    requestAnimationFrame(ecoFrame);
  }

  buildEco();
  window.addEventListener('resize', buildEco);
  onView($('#eco'), function (vis) {
    if (vis && !ecoActive) { ecoActive = true; ecoT0 = 0; requestAnimationFrame(ecoFrame); }
    else if (!vis) ecoActive = false;
  }, { threshold: 0.3 });
  if (reduceMotion) STEP_MS = 5000;

  /* ---------------- 05 The Loop ---------------- */
  var STATIONS = [
    ['Install', 'Installation App'],
    ['Connect', 'Gateway · SIM'],
    ['Monitor', 'Device Management'],
    ['Detect', 'Asset Management'],
    ['Act', 'Ticketing'],
    ['Resolve', 'Remote commands'],
    ['Engage', 'CRM · Customer apps'],
    ['Learn', 'AEP insights']
  ];
  var CX = 320, CY = 170, AX = 255, AY = 125;
  function lem(t) { var s = Math.sin(t); return [CX + AX * s, CY + AY * s * Math.cos(t)]; }
  var d = '';
  for (var k = 0; k <= 240; k++) {
    var pt = lem((k / 240) * Math.PI * 2);
    d += (k ? 'L' : 'M') + pt[0].toFixed(1) + ' ' + pt[1].toFixed(1);
  }
  d += 'Z';
  $('#loopPath').setAttribute('d', d);
  $('#loopPathGlow').setAttribute('d', d);

  // Order stations so the pulse visits them in sequence along the curve
  var stationT = STATIONS.map(function (_, i) { return Math.PI / 8 + i * Math.PI / 4; });
  var svgNS = 'http://www.w3.org/2000/svg';
  var gSt = $('#loopStations');
  STATIONS.forEach(function (s, i) {
    var t = stationT[i], p = lem(t);
    var lobeX = p[0] > CX ? CX + AX * 0.6 : CX - AX * 0.6;
    var vx = p[0] - lobeX, vy = p[1] - CY, vl = Math.hypot(vx, vy) || 1;
    var lx = p[0] + (vx / vl) * 34, ly = p[1] + (vy / vl) * 30 + 4;
    var g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'station');
    var c = document.createElementNS(svgNS, 'circle');
    c.setAttribute('cx', p[0]); c.setAttribute('cy', p[1]); c.setAttribute('r', 7);
    var tx = document.createElementNS(svgNS, 'text');
    tx.setAttribute('x', lx); tx.setAttribute('y', ly);
    tx.setAttribute('text-anchor', Math.abs(vx / vl) < 0.35 ? 'middle' : (vx > 0 ? 'start' : 'end'));
    tx.textContent = s[0];
    g.appendChild(c); g.appendChild(tx); gSt.appendChild(g);
  });
  $('#loopLegend').innerHTML = STATIONS.map(function (s, i) {
    return '<li><i>' + (i + 1) + '</i>' + s[0] + '<small>' + s[1] + '</small></li>';
  }).join('');
  var stationEls = $$('.station', gSt), legendEls = $$('#loopLegend li');
  var pulse = $('#loopPulse');

  var loopT = 0, loopActive = false, loopLast = 0;
  function loopFrame(now) {
    var dt = loopLast ? Math.min(now - loopLast, 50) : 16;
    loopLast = now;
    loopT = (loopT + dt * 0.00042) % (Math.PI * 2);
    drawLoop();
    if (loopActive) requestAnimationFrame(loopFrame);
  }
  function drawLoop() {
    var p = lem(loopT);
    pulse.setAttribute('cx', p[0]); pulse.setAttribute('cy', p[1]);
    var active = Math.floor(((loopT - Math.PI / 8 + Math.PI * 2 + 0.25) % (Math.PI * 2)) / (Math.PI / 4)) % 8;
    stationEls.forEach(function (el, i) { el.classList.toggle('is-on', i === active); });
    legendEls.forEach(function (el, i) { el.classList.toggle('is-on', i === active); });
  }
  loopT = Math.PI / 8;
  drawLoop();
  if (!reduceMotion) {
    onView($('#loop'), function (vis) {
      if (vis && !loopActive) { loopActive = true; loopLast = 0; requestAnimationFrame(loopFrame); }
      else if (!vis) loopActive = false;
    }, { threshold: 0.1 });
  }

  /* ---------------- 06 Live Ops ---------------- */
  // Abstract dot-matrix world from rough continental ellipses
  var LAND = [
    [170, 130, 95, 60], [230, 95, 55, 30], [215, 260, 45, 80], [395, 120, 40, 30], [420, 230, 55, 85],
    [530, 120, 120, 55], [560, 200, 40, 40], [640, 230, 40, 25], [670, 300, 45, 30], [300, 60, 30, 18], [470, 175, 30, 25]
  ];
  var CITIES = [
    [560, 205, 'Chennai'], [545, 175, 'Mumbai'], [575, 165, 'Delhi'], [420, 120, 'Frankfurt'], [385, 110, 'London'],
    [180, 145, 'Chicago'], [140, 160, 'San Jose'], [655, 225, 'Singapore'], [690, 300, 'Sydney'], [470, 185, 'Dubai'],
    [230, 270, 'São Paulo'], [440, 270, 'Nairobi'], [690, 140, 'Tokyo']
  ];
  var map = $('#opsMap'), mapHTML = '';
  for (var gx = 8; gx < 800; gx += 11) {
    for (var gy = 8; gy < 400; gy += 11) {
      for (var l = 0; l < LAND.length; l++) {
        var L = LAND[l], ex = (gx - L[0]) / L[2], ey = (gy - L[1]) / L[3];
        if (ex * ex + ey * ey < 1) { mapHTML += '<circle class="land" cx="' + gx + '" cy="' + gy + '" r="2"/>'; break; }
      }
    }
  }
  CITIES.forEach(function (c) { mapHTML += '<circle class="node" cx="' + c[0] + '" cy="' + c[1] + '" r="3.5"/>'; });
  map.innerHTML = mapHTML;

  function ripple(city, color) {
    var c = document.createElementNS(svgNS, 'circle');
    c.setAttribute('class', 'ripple'); c.setAttribute('cx', city[0]); c.setAttribute('cy', city[1]); c.setAttribute('r', 4);
    c.setAttribute('stroke', color);
    map.appendChild(c);
    setTimeout(function () { c.remove(); }, 2700);
  }
  function arc(a, b, color) {
    var mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - Math.abs(a[0] - b[0]) * 0.25 - 20;
    var p = document.createElementNS(svgNS, 'path');
    p.setAttribute('class', 'arc'); p.setAttribute('stroke', color);
    p.setAttribute('d', 'M' + a[0] + ' ' + a[1] + ' Q' + mx + ' ' + my + ' ' + b[0] + ' ' + b[1]);
    map.appendChild(p);
    setTimeout(function () { p.remove(); }, 3200);
  }

  var EVENTS = [
    ['ember', 'Temperature breach → P1 ticket', 'Cold room 14 · technician dispatched', 0],
    ['ion', 'Firmware 4.2.1 rolled to 2,400 meters', 'Zero failures · next wave scheduled', 2],
    ['signal', '312 devices onboarded', 'Installation App · all signal checks passed', 1],
    ['ember', 'SIM over data cap', 'Throttled automatically · customer notified', 9],
    ['ion', 'Gateway G-221 self-healed', 'Restarted remotely in 11 s', 3],
    ['signal', 'Customer app published', 'AquaTrack · iOS, Android, web', 5],
    ['ember', 'Asset left geofence', 'Trailer TN-09-4471 · security alerted', 7],
    ['ion', 'Ticket #48213 resolved', '41 min · SLA met · CRM updated', 0],
    ['signal', 'Pump P-07 vibration rising', 'Maintenance work order created', 11],
    ['ion', 'Renewal flagged healthy', 'FreshCart · 99.6% uptime this quarter', 4],
    ['ember', 'Lift L3 door fault', 'Building ops notified · ETA 18 min', 12],
    ['signal', 'New tenant launched on AEP', 'Smart metering · 40k devices', 6]
  ];
  var COLORS = { ember: '#FF8A4C', ion: '#5EE6C8', signal: '#5B7CFF' };
  var feed = $('#opsFeed'), evI = 0, opsTimer = null;
  function pushEvent() {
    var ev = EVENTS[evI++ % EVENTS.length];
    var city = CITIES[ev[3]];
    var now = new Date();
    var li = document.createElement('li');
    li.className = 'feed__item';
    li.innerHTML = '<span class="dot dot--' + ev[0] + '"></span><div><b>' + ev[1] + '</b><span>' + ev[2] + ' · ' + city[2] + '</span></div><time>' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '</time>';
    feed.insertBefore(li, feed.firstChild);
    while (feed.children.length > 7) feed.lastChild.remove();
    if (!reduceMotion) {
      ripple(city, COLORS[ev[0]]);
      arc(city, CITIES[(ev[3] + 3) % CITIES.length], COLORS[ev[0]]);
    }
  }
  for (var e0 = 0; e0 < 4; e0++) pushEvent();
  onView($('#ops'), function (vis) {
    clearInterval(opsTimer);
    if (vis) opsTimer = setInterval(pushEvent, reduceMotion ? 5000 : 2200);
  }, { threshold: 0.15 });

  /* ---------------- 07 Industries rail: drag to scroll ---------------- */
  var rail = $('#rail');
  if (window.matchMedia('(pointer: fine)').matches) {
    var dragging = false, startX = 0, startLeft = 0, moved = 0;
    rail.addEventListener('pointerdown', function (e) {
      dragging = true; moved = 0; startX = e.clientX; startLeft = rail.scrollLeft;
    });
    rail.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      moved = e.clientX - startX;
      // Only take over once it's clearly a drag, so clicks on cards still work
      if (Math.abs(moved) > 6 && !rail.classList.contains('is-dragging')) {
        rail.classList.add('is-dragging'); rail.setPointerCapture(e.pointerId);
      }
      if (rail.classList.contains('is-dragging')) rail.scrollLeft = startLeft - moved;
    });
    function endDrag() { dragging = false; setTimeout(function () { rail.classList.remove('is-dragging'); }, 0); }
    rail.addEventListener('pointerup', endDrag);
    rail.addEventListener('pointercancel', endDrag);
    rail.addEventListener('click', function (e) { if (rail.classList.contains('is-dragging')) e.preventDefault(); }, true);
  }
  rail.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { rail.scrollBy({ left: 360, behavior: 'smooth' }); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { rail.scrollBy({ left: -360, behavior: 'smooth' }); e.preventDefault(); }
  });

  /* ---------------- 09 Lead form ---------------- */
  $('#leadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('#email'), msg = $('#leadMsg');
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    msg.classList.toggle('is-error', !ok);
    if (!ok) { msg.textContent = 'Enter a work email like name@company.com so we can reach you.'; input.focus(); return; }
    msg.textContent = 'You’re on the list. We’ll reach out within one business day to set up your live demo.';
    input.value = '';
  });
})();
