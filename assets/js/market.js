/* #8 Marketplace page: search, filters, product details, cart and seller sign-up. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ITEMS = window.HASH8_MARKET || [];
  var TYPES = window.HASH8_TYPES || {};
  var PRODUCTS = window.HASH8_PRODUCTS || [];
  var ART = window.HASH8_ART;
  var CARD = window.HASH8_CARD;

  var F = { type: 'all', industry: 'all', seller: 'all', cert: false, q: '', sort: 'featured' };
  // Deep link from the homepage aisles: marketplace.html?type=device#browse
  var qType = new URLSearchParams(location.search).get('type');
  if (qType && TYPES[qType]) F.type = qType;

  function byId(id) { return ITEMS.filter(function (m) { return m.id === id; })[0]; }
  function inr(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
  function uniq(arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  $('#year').textContent = new Date().getFullYear();

  /* ---------------- Hero ---------------- */
  $('#mhStats').innerHTML =
    '<div><dt>Listings</dt><dd>' + ITEMS.length + '</dd></div>' +
    '<div><dt>Sellers</dt><dd>' + uniq(ITEMS.map(function (m) { return m.vendor; })).length + '</dd></div>' +
    '<div><dt>#8 Certified</dt><dd>' + ITEMS.filter(function (m) { return m.certified; }).length + '</dd></div>';
  $('#heroStack').innerHTML = ['coldpack', 'coldsense', 'plan100'].map(function (id, i) {
    return '<div class="mk mh__card mh__card--' + i + '">' + CARD(byId(id)) + '</div>';
  }).join('');
  $('#quick').innerHTML = ['Cold chain', 'Tracker', 'LoRaWAN', 'Installation', 'Free'].map(function (q) {
    return '<button type="button" data-q="' + q + '">' + q + '</button>';
  }).join('');
  $('#quick').addEventListener('click', function (e) {
    var b = e.target.closest('[data-q]');
    if (b) search(b.dataset.q);
  });
  $('#heroSearch').addEventListener('submit', function (e) { e.preventDefault(); search($('#heroQ').value); });
  function search(q) {
    F.q = q.trim();
    $('#q').value = F.q;
    render();
    $('#browse').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------------- Outcome kits ---------------- */
  var KITS = window.HASH8_KITS || [];
  function kitTotals(k) {
    var once = 0, monthly = 0;
    k.items.forEach(function (it) {
      var m = byId(it[0]), line = m.price * it[1];
      if (/month/.test(m.unit)) monthly += line; else once += line;
    });
    return { once: once, monthly: monthly };
  }
  $('#kitsGrid').innerHTML = KITS.map(function (k, i) {
    var t = kitTotals(k);
    return '<article class="kit" style="--hue:' + k.hue + '">' +
      '<div class="kit__top"><span class="kit__no">Kit 0' + (i + 1) + ' · ' + k.items.length + ' items</span><h3>' + k.name + '</h3><p>' + k.outcome + '</p></div>' +
      '<ul class="kit__items">' + k.items.map(function (it) {
        var m = byId(it[0]);
        return '<li><button type="button" data-open="' + m.id + '"><span class="kit__thumb" style="--hue:' + m.hue + '">' + ART(m.kind) + '</span>' +
          '<span><b>' + (it[1] > 1 ? it[1] + ' × ' : '') + m.name + '</b><small>' + m.vendor + '</small></span></button></li>';
      }).join('') + '</ul>' +
      '<div class="kit__foot"><div class="kit__price"><b>' + inr(t.once) + '</b><small>one-time</small></div>' +
        (t.monthly ? '<div class="kit__price"><b>' + inr(t.monthly) + '</b><small>per month</small></div>' : '') +
        '<button type="button" class="btn btn--light btn--sm" data-kit="' + k.id + '">Add kit</button></div>' +
    '</article>';
  }).join('');
  $('#kitsGrid').addEventListener('click', function (e) {
    var kb = e.target.closest('[data-kit]'), ob = e.target.closest('[data-open]');
    if (kb) {
      var k = KITS.filter(function (x) { return x.id === kb.dataset.kit; })[0];
      k.items.forEach(function (it) { cart[it[0]] = (cart[it[0]] || 0) + it[1]; });
      save(); renderCart();
      toast(k.name + ' added: ' + k.items.length + ' items in your cart');
      cartBtn.classList.remove('is-bump'); void cartBtn.offsetWidth; cartBtn.classList.add('is-bump');
    } else if (ob) openDetail(ob.dataset.open);
  });

  /* ---------------- Filters ---------------- */
  function matches(m, skip) {
    if (skip !== 'type' && F.type !== 'all' && m.type !== F.type) return false;
    if (skip !== 'industry' && F.industry !== 'all' && m.industry !== F.industry && m.industry !== 'All industries') return false;
    if (skip !== 'seller' && F.seller !== 'all' && m.seller !== F.seller) return false;
    if (F.cert && !m.certified) return false;
    if (F.q) {
      var hay = [m.name, m.vendor, m.industry, m.seller, TYPES[m.type], m.blurb, m.priceLabel].concat(m.tags).join(' ').toLowerCase();
      var words = F.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) < 0) return false;
    }
    return true;
  }

  function group(el, key, options) {
    el.innerHTML = options.map(function (o) {
      var count = ITEMS.filter(function (m) { return matches(m, key) && (o[0] === 'all' || m[key] === o[0] || (key === 'industry' && m.industry === 'All industries')); }).length;
      return '<button type="button" role="radio" aria-checked="' + (F[key] === o[0]) + '" data-k="' + key + '" data-v="' + esc(o[0]) + '"><span>' + o[1] + '</span><em>' + count + '</em></button>';
    }).join('');
  }

  var INDUSTRIES = uniq(ITEMS.map(function (m) { return m.industry; })).filter(function (i) { return i !== 'All industries'; }).sort();
  var SELLERS = uniq(ITEMS.map(function (m) { return m.seller; }));

  function renderFilters() {
    var PLURAL = { device: 'Devices', app: 'Apps & templates', integration: 'Integrations', connectivity: 'Connectivity', service: 'Services' };
    group($('#fType'), 'type', [['all', 'Everything']].concat(Object.keys(TYPES).map(function (k) { return [k, PLURAL[k]]; })));
    group($('#fIndustry'), 'industry', [['all', 'All industries']].concat(INDUSTRIES.map(function (i) { return [i, i]; })));
    group($('#fSeller'), 'seller', [['all', 'Anyone']].concat(SELLERS.map(function (s) { return [s, s + 's']; })));
  }

  $('.filters').addEventListener('click', function (e) {
    var b = e.target.closest('[data-k]');
    if (!b) return;
    F[b.dataset.k] = b.dataset.v;
    render();
  });
  $('#fCert').addEventListener('change', function (e) { F.cert = e.target.checked; render(); });
  $('#q').addEventListener('input', function (e) { F.q = e.target.value.trim(); render(); });
  $('#sort').addEventListener('change', function (e) { F.sort = e.target.value; render(); });
  $('#clearAll').addEventListener('click', function () {
    F = { type: 'all', industry: 'all', seller: 'all', cert: false, q: '', sort: F.sort };
    $('#q').value = ''; $('#fCert').checked = false;
    render();
  });
  $('#filtersBtn').addEventListener('click', function () {
    var open = $('.filters').classList.toggle('is-open');
    this.setAttribute('aria-expanded', String(open));
  });

  /* ---------------- Results ---------------- */
  function render() {
    renderFilters();
    var list = ITEMS.filter(function (m) { return matches(m); });
    var s = F.sort;
    if (s !== 'featured') list = list.slice().sort(function (a, b) {
      if (s === 'rating') return b.rating - a.rating;
      if (s === 'reviews') return b.reviews - a.reviews;
      if (s === 'price-asc') return a.price - b.price;
      return b.price - a.price;
    });
    $('#grid').innerHTML = list.map(function (m) {
      return '<article class="mk" id="item-' + m.id + '">' +
        '<button type="button" class="mk__open" data-open="' + m.id + '" aria-label="View ' + esc(m.name) + '"></button>' + CARD(m) +
        '<button type="button" class="mk__add" data-add="' + m.id + '" aria-label="Add ' + esc(m.name) + ' to cart">+</button></article>';
    }).join('');
    $('#empty').hidden = list.length > 0;
    $('#resultCount').textContent = list.length === ITEMS.length && !F.q
      ? 'Showing all ' + ITEMS.length + ' listings'
      : list.length + ' of ' + ITEMS.length + ' listings' + (F.q ? ' for “' + F.q + '”' : '');
  }

  $('#grid').addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add) { addToCart(add.dataset.add, 1); return; }
    var open = e.target.closest('[data-open]');
    if (open) openDetail(open.dataset.open);
  });

  /* ---------------- Detail ---------------- */
  var pd = $('#pd'), pdQty = 1, pdItem = null;
  function openDetail(id) {
    var m = byId(id);
    if (!m) return;
    pdItem = m; pdQty = 1;
    var works = m.works.map(function (slug) {
      var p = PRODUCTS.filter(function (x) { return x.slug === slug; })[0];
      return p ? '<a href="' + p.url + '">' + p.name + '</a>' : '';
    }).join('');
    $('#pdBody').innerHTML =
      '<button type="button" class="pd__close" data-close aria-label="Close">×</button>' +
      '<div class="pd__art" style="--hue:' + m.hue + '">' + ART(m.kind) + (m.certified ? '<span class="mk__cert">#8 Certified</span>' : '') + '</div>' +
      '<div class="pd__info">' +
        '<span class="mk__type">' + TYPES[m.type] + ' · ' + m.industry + '</span>' +
        '<h2 id="pdName">' + m.name + '</h2>' +
        '<p class="pd__by">by <b>' + m.vendor + '</b> · ' + m.seller + ' · <span class="mk__rate"><i aria-hidden="true">★</i> ' + m.rating.toFixed(1) + ' <small>(' + m.reviews + ' reviews)</small></span></p>' +
        '<p class="pd__blurb">' + m.blurb + '</p>' +
        '<div class="pd__tags">' + m.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
        '<div class="pd__works"><small>Works with</small><div>' + works + '</div></div>' +
        '<div class="pd__buy"><div class="pd__price"><b>' + m.priceLabel + '</b><small>' + m.unit + '</small></div>' +
          '<div class="qty" role="group" aria-label="Quantity"><button type="button" data-q="-1" aria-label="Fewer">−</button><output id="pdQty">1</output><button type="button" data-q="1" aria-label="More">+</button></div>' +
          '<button type="button" class="btn btn--signal" data-buy>Add to cart</button></div>' +
        '<a class="pd__aep" href="index.html#aep">Plan it into an outcome in the AEP</a>' +
      '</div>';
    if (!pd.open) pd.showModal();
    history.replaceState(null, '', '#item-' + id);
  }
  pd.addEventListener('click', function (e) {
    if (e.target === pd || e.target.closest('[data-close]')) { pd.close(); return; }
    var q = e.target.closest('[data-q]');
    if (q) {
      var step = pdQty >= 100 ? 10 : 1;
      pdQty = Math.max(1, pdQty + step * +q.dataset.q);
      $('#pdQty').textContent = pdQty;
    }
    if (e.target.closest('[data-buy]')) { addToCart(pdItem.id, pdQty); pd.close(); }
  });
  pd.addEventListener('close', function () { history.replaceState(null, '', location.pathname); });

  /* ---------------- Cart ---------------- */
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem('hash8-cart') || '{}') || {}; } catch (e) { cart = {}; }
  function save() { try { localStorage.setItem('hash8-cart', JSON.stringify(cart)); } catch (e) { /* storage unavailable */ } }

  function addToCart(id, qty) {
    cart[id] = (cart[id] || 0) + qty;
    save(); renderCart();
    toast('Added ' + byId(id).name + (qty > 1 ? ' × ' + qty : '') + ' to your cart');
    var btn = $('#cartBtn');
    btn.classList.remove('is-bump'); void btn.offsetWidth; btn.classList.add('is-bump');
  }

  function renderCart() {
    var ids = Object.keys(cart).filter(function (id) { return byId(id) && cart[id] > 0; });
    var count = ids.reduce(function (a, id) { return a + cart[id]; }, 0);
    $('#cartCount').textContent = count;
    var once = 0, monthly = 0, usage = false;
    ids.forEach(function (id) {
      var m = byId(id), line = m.price * cart[id];
      if (/month/.test(m.unit)) monthly += line;
      else if (/message|fees/.test(m.unit)) usage = true;
      else once += line;
    });
    $('#cartBody').innerHTML = !ids.length
      ? '<div class="cart__empty"><b>Your cart is empty.</b><p>Add devices, apps, plans or services and request one combined quote.</p></div>'
      : '<ul class="cart__list">' + ids.map(function (id) {
          var m = byId(id);
          return '<li><span class="cart__art" style="--hue:' + m.hue + '">' + ART(m.kind) + '</span>' +
            '<div><b>' + m.name + '</b><small>' + m.priceLabel + ' ' + m.unit + '</small></div>' +
            '<div class="qty qty--sm"><button type="button" data-cq="-1" data-id="' + id + '" aria-label="Fewer">−</button><output>' + cart[id] + '</output><button type="button" data-cq="1" data-id="' + id + '" aria-label="More">+</button></div></li>';
        }).join('') + '</ul>' +
        '<dl class="cart__totals">' +
          (once ? '<div><dt>One-time</dt><dd>' + inr(once) + '</dd></div>' : '') +
          (monthly ? '<div><dt>Monthly</dt><dd>' + inr(monthly) + '</dd></div>' : '') +
          (usage ? '<div><dt>Usage-based</dt><dd>Billed as used</dd></div>' : '') +
        '</dl><p class="cart__note">Prices exclude GST. Hardware ships pre-provisioned for your #8 tenant.</p>' +
        '<form class="cart__form" id="quoteForm" novalidate><label class="sr-only" for="quoteEmail">Work email</label>' +
          '<input id="quoteEmail" type="email" placeholder="you@company.com" autocomplete="email" required>' +
          '<button class="btn btn--signal" type="submit">Request a quote</button><p class="cart__msg" id="quoteMsg" role="status"></p></form>';
  }

  var cartEl = $('#cart'), scrim = $('#cartScrim'), cartBtn = $('#cartBtn');
  function setCart(open) {
    cartEl.hidden = !open; scrim.hidden = !open;
    cartBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    if (open) $('#cartClose').focus(); else cartBtn.focus();
  }
  cartBtn.addEventListener('click', function () { setCart(cartEl.hidden); });
  $('#cartClose').addEventListener('click', function () { setCart(false); });
  scrim.addEventListener('click', function () { setCart(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !cartEl.hidden) setCart(false); });
  cartEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cq]');
    if (!b) return;
    cart[b.dataset.id] = Math.max(0, cart[b.dataset.id] + +b.dataset.cq);
    if (!cart[b.dataset.id]) delete cart[b.dataset.id];
    save(); renderCart();
  });
  cartEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('#quoteEmail'), msg = $('#quoteMsg');
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    msg.classList.toggle('is-error', !ok);
    msg.textContent = ok
      ? 'Quote requested. A #8 specialist will reply within one business day.'
      : 'Enter a work email like name@company.com so we can send your quote.';
    if (!ok) input.focus();
  });

  var toastTimer;
  function toast(text) {
    var t = $('#toast');
    t.textContent = text; t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 2600);
  }

  /* ---------------- Sell ---------------- */
  var SELL = [
    { key: 'oem', name: 'Device OEMs', apply: 'a device OEM', head: 'Sell hardware that onboards itself.', item: 'coldsense',
      points: ['Certified devices appear in every matching AEP blueprint', 'Devices ship pre-provisioned to each customer’s tenant, so there are no setup calls', 'Push firmware updates through Device Management', 'See your installed base and its health across every customer'] },
    { key: 'dev', name: 'Developers', apply: 'a developer', head: 'Publish apps, templates and integrations.', item: 'coldpack',
      points: ['Build on the AEP with the same model and APIs as #8’s own products', 'Customers install your app into their tenant in one click', 'Subscriptions are billed and collected by #8', 'Usage analytics for every install'] },
    { key: 'partner', name: 'Service partners', apply: 'a service partner', head: 'Sell installation, design and operations.', item: 'install',
      points: ['Get matched to projects by city, industry and device', 'Your technicians work in the #8 Installation App', 'Jobs, sign-offs and SLAs are tracked in Ticketing', 'Ratings come only from verified customers'] },
    { key: 'carrier', name: 'Carriers', apply: 'a carrier', head: 'Sell IoT connectivity at scale.', item: 'plan100',
      points: ['Plans bought here are managed in SIM Management', 'Pooled data, caps and alerts are handled by #8', 'Customers activate and suspend from their own console', 'Usage and revenue reported in real time'] }
  ];
  var sellI = 0;
  $('#sellType').innerHTML = SELL.map(function (s, i) { return '<option value="' + s.key + '">' + s.name + '</option>'; }).join('');
  function renderSell() {
    $('#sellTabs').innerHTML = SELL.map(function (s, i) {
      return '<button type="button" role="tab" id="sell-' + s.key + '" aria-selected="' + (i === sellI) + '" tabindex="' + (i === sellI ? 0 : -1) + '" data-sell="' + i + '">' + s.name + '</button>';
    }).join('');
    var s = SELL[sellI];
    $('#sellPanel').setAttribute('aria-labelledby', 'sell-' + s.key);
    $('#sellPanel').innerHTML =
      '<div class="sell__copy"><h3>' + s.head + '</h3><ul>' + s.points.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>' +
        '<a class="btn btn--light" href="#sellForm" data-apply>Apply as ' + s.apply + '</a></div>' +
      '<div class="sell__sample"><small>Example listing</small><div class="mk">' + CARD(byId(s.item)) + '</div></div>';
  }
  $('#sellTabs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-sell]');
    if (b) { sellI = +b.dataset.sell; renderSell(); $('#sellType').value = SELL[sellI].key; }
  });
  $('#sellTabs').addEventListener('keydown', function (e) {
    var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    sellI = (sellI + d + SELL.length) % SELL.length;
    renderSell(); $('#sellType').value = SELL[sellI].key;
    $('#sellTabs [aria-selected="true"]').focus();
  });
  $('#sellPanel').addEventListener('click', function (e) {
    if (e.target.closest('[data-apply]')) $('#sellType').value = SELL[sellI].key;
  });
  $('#sellForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, msg = $('#sellMsg');
    var ok = f.company.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim());
    msg.classList.toggle('is-error', !ok);
    if (!ok) {
      msg.textContent = 'Add your company name and a work email so our partner team can reach you.';
      (f.company.value.trim() ? f.email : f.company).focus();
      return;
    }
    msg.textContent = 'Thanks, ' + f.company.value.trim() + '. Our partner team will be in touch within two business days.';
    f.reset(); $('#sellType').value = SELL[sellI].key;
  });

  /* ---------------- Start ---------------- */
  render();
  renderCart();
  renderSell();
  var deep = location.hash.match(/^#item-(.+)$/);
  if (deep && byId(deep[1])) {
    $('#browse').scrollIntoView();
    openDetail(deep[1]);
  }
})();
