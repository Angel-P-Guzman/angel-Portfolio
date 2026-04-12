/* ─────────────────────────────────────────────────────────────
   main.js – nav toggle + physics playground (pure canvas)
   ───────────────────────────────────────────────────────────── */

// ── Mobile nav toggle ──────────────────────────────────────────
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('open', !open);
  });

  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    }
  });
})();

// ── Active nav link ────────────────────────────────────────────
(function () {
  const path  = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(function (link) {
    const href = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', href === path);
  });
})();

// ── Physics playground (pure canvas, zero dependencies) ────────
(function () {
  var canvas = document.getElementById('physics-canvas');
  if (!canvas) return;

  var wrap = canvas.parentElement;
  var ctx;
  var W, H;
  var gravOn = true;
  var GY     = 0.28;   // gravity pixels/frame²

  // ── tech stack entries ─────────────────────────────────────
  var STACK = [
    { label: 'Python',  shape: 'circle',  fill: '#4da6ff' },
    { label: 'Docker',  shape: 'rect',    fill: '#0d6edc' },
    { label: 'Django',  shape: 'hex',     fill: '#38d9a9' },
    { label: 'Linux',   shape: 'diamond', fill: '#f7b731' },
    { label: 'C++',     shape: 'circle',  fill: '#f093fb' },
    { label: 'Flask',   shape: 'rect',    fill: '#5ab4ff' },
    { label: 'IoT',     shape: 'hex',     fill: '#5ae6b4' },
    { label: 'Node.js', shape: 'diamond', fill: '#4dc96e' },
    { label: 'Redis',   shape: 'circle',  fill: '#ff5a5a' },
    { label: 'GCP',     shape: 'rect',    fill: '#f7b731' },
    { label: 'ESP32',   shape: 'hex',     fill: '#38d9a9' },
    { label: 'REST',    shape: 'diamond', fill: '#b482ff' },
    { label: 'Git',     shape: 'circle',  fill: '#ff783c' },
    { label: 'Nginx',   shape: 'rect',    fill: '#1ab478' },
    { label: 'TCP/IP',  shape: 'hex',     fill: '#4da6ff' },
    { label: 'C#',      shape: 'diamond', fill: '#aa64ff' },
    { label: 'Java',    shape: 'circle',  fill: '#ffa032' },
    { label: 'Celery',  shape: 'rect',    fill: '#5ad2a0' },
    { label: 'Arduino', shape: 'hex',     fill: '#00bcbc' },
    { label: 'Bash',    shape: 'diamond', fill: '#82dc5a' },
  ];

  var CYCLE = ['#4da6ff','#f093fb','#38d9a9','#f7b731','#ff5a5a','#5ae6b4','#b482ff','#ffa032'];

  // ── body physics object ────────────────────────────────────
  // Each body: { x, y, vx, vy, angle, av, r, shape, fill, label }
  var bodies = [];
  var R = 26; // base radius

  function makeBody(item, x, y) {
    return {
      x: x, y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * -2,
      angle: Math.random() * Math.PI * 2,
      av: (Math.random() < 0.5 ? 1 : -1) * (0.004 + Math.random() * 0.006),
      r: R,
      shape: item.shape,
      fill: item.fill,
      label: item.label,
    };
  }

  // ── spawn ──────────────────────────────────────────────────
  var spawnTimers = [];
  function spawnAll() {
    spawnTimers.forEach(clearTimeout);
    spawnTimers = [];
    bodies = [];
    STACK.forEach(function (item, i) {
      spawnTimers.push(setTimeout(function () {
        var x = R + 10 + Math.random() * (W - R * 2 - 20);
        var y = -R - Math.random() * 120;
        bodies.push(makeBody(item, x, y));
      }, i * 130));
    });
  }

  // ── draw a single body ─────────────────────────────────────
  function drawBody(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle);

    var r = b.r;
    ctx.beginPath();
    if (b.shape === 'circle') {
      ctx.arc(0, 0, r, 0, Math.PI * 2);
    } else if (b.shape === 'rect') {
      var w = r * 2.6, h = r * 1.0;
      var cr = 6;
      ctx.moveTo(-w / 2 + cr, -h / 2);
      ctx.lineTo( w / 2 - cr, -h / 2);
      ctx.quadraticCurveTo( w / 2, -h / 2,  w / 2, -h / 2 + cr);
      ctx.lineTo( w / 2,  h / 2 - cr);
      ctx.quadraticCurveTo( w / 2,  h / 2,  w / 2 - cr,  h / 2);
      ctx.lineTo(-w / 2 + cr,  h / 2);
      ctx.quadraticCurveTo(-w / 2,  h / 2, -w / 2,  h / 2 - cr);
      ctx.lineTo(-w / 2, -h / 2 + cr);
      ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + cr, -h / 2);
    } else if (b.shape === 'hex') {
      for (var i = 0; i < 6; i++) {
        var a = (i / 6) * Math.PI * 2 - Math.PI / 6;
        i === 0 ? ctx.moveTo(r * Math.cos(a), r * Math.sin(a))
                : ctx.lineTo(r * Math.cos(a), r * Math.sin(a));
      }
    } else { // diamond (4-sided rotated 45°)
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.75, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r * 0.75, 0);
    }
    ctx.closePath();

    ctx.fillStyle = b.fill + 'c0';
    ctx.fill();
    ctx.strokeStyle = b.fill;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.font = 'bold 9px "JetBrains Mono",monospace';
    ctx.fillStyle = 'rgba(225,240,255,0.95)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.label, 0, 0);

    ctx.restore();
  }

  // ── AABB radius for wall collisions ───────────────────────
  function getR(b) {
    if (b.shape === 'rect') return Math.max(b.r * 2.6, b.r) * 0.55;
    return b.r;
  }

  // ── simple body-body circle collision ─────────────────────
  function collideBodies() {
    for (var i = 0; i < bodies.length; i++) {
      for (var j = i + 1; j < bodies.length; j++) {
        var a = bodies[i], b = bodies[j];
        var dx = b.x - a.x, dy = b.y - a.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var minD = getR(a) + getR(b);
        if (dist < minD && dist > 0.001) {
          var nx = dx / dist, ny = dy / dist;
          var overlap = minD - dist;
          a.x -= nx * overlap * 0.5;
          a.y -= ny * overlap * 0.5;
          b.x += nx * overlap * 0.5;
          b.y += ny * overlap * 0.5;
          var dvx = a.vx - b.vx, dvy = a.vy - b.vy;
          var dot = dvx * nx + dvy * ny;
          if (dot > 0) {
            var imp = dot * 1.05; // low restitution — soft nudge
            a.vx -= imp * nx; a.vy -= imp * ny;
            b.vx += imp * nx; b.vy += imp * ny;
            // add a little spin on collision
            // no spin changes on collision — rotation stays constant
          }
        }
      }
    }
  }

  // ── step physics ──────────────────────────────────────────
  function step() {
    bodies.forEach(function (b) {
      if (b === dragging) return;
      if (gravOn) b.vy += GY;
      b.vx *= 0.998; b.vy *= 0.998;
      b.x += b.vx; b.y += b.vy;
      b.angle += b.av; // constant rotation, never modified

      var r = getR(b);
      // floor
      if (b.y + r > H) { b.y = H - r; b.vy *= -0.5; b.vx *= 0.92; }
      // walls
      if (b.x - r < 0)  { b.x = r;  b.vx = Math.abs(b.vx) * 0.6; }
      if (b.x + r > W)  { b.x = W - r; b.vx = -Math.abs(b.vx) * 0.6; }
      // ceiling (let bodies come back down)
      if (b.y - r < -200) { b.vy = Math.abs(b.vy); }
    });
    collideBodies();
  }

  // ── drag ──────────────────────────────────────────────────
  var dragging = null;
  var prevDragX = 0, prevDragY = 0;

  function getPos(e) {
    var rect = canvas.getBoundingClientRect();
    var src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }
  function hitTest(px, py) {
    for (var i = bodies.length - 1; i >= 0; i--) {
      var b = bodies[i];
      var dx = px - b.x, dy = py - b.y;
      if (Math.sqrt(dx * dx + dy * dy) < getR(b) + 6) return b;
    }
    return null;
  }

  var downPos = null;
  canvas.addEventListener('mousedown', function (e) {
    var p = getPos(e);
    downPos = p;
    dragging = hitTest(p.x, p.y);
    if (dragging) { prevDragX = p.x; prevDragY = p.y; }
  });
  canvas.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    var p = getPos(e);
    dragging.vx = p.x - prevDragX;
    dragging.vy = p.y - prevDragY;
    dragging.x  = p.x;
    dragging.y  = p.y;
    prevDragX = p.x; prevDragY = p.y;
  });
  canvas.addEventListener('mouseup', function (e) {
    var p = getPos(e);
    if (downPos) {
      var dx = p.x - downPos.x, dy = p.y - downPos.y;
      var wasDrag = Math.sqrt(dx * dx + dy * dy) > 6;
      if (!wasDrag && dragging) {
        // click on body → cycle color
        var ci = CYCLE.indexOf(dragging.fill);
        dragging.fill = CYCLE[(ci < 0 ? 0 : ci + 1) % CYCLE.length];
      }
    }
    dragging = null;
    downPos  = null;
  });

  // ── render loop ───────────────────────────────────────────
  function loop() {
    requestAnimationFrame(loop);
    step();
    ctx.clearRect(0, 0, W, H);
    bodies.forEach(drawBody);
  }

  // ── controls ──────────────────────────────────────────────
  function initControls() {
    var gravBtn  = document.getElementById('pg-gravity');
    var shakeBtn = document.getElementById('pg-shake');
    var resetBtn = document.getElementById('pg-reset');

    if (gravBtn) {
      gravBtn.addEventListener('click', function () {
        gravOn = !gravOn;
        gravBtn.textContent = gravOn ? 'gravity on' : 'no gravity';
        gravBtn.classList.toggle('active', !gravOn);
      });
    }
    if (shakeBtn) {
      shakeBtn.addEventListener('click', function () {
        bodies.forEach(function (b) {
          b.vx += (Math.random() - 0.5) * 8;
          b.vy -= Math.random() * 10 + 4;
          b.av += (Math.random() - 0.5) * 0.2;
        });
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', spawnAll);
    }
  }

  // ── init ──────────────────────────────────────────────────
  function init() {
    W = wrap.offsetWidth;
    H = wrap.offsetHeight;
    if (!W || !H) { requestAnimationFrame(init); return; }

    canvas.width  = W;
    canvas.height = H;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx = canvas.getContext('2d');

    initControls();
    spawnAll();
    loop();

    window.addEventListener('resize', function () {
      W = wrap.offsetWidth;
      H = wrap.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
    });
  }

  requestAnimationFrame(init);
})();

// ── Playground tab switcher ────────────────────────────────────
(function () {
  var tabs   = document.querySelectorAll('.pg-tab');
  var panels = document.querySelectorAll('.playground-wrap[role="tabpanel"]');
  if (!tabs.length) return;
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(function (p) { p.hidden = true; });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      var target = document.getElementById(tab.getAttribute('aria-controls'));
      if (target) { target.hidden = false; window.dispatchEvent(new Event('resize')); }
    });
  });
})();

// ── Bubble mode ────────────────────────────────────────────────
(function () {
  var canvas = document.getElementById('bubble-canvas');
  if (!canvas) return;
  var wrap = canvas.parentElement;
  var ctx, W, H, animId;
  var bubbles = [];
  var particles = []; // pop sparks
  var rings = [];    // ripple rings
  var MAX = 60;

  var COLORS = [
    '#4da6ff','#38d9a9','#f093fb','#f7b731',
    '#ff5a5a','#5ae6b4','#b482ff','#ffa032',
    '#0d6edc','#82dc5a','#00bcbc','#ff783c',
  ];
  var SHAPES = ['circle','circle','circle','hex','diamond','circle'];

  function randColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }
  function randShape() { return SHAPES[Math.floor(Math.random() * SHAPES.length)]; }

  function makeBubble(x, y, r, vx, vy) {
    var speed = 0.3 + Math.random() * 0.5;
    var angle = Math.random() * Math.PI * 2;
    return {
      x: x, y: y, r: r,
      vx: vx !== undefined ? vx : Math.cos(angle) * speed,
      vy: vy !== undefined ? vy : Math.sin(angle) * speed,
      color: randColor(),
      shape: randShape(),
      angle: Math.random() * Math.PI * 2,
      av: (Math.random() < 0.5 ? 1 : -1) * (0.004 + Math.random() * 0.006),
      alpha: 1,
      popR: 0,       // set on pop
      dying: false,
      dyingT: 0,
    };
  }

  function spawnInitial() {
    bubbles = [];
    var count = Math.min(MAX, Math.floor(W * H / 22000));
    count = Math.max(count, 14);
    for (var i = 0; i < count; i++) {
      var r = 18 + Math.random() * 22;
      bubbles.push(makeBubble(
        r + Math.random() * (W - r * 2),
        r + Math.random() * (H - r * 2),
        r, undefined, undefined
      ));
    }
  }

  // ── draw a single bubble ───────────────────────────────────
  function drawBubble(b) {
    ctx.save();
    ctx.globalAlpha = b.alpha;
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle);

    var r = b.r;
    ctx.beginPath();
    if (b.shape === 'circle') {
      ctx.arc(0, 0, r, 0, Math.PI * 2);
    } else if (b.shape === 'hex') {
      for (var i = 0; i < 6; i++) {
        var a = (i / 6) * Math.PI * 2 - Math.PI / 6;
        i === 0 ? ctx.moveTo(r * Math.cos(a), r * Math.sin(a))
                : ctx.lineTo(r * Math.cos(a), r * Math.sin(a));
      }
    } else { // diamond
      ctx.moveTo(0, -r); ctx.lineTo(r * 0.7, 0);
      ctx.lineTo(0, r);  ctx.lineTo(-r * 0.7, 0);
    }
    ctx.closePath();

    // gradient fill for a bubble-like look
    var grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.05, 0, 0, r);
    grad.addColorStop(0, b.color + 'ff');
    grad.addColorStop(0.5, b.color + '88');
    grad.addColorStop(1, b.color + '22');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = b.color;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = b.alpha * 0.5;
    ctx.stroke();

    ctx.restore();
  }

  // ── pop: spawn children + particles + ripple ring ──────────
  function popBubble(b) {
    b.dying  = true;
    b.dyingT = 0;
    b.popR   = b.r;

    // ring ripple
    rings.push({ x: b.x, y: b.y, r: b.r * 0.8, maxR: b.r * 2.4, color: b.color, alpha: 0.9 });

    // spark particles — fly outward from the bubble edge
    var count = Math.round(6 + b.r * 0.35);
    for (var k = 0; k < count; k++) {
      var a = (k / count) * Math.PI * 2 + Math.random() * 0.4;
      var spd = 1.8 + Math.random() * 2.8;
      particles.push({
        x: b.x + Math.cos(a) * b.r * 0.6,
        y: b.y + Math.sin(a) * b.r * 0.6,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        r: 2 + Math.random() * 3,
        color: b.color,
        alpha: 1,
      });
    }

    // children
    if (b.r > 14 && bubbles.length < MAX) {
      var children = b.r > 25 ? 3 : 2;
      for (var i = 0; i < children; i++) {
        var childR = b.r * 0.52;
        if (childR < 7) continue;
        var spread = 2.8;
        var cvx = b.vx * 0.5 + (Math.random() - 0.5) * spread;
        var cvy = b.vy * 0.5 + (Math.random() - 0.5) * spread;
        bubbles.push(makeBubble(b.x, b.y, childR, cvx, cvy));
      }
    }
  }

  // ── step ──────────────────────────────────────────────────
  function step() {
    for (var i = bubbles.length - 1; i >= 0; i--) {
      var b = bubbles[i];

      if (b.dying) {
        b.dyingT++;
        // quick outward burst then gone in ~10 frames
        var t = b.dyingT / 10;
        b.r     = b.popR * (1 + 0.45 * t);
        b.alpha = Math.max(0, 1 - t * 1.1);
        if (b.dyingT >= 10) { bubbles.splice(i, 1); continue; }
      } else {
        b.vx *= 0.992; b.vy *= 0.992;   // gentle drag
        b.x += b.vx; b.y += b.vy;
        b.angle += b.av;

        // wall bounce (0.55 = lose ~45% energy each hit)
        if (b.x - b.r < 0)  { b.x = b.r;      b.vx =  Math.abs(b.vx) * 0.55; }
        if (b.x + b.r > W)  { b.x = W - b.r;  b.vx = -Math.abs(b.vx) * 0.55; }
        if (b.y - b.r < 0)  { b.y = b.r;      b.vy =  Math.abs(b.vy) * 0.55; }
        if (b.y + b.r > H)  { b.y = H - b.r;  b.vy = -Math.abs(b.vy) * 0.55; }

        // soft bubble–bubble repel (no hard collision, just a gentle push)
        for (var j = i - 1; j >= 0; j--) {
          var o = bubbles[j];
          if (o.dying) continue;
          var dx = b.x - o.x, dy = b.y - o.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var minD = b.r + o.r;
          if (dist < minD && dist > 0.1) {
            var nx = dx / dist, ny = dy / dist;
            var push = (minD - dist) * 0.04;
            b.vx += nx * push; b.vy += ny * push;
            o.vx -= nx * push; o.vy -= ny * push;
            // keep speed bounded
            var spB = Math.sqrt(b.vx*b.vx + b.vy*b.vy);
            var spO = Math.sqrt(o.vx*o.vx + o.vy*o.vy);
            if (spB > 1.5) { b.vx = b.vx/spB*1.5; b.vy = b.vy/spB*1.5; }
            if (spO > 1.5) { o.vx = o.vx/spO*1.5; o.vy = o.vy/spO*1.5; }
          }
        }
      }
    }
  }

  // ── step particles + rings ─────────────────────────────────
  function stepFx() {
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.92; p.vy *= 0.92;
      p.alpha -= 0.045;
      if (p.alpha <= 0) { particles.splice(i, 1); }
    }
    for (var j = rings.length - 1; j >= 0; j--) {
      var ring = rings[j];
      ring.r     += (ring.maxR - ring.r) * 0.18;
      ring.alpha -= 0.06;
      if (ring.alpha <= 0) { rings.splice(j, 1); }
    }
  }

  // ── render loop ───────────────────────────────────────────
  function loop() {
    animId = requestAnimationFrame(loop);
    step();
    stepFx();
    ctx.clearRect(0, 0, W, H);
    // rings behind bubbles
    rings.forEach(function (ring) {
      ctx.save();
      ctx.globalAlpha = ring.alpha;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    });
    bubbles.forEach(drawBubble);
    // sparks in front
    particles.forEach(function (p) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    });
  }

  // ── click to pop ──────────────────────────────────────────
  canvas.addEventListener('click', function (e) {
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    for (var i = bubbles.length - 1; i >= 0; i--) {
      var b = bubbles[i];
      if (b.dying) continue;
      var dx = mx - b.x, dy = my - b.y;
      if (Math.sqrt(dx*dx + dy*dy) < b.r) {
        popBubble(b);
        break;
      }
    }
  });

  // ── init ──────────────────────────────────────────────────
  function sizeCanvas() {
    W = wrap.offsetWidth;
    H = wrap.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
  }

  // Start when first made visible (tab switch fires a resize event)
  var started = false;
  window.addEventListener('resize', function () {
    if (wrap.hidden) return;
    sizeCanvas();
    if (!started) {
      started = true;
      ctx = canvas.getContext('2d');
      spawnInitial();
      loop();
    }
  });
})();
