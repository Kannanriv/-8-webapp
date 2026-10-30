/* #8 — application gateway. Reads ?app=<slug> and presents that product's entry point.
   When an application ships, set `url` in products.js to its address and flip LIVE below. */
(function () {
  'use strict';

  // Slugs whose applications are live. Signing in for these redirects to the app.
  var LIVE = {};

  var all = (window.HASH8_PRODUCTS || []).concat([window.HASH8_AEP]);
  var slug = new URLSearchParams(location.search).get('app') || 'aep';
  var p = all.filter(function (x) { return x.slug === slug; })[0] || window.HASH8_AEP;

  document.title = p.name.split(' — ')[0] + ' · #8';

  var card = document.getElementById('gateCard');
  card.style.setProperty('--c', 'var(--' + p.color + ')');
  var live = !!LIVE[p.slug];

  card.innerHTML =
    '<div class="gate__no"><span class="dot dot--' + p.color + '"></span>' + (p.no === '∞' ? 'Platform' : p.no + ' / 08') + '</div>' +
    '<h1 class="gate__title">' + p.name + '</h1>' +
    '<p class="gate__short">' + p.short + '</p>' +
    '<p class="gate__lede">' + p.lede + '</p>' +
    '<ul class="gate__features">' + p.features.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
    '<div class="gate__status"><span class="dot ' + (live ? 'dot--ion' : 'dot--ember') + '"></span>' +
      (live ? '<span><b>Live.</b> Sign in with your #8 account.</span>'
            : '<span><b>Opening soon.</b> Early-access customers get the console first.</span>') + '</div>' +
    '<div class="gate__actions">' +
      '<a class="btn btn--light gate__signin" href="' + (live ? LIVE[p.slug] : '#') + '"' + (live ? '' : ' aria-disabled="true" tabindex="-1"') + '>Sign in to ' + p.name.split(' — ')[0] + '</a>' +
      (live ? '' :
      '<form class="gate__form" id="gateForm" novalidate>' +
        '<label class="sr-only" for="gateEmail">Work email</label>' +
        '<input id="gateEmail" type="email" placeholder="you@company.com" autocomplete="email" required>' +
        '<button class="btn" type="submit">Request early access</button>' +
        '<p class="gate__msg" id="gateMsg" role="status"></p>' +
      '</form>') +
    '</div>';

  document.getElementById('gateList').innerHTML = all.map(function (x) {
    return '<li><a href="app.html?app=' + x.slug + '"' + (x.slug === p.slug ? ' aria-current="page"' : '') + '><i>' + x.no + '</i>' + x.name.split(' — ')[0] + '</a></li>';
  }).join('');

  var form = document.getElementById('gateForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('gateEmail'), msg = document.getElementById('gateMsg');
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    msg.classList.toggle('is-error', !ok);
    if (!ok) { msg.textContent = 'Enter a work email like name@company.com.'; input.focus(); return; }
    msg.textContent = 'You’re in. We’ll email you when ' + p.name.split(' — ')[0] + ' opens for your team.';
    input.value = '';
  });

  var c = document.getElementById('gateCanvas');
  if (c && window.HASH8_LOOP) window.HASH8_LOOP(c, { vertical: true, cx: 0.5, cy: 0.5, scale: 0.42, density: 0.6, nodes: true });
})();
