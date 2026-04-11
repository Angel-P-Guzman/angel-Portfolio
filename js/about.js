/* ─────────────────────────────────────────────────────────────
   about.js – soft floating network for the about page hero
   Nodes drift gently; nearby nodes draw connection lines.
   Mouse gently repels nodes. Pause/resume toggle supported.
   ───────────────────────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('about-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const toggle = document.getElementById('physics-toggle');
  const iconP  = document.getElementById('toggle-icon-pause');
  const iconPl = document.getElementById('toggle-icon-play');

  let W, H, nodes, mouse, paused, rafId;
  const NODE_COUNT    = 42;
  const LINK_DIST     = 140;
  const REPEL_RADIUS  = 110;
  const REPEL_FORCE   = 0.012;
  const SPEED         = 0.28;

  // Blue palette matching the site tokens
  const COLORS = [
    'rgba(77,166,255,',
    'rgba(26,127,232,',
    'rgba(56,217,169,',
    'rgba(13,99,201,',
    'rgba(240,147,251,',
  ];

  mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W * (window.devicePixelRatio || 1);
    canvas.height = H * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  function makeNode() {
    var color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  2 + Math.random() * 2.5,
      color: color,
      alpha: 0.4 + Math.random() * 0.45,
    };
  }

  function init() {
    resize();
    nodes = [];
    for (var i = 0; i < NODE_COUNT; i++) nodes.push(makeNode());
    paused = false;
    if (rafId) cancelAnimationFrame(rafId);
    loop();
  }

  function loop() {
    if (paused) return;
    rafId = requestAnimationFrame(loop);
    ctx.clearRect(0, 0, W, H);

    // Update positions
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];

      // Gentle mouse repel
      var dx = n.x - mouse.x;
      var dy = n.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_RADIUS && dist > 0) {
        var force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
        n.vx += (dx / dist) * force;
        n.vy += (dy / dist) * force;
      }

      // Speed cap
      var speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (speed > SPEED * 2.5) {
        n.vx = (n.vx / speed) * SPEED * 2.5;
        n.vy = (n.vy / speed) * SPEED * 2.5;
      }

      // Slight drag to stop infinite acceleration
      n.vx *= 0.995;
      n.vy *= 0.995;

      n.x += n.vx;
      n.y += n.vy;

      // Wrap edges
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
    }

    // Draw connections
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i];
        var b = nodes[j];
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          var opacity = (1 - d / LINK_DIST) * 0.22;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(77,166,255,' + opacity + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.color + n.alpha + ')';
      ctx.fill();
    }
  }

  // Mouse tracking (canvas-relative)
  canvas.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Pause / resume toggle
  if (toggle) {
    toggle.addEventListener('click', function () {
      paused = !paused;
      iconP.style.display  = paused ? 'none'  : '';
      iconPl.style.display = paused ? ''       : 'none';
      toggle.setAttribute('aria-label', paused ? 'Resume background animation' : 'Pause background animation');
      if (!paused) loop();
    });
  }

  // Resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 120);
  });

  // Start
  init();
})();
