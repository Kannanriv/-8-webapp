/* #8 — particle "8" engine.
   Thousands of "things" flow along a figure-eight. Device nodes drift in
   from the edges and connect into the loop. The cursor bends the flow. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Brand gradient stops along the loop: Signal → Ion → Ember → Signal
  var STOPS = [
    [91, 124, 255],
    [94, 230, 200],
    [255, 138, 76],
    [91, 124, 255]
  ];

  function colorAt(u) {
    u = ((u % 1) + 1) % 1;
    var seg = u * (STOPS.length - 1);
    var i = Math.floor(seg), f = seg - i;
    var a = STOPS[i], b = STOPS[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }

  function createLoop(canvas, opts) {
    var ctx = canvas.getContext('2d');
    var o = Object.assign({
      vertical: true,      // a "8" (true) or "∞" (false)
      cx: 0.76, cy: 0.46,  // centre as fraction of canvas
      scale: 0.4,          // lobe size as fraction of min(w,h)
      density: 1,
      nodes: true,
      spin: true
    }, opts || {});

    var w = 0, h = 0, dpr = 1, A = 0, cx = 0, cy = 0;
    var particles = [], nodes = [];
    var mouse = { x: -9999, y: -9999, active: false };
    var running = false, raf = 0, rot = 0, last = 0;

    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var narrow = w < 760;
      cx = w * (narrow ? 0.5 : o.cx);
      cy = h * (narrow ? 0.42 : o.cy);
      A = Math.min(w, h) * (narrow ? o.scale * 1.05 : o.scale);
      seed(narrow);
    }

    function seed(narrow) {
      var count = Math.round(Math.min(2600, (w * h) / 520) * o.density * (narrow ? 0.6 : 1));
      particles = new Array(count);
      for (var i = 0; i < count; i++) {
        var spread = Math.pow(Math.random(), 2.2); // most particles hug the line
        particles[i] = {
          t: Math.random() * Math.PI * 2,
          v: (0.0016 + Math.random() * 0.0028) * (Math.random() < 0.08 ? 2.4 : 1),
          off: (Math.random() - 0.5) * 2 * spread * A * 0.22,
          z: (Math.random() - 0.5) * spread * A * 0.35,
          s: Math.random() < 0.04 ? 2.6 : 0.9 + Math.random() * 1.3,
          dx: 0, dy: 0
        };
      }
      nodes = [];
      if (!o.nodes) return;
      var nc = narrow ? 10 : 22;
      for (var j = 0; j < nc; j++) nodes.push(newNode(true));
    }

    function newNode(anywhere) {
      var ang = Math.random() * Math.PI * 2;
      var rad = A * (1.6 + Math.random() * 1.8);
      return {
        x: cx + Math.cos(ang) * rad * (anywhere ? Math.random() * 0.6 + 0.6 : 1),
        y: cy + Math.sin(ang) * rad * 0.8,
        t: Math.random() * Math.PI * 2,
        life: anywhere ? Math.random() : 0,
        speed: 0.0015 + Math.random() * 0.002,
        hue: Math.random()
      };
    }

    // Figure-eight: vertical "8" uses x = A·sin(2t)/2·k, y = A·sin(t)
    function curve(t) {
      var s = Math.sin(t), c = Math.cos(t);
      if (o.vertical) {
        // tangent for normal offset
        var x = A * 0.62 * s * c, y = -A * s * 1.0;
        var tx = A * 0.62 * Math.cos(2 * t), ty = -A * c;
        return [x, y, tx, ty];
      }
      var X = A * 1.25 * s, Y = A * 0.55 * s * c;
      return [X, Y, A * 1.25 * c, A * 0.55 * Math.cos(2 * t)];
    }

    function frame(now) {
      var dt = last ? Math.min((now - last) / 16.67, 3) : 1;
      last = now;
      if (o.spin && !reduceMotion) rot += 0.0035 * dt;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      var cosR = Math.cos(rot), sinR = Math.sin(rot) * 0.35;
      var mx = mouse.x, my = mouse.y, mr = Math.max(90, A * 0.45), mr2 = mr * mr;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (!reduceMotion) p.t += p.v * dt;
        var k = curve(p.t);
        var len = Math.hypot(k[2], k[3]) || 1;
        var nx = -k[3] / len, ny = k[2] / len;
        var bx = k[0] + nx * p.off, by = k[1] + ny * p.off;
        // gentle 3D rotation around the vertical axis
        var x3 = bx * cosR + p.z * sinR;
        var depth = 1 + (p.z * cosR - bx * sinR) / (A * 4);
        var px = cx + x3 * depth, py = cy + by * depth;

        // cursor repulsion with spring-back
        if (mouse.active) {
          var ddx = px + p.dx - mx, ddy = py + p.dy - my, d2 = ddx * ddx + ddy * ddy;
          if (d2 < mr2) {
            var f = (1 - d2 / mr2) * 2.2;
            var d = Math.sqrt(d2) || 1;
            p.dx += (ddx / d) * f * dt; p.dy += (ddy / d) * f * dt;
          }
        }
        p.dx *= 0.93; p.dy *= 0.93;
        px += p.dx; py += p.dy;

        var col = colorAt(p.t / (Math.PI * 2));
        var alpha = 0.35 + 0.65 * (1 - Math.min(1, Math.abs(p.off) / (A * 0.22))) * depth;
        ctx.fillStyle = 'rgba(' + (col[0] | 0) + ',' + (col[1] | 0) + ',' + (col[2] | 0) + ',' + alpha.toFixed(3) + ')';
        var sz = p.s * depth;
        ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      }

      // Device nodes: drift toward the loop, link in, then respawn
      if (nodes.length) {
        ctx.globalCompositeOperation = 'source-over';
        for (var n = 0; n < nodes.length; n++) {
          var nd = nodes[n];
          if (!reduceMotion) { nd.life += nd.speed * dt; nd.t += 0.002 * dt; }
          if (nd.life > 1) { nodes[n] = newNode(false); continue; }
          var target = curve(nd.t);
          var tx = cx + target[0] * cosR, ty = cy + target[1];
          var fade = Math.sin(Math.min(nd.life, 1) * Math.PI);
          var linkA = Math.max(0, (nd.life - 0.25) / 0.5);
          var ccol = colorAt(nd.hue);
          var rgb = (ccol[0] | 0) + ',' + (ccol[1] | 0) + ',' + (ccol[2] | 0);

          if (linkA > 0) {
            var lx = nd.x + (tx - nd.x) * Math.min(linkA, 1);
            var ly = nd.y + (ty - nd.y) * Math.min(linkA, 1);
            var g = ctx.createLinearGradient(nd.x, nd.y, lx, ly);
            g.addColorStop(0, 'rgba(' + rgb + ',' + (0.55 * fade).toFixed(3) + ')');
            g.addColorStop(1, 'rgba(' + rgb + ',0)');
            ctx.strokeStyle = g;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(nd.x, nd.y); ctx.lineTo(lx, ly); ctx.stroke();
          }
          ctx.fillStyle = 'rgba(' + rgb + ',' + (0.9 * fade).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(nd.x, nd.y, 2.4, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.35 * fade).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(nd.x, nd.y, 6 + 4 * Math.sin(nd.life * 12), 0, Math.PI * 2); ctx.stroke();
        }
      }

      if (running && !reduceMotion) raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true; last = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    resize();
    var ro = new ResizeObserver(function () { resize(); if (reduceMotion || !running) frame(performance.now()); });
    ro.observe(canvas);

    var host = canvas.parentElement;
    if (window.matchMedia('(pointer: fine)').matches) {
      host.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
      });
      host.addEventListener('pointerleave', function () { mouse.active = false; });
    }

    if (reduceMotion) { frame(performance.now()); return; }

    var onScreen = false;
    var io = new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      onScreen && !document.hidden ? start() : stop();
    }, { threshold: 0 });
    io.observe(canvas);
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : onScreen && start();
    });
  }

  window.HASH8_LOOP = createLoop;

  var hero = document.getElementById('heroCanvas');
  if (hero) createLoop(hero, { vertical: true });

  var fin = document.getElementById('finalCanvas');
  if (fin) createLoop(fin, { vertical: false, cx: 0.5, cy: 0.5, scale: 0.42, density: 0.55, nodes: false, spin: false });
})();
