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
