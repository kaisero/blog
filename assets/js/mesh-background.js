/* Policy-mesh background — framework-free, no dependencies.
 *
 *   <div class="dh-mesh" data-mesh-bg data-mask="band"></div>
 *
 * Injects a DPR-correct <canvas> that fills the host and animates a grid of
 * policy nodes with a sweep crossing it — every node the sweep touches lights
 * and decays.
 *
 * The sweep enters from the RIGHT, runs inward, and fades out shortly after it
 * passes the centre; it never reaches the left edge, which is where the reading
 * column sits. Between passes the field rests dark.
 *
 * Attributes
 *   data-mask   top | radial | band | left | none   (default: band)
 *   data-dim    overall ink multiplier, 0–1         (default: 1)
 *
 * Ink is read from CSS custom properties on the host so it follows the light
 * and dark appearances — see custom.css §18. Honours prefers-reduced-motion by
 * painting one static frame.
 */
(function () {
  'use strict';

  var MASKS = {
    top: 'linear-gradient(180deg, #000 0%, #000 22%, transparent 58%)',
    radial: 'radial-gradient(58% 46% at 20% 34%, #000 0%, rgba(0,0,0,.55) 42%, transparent 78%)',
    band: 'linear-gradient(180deg, transparent 16%, #000 34%, #000 60%, transparent 80%)',
    left: 'linear-gradient(90deg, #000 0%, #000 18%, transparent 52%)',
    none: null
  };

  /* travel, then rest, then travel again */
  var RUN = 8200;    /* ms the sweep takes to cross */
  var REST = 2600;   /* ms of dark between passes */

  var scenes = [];
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ink(host, name, fallback) {
    var v = getComputedStyle(host).getPropertyValue(name).trim();
    return v || fallback;
  }

  function fit(sc) {
    var r = sc.canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    sc.w = Math.max(1, r.width);
    sc.h = Math.max(1, r.height);
    sc.canvas.width = Math.round(sc.w * dpr);
    sc.canvas.height = Math.round(sc.h * dpr);
    sc.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(sc, t) {
    var ctx = sc.ctx, w = sc.w, h = sc.h, dim = sc.dim;
    var A = sc.a, B = sc.b;
    var step = 44;
    var cols = Math.ceil(w / step) + 1;
    var rows = Math.ceil(h / step) + 1;
    var i, j, x, y;

    ctx.clearRect(0, 0, w, h);

    /* the resting grid */
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(' + A + ',' + (0.07 * dim).toFixed(3) + ')';
    ctx.beginPath();
    for (i = 0; i < cols; i++) { x = i * step + 22; ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (j = 0; j < rows; j++) { y = j * step + 20; ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    /* right → inward, dying just past centre */
    var startX = w + 140;
    var endX = w * 0.30;
    var p = (t % (RUN + REST)) / RUN;
    var live = p <= 1;
    var sweep = startX - (startX - endX) * p;
    /* in over the first fifth, out over the last two fifths — so it is already
       dissolving by the time it reaches the middle of the page */
    var fade = live ? Math.min(1, p * 5) * Math.min(1, (1 - p) * 2.4) : 0;

    if (fade > 0.001) {
      /* trail sits behind the head, which now means to its right */
      var grad = ctx.createLinearGradient(sweep + 150, 0, sweep, 0);
      grad.addColorStop(0, 'rgba(' + A + ',0)');
      grad.addColorStop(1, 'rgba(' + A + ',' + (0.13 * dim * fade).toFixed(3) + ')');
      ctx.fillStyle = grad;
      ctx.fillRect(sweep, 0, 150, h);

      ctx.strokeStyle = 'rgba(' + B + ',' + (0.5 * dim * fade).toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(sweep, 0); ctx.lineTo(sweep, h);
      ctx.stroke();
    }

    for (i = 0; i < cols; i++) {
      x = i * step + 22;
      var lit = fade * Math.max(0, 1 - Math.abs(x - sweep) / 78);
      for (j = 0; j < rows; j++) {
        y = j * step + 20;
        var jitter = ((i * 7 + j * 13) % 5) / 5;
        var l = lit * (0.55 + jitter * 0.45);
        ctx.beginPath();
        ctx.arc(x, y, 1.1 + l * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + A + ',' + ((0.13 + l * 0.8) * dim).toFixed(3) + ')';
        ctx.fill();
      }
    }
  }

  function paintAll(t) {
    for (var i = 0; i < scenes.length; i++) draw(scenes[i], t + scenes[i].phase);
  }

  function init() {
    /* No host in the markup? Make one. This is what lets the whole feature ride
       on a single <script> tag from a head partial, with no theme template
       forked to add a wrapper element. */
    if (!document.querySelector('[data-mesh-bg]')) {
      var tag = document.querySelector('script[data-mesh-auto]');
      if (tag) {
        var host = document.createElement('div');
        host.className = 'dh-mesh';
        host.setAttribute('data-mesh-bg', '');
        host.setAttribute('data-mask', tag.getAttribute('data-mesh-auto') || 'band');
        host.setAttribute('aria-hidden', 'true');
        document.body.appendChild(host);
      }
    }

    var hosts = document.querySelectorAll('[data-mesh-bg]');
    if (!hosts.length) return;

    Array.prototype.forEach.call(hosts, function (host, idx) {
      var canvas = document.createElement('canvas');
      var mask = MASKS[host.getAttribute('data-mask') || 'band'];

      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;';
      if (mask) { canvas.style.maskImage = mask; canvas.style.webkitMaskImage = mask; }
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      host.insertBefore(canvas, host.firstChild);

      scenes.push({
        canvas: canvas,
        ctx: canvas.getContext('2d'),
        dim: parseFloat(host.getAttribute('data-dim') || ink(host, '--dh-mesh-dim', '1')),
        a: ink(host, '--dh-mesh-ink', '0,192,232'),
        b: ink(host, '--dh-mesh-line', '86,214,244'),
        phase: idx * 2600,
        w: 0, h: 0
      });
      fit(scenes[scenes.length - 1]);
    });

    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () {
        scenes.forEach(fit);
        if (reduced) paintAll(3000);
      });
      scenes.forEach(function (sc) { ro.observe(sc.canvas); });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        scenes.forEach(fit);
        if (reduced) paintAll(3000);
      });
    }

    /* the appearance switch changes the ink under us */
    if (window.MutationObserver) {
      new MutationObserver(function () {
        scenes.forEach(function (sc) {
          var host = sc.canvas.parentNode;
          sc.a = ink(host, '--dh-mesh-ink', '0,192,232');
          sc.b = ink(host, '--dh-mesh-line', '86,214,244');
          sc.dim = parseFloat(host.getAttribute('data-dim') || ink(host, '--dh-mesh-dim', '1'));
        });
        if (reduced) paintAll(3000);
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    if (reduced) { paintAll(3000); return; }

    var t0 = performance.now();
    (function tick(now) {
      paintAll(now - t0);
      requestAnimationFrame(tick);
    })(t0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
