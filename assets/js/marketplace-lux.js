/* #8 — homepage Marketplace section: the film loop and the five aisles.
   The spotlight (#show) is rendered by main.js. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MARKET = window.HASH8_MARKET || [];
  var ART = window.HASH8_ART || function () { return ''; };
  var root = $('#marketplace');
  if (!root) return;

  /* ---------------- Aisles ---------------- */
  var AISLES = [
    ['device', 'Devices', 'Sensors, trackers, meters and gateways, made by device makers and certified by #8.'],
    ['app', 'Apps & templates', 'Ready-made applications built on the AEP.'],
    ['integration', 'Integrations', 'ERP, messaging, payments and BI, connected.'],
    ['connectivity', 'Connectivity', 'IoT data plans and eSIMs from carriers.'],
    ['service', 'Services', 'Installation, design and 24×7 operations.']
  ];
  var aisles = $('#aisles');
  if (aisles && MARKET.length) {
    aisles.innerHTML = AISLES.map(function (a, i) {
      var items = MARKET.filter(function (m) { return m.type === a[0]; });
      var paid = items.filter(function (m) { return m.price > 0; });
      var low = paid.sort(function (x, y) { return x.price - y.price; })[0];
      var from = items.some(function (m) { return m.price === 0; }) ? 'Free options' : low ? 'From ' + low.priceLabel.replace(/^From /, '') : '';
      var thumbs = items.slice(0, i === 0 ? 3 : 2);
      return '<a class="aisle aisle--' + i + '" href="marketplace.html?type=' + a[0] + '#browse">' +
        '<span class="aisle__art">' + thumbs.map(function (m, k) {
          return '<span class="aisle__obj aisle__obj--' + k + '" style="--hue:' + m.hue + '">' + ART(m.kind) + '</span>';
        }).join('') + '</span>' +
        '<span class="aisle__body"><span class="aisle__n">' + String(items.length).padStart(2, '0') + ' listings · ' + from + '</span>' +
        '<b>' + a[1] + '</b><span class="aisle__d">' + a[2] + '</span></span>' +
        '<span class="aisle__go" aria-hidden="true">→</span></a>';
    }).join('');
  }

  /* ---------------- Film: silent loop, chapters, pause ---------------- */
  var video = $('#mktVideo'), play = $('#mktPlay'), film = $('#mktFilm'), chapList = $('#mktChapters');
  if (!video) return;
  // Chapter starts match the scene timings in film/market-film.html
  var CHAPTERS = [[0, 'Everything IoT'], [4.4, 'Devices'], [7, 'Apps'], [9.6, 'Connectivity'], [12.2, 'Services'], [14.9, 'One cart'], [21.4, 'Sell on #8']];
  var END = 30, userPaused = reduceMotion;

  chapList.innerHTML = CHAPTERS.map(function (c, i) {
    return '<li><button type="button" data-i="' + i + '"><b>' + c[1] + '</b></button></li>';
  }).join('');
  var btns = chapList.querySelectorAll('button');

  function sync() {
    var t = video.currentTime, d = video.duration || END;
    for (var i = 0; i < CHAPTERS.length; i++) {
      var a = CHAPTERS[i][0], b = i + 1 < CHAPTERS.length ? CHAPTERS[i + 1][0] : d;
      var p = Math.max(0, Math.min(1, (t - a) / (b - a)));
      btns[i].style.setProperty('--c', p);
      btns[i].setAttribute('aria-current', String(t >= a && t < b));
    }
    if (!video.paused) requestAnimationFrame(sync);
  }
  function setState() {
    var on = !video.paused;
    film.classList.toggle('is-playing', on);
    play.setAttribute('aria-label', on ? 'Pause the film' : 'Play the film');
    if (on) requestAnimationFrame(sync); else sync();
  }
  function tryPlay() { var p = video.play(); if (p && p.catch) p.catch(function () { setState(); }); }

  video.addEventListener('play', setState);
  video.addEventListener('pause', setState);
  video.addEventListener('seeked', sync);
  video.addEventListener('error', function () { film.hidden = true; });

  play.addEventListener('click', function () {
    if (video.paused) { userPaused = false; tryPlay(); } else { userPaused = true; video.pause(); }
  });
  chapList.addEventListener('click', function (e) {
    var b = e.target.closest('[data-i]');
    if (!b) return;
    video.currentTime = CHAPTERS[+b.dataset.i][0];
    userPaused = false; tryPlay();
  });

  // Play only while on screen, never against the viewer's choice or reduced-motion preference
  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !userPaused) tryPlay();
      else if (!e.isIntersecting) video.pause();
    });
  }, { threshold: 0.35 }).observe(film);
  setState();
})();
