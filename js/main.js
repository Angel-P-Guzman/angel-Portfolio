/* ─────────────────────────────────────────────────────────────
   main.js – nav toggle + Matter.js hero physics + card routing
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

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    }
  });
})();

// ── Active nav link ─────────────────────────────────────────────
(function () {
  const path  = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(function (link) {
    const href = link.getAttribute('href').split('/').pop();
    if (href === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// ── Matter.js hero physics ─────────────────────────────────────
(function () {
  const canvas = document.getElementById('physics-canvas');
  if (!canvas || typeof Matter === 'undefined') return;

  const { Engine, Render, Runner, Bodies, Body, World, Mouse, MouseConstraint, Events } = Matter;

  const engine = Engine.create({ gravity: { x: 0, y: 0.35 } });
  const world  = engine.world;

  const W = canvas.offsetWidth  || window.innerWidth;
  const H = canvas.offsetHeight || window.innerHeight;

  const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width:             W,
      height:            H,
      background:        'transparent',
      wireframes:        false,
      pixelRatio:        window.devicePixelRatio || 1,
    }
  });

  // ── Boundaries ──────────────────────────────────────────────
  const thick = 60;
  const walls = [
    Bodies.rectangle(W / 2, H + thick / 2, W * 2, thick, { isStatic: true, render: { fillStyle: 'transparent' } }),
    Bodies.rectangle(-thick / 2, H / 2, thick, H * 3, { isStatic: true, render: { fillStyle: 'transparent' } }),
    Bodies.rectangle(W + thick / 2, H / 2, thick, H * 3, { isStatic: true, render: { fillStyle: 'transparent' } }),
  ];
  World.add(world, walls);

  // ── Palette & shapes ────────────────────────────────────────
  const COLORS = [
    'rgba(77,166,255,0.55)',
    'rgba(13,99,201,0.45)',
    'rgba(56,217,169,0.35)',
    'rgba(240,147,251,0.3)',
    'rgba(247,183,49,0.3)',
    'rgba(26,127,232,0.5)',
  ];

  const LABELS = [
    'Python', 'Docker', 'Django', 'Linux', 'C++',
    'Flask', 'IoT', 'Node.js', 'Redis', 'GCP',
    'ESP32', 'REST', 'Git', 'Nginx', 'TCP/IP',
  ];

  const bodies = [];

  for (let i = 0; i < 28; i++) {
    const x     = Math.random() * W;
    const y     = Math.random() * -H;
    const color = COLORS[i % COLORS.length];
    const type  = i % 4;
    let   body;

    if (type === 0) {
      // Circle
      const r = 16 + Math.random() * 22;
      body = Bodies.circle(x, y, r, {
        restitution: 0.55,
        friction: 0.01,
        frictionAir: 0.008,
        render: { fillStyle: color, strokeStyle: 'rgba(77,166,255,0.3)', lineWidth: 1 }
      });
    } else if (type === 1) {
      // Rectangle
      const w = 40 + Math.random() * 40;
      const h = 14 + Math.random() * 14;
      body = Bodies.rectangle(x, y, w, h, {
        restitution: 0.45,
        friction: 0.02,
        frictionAir: 0.01,
        chamfer: { radius: 5 },
        render: { fillStyle: color, strokeStyle: 'rgba(77,166,255,0.2)', lineWidth: 1 }
      });
    } else if (type === 2) {
      // Polygon (hexagon)
      const r = 14 + Math.random() * 14;
      body = Bodies.polygon(x, y, 6, r, {
        restitution: 0.5,
        friction: 0.01,
        frictionAir: 0.009,
        render: { fillStyle: color, strokeStyle: 'rgba(77,166,255,0.25)', lineWidth: 1 }
      });
    } else {
      // Small diamond
      const s = 18 + Math.random() * 16;
      body = Bodies.polygon(x, y, 4, s, {
        restitution: 0.6,
        friction: 0.01,
        frictionAir: 0.007,
        render: { fillStyle: color, strokeStyle: 'rgba(240,147,251,0.3)', lineWidth: 1 }
      });
    }

    // random initial spin
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
    body.label = LABELS[i % LABELS.length];
    bodies.push(body);
  }

  World.add(world, bodies);

  // ── Mouse interaction (gentle repel on move) ─────────────────
  const mouse = Mouse.create(render.canvas);
  const mc    = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.08,
      render: { visible: false }
    }
  });
  World.add(world, mc);
  render.mouse = mouse;

  // ── Render tech labels on canvas ────────────────────────────
  Events.on(render, 'afterRender', function () {
    const ctx = render.context;
    bodies.forEach(function (body) {
      if (!body.label) return;
      const pos = body.position;
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(body.angle);
      ctx.font = '600 9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(220,238,255,0.75)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(body.label, 0, 0);
      ctx.restore();
    });
  });

  // ── Responsive resize ────────────────────────────────────────
  function resizeCanvas() {
    const nW = canvas.offsetWidth;
    const nH = canvas.offsetHeight;
    render.options.width  = nW;
    render.options.height = nH;
    render.canvas.width   = nW * (window.devicePixelRatio || 1);
    render.canvas.height  = nH * (window.devicePixelRatio || 1);
    render.canvas.style.width  = nW + 'px';
    render.canvas.style.height = nH + 'px';
    // reposition floor wall
    Body.setPosition(walls[0], { x: nW / 2, y: nH + thick / 2 });
    Body.setPosition(walls[2], { x: nW + thick / 2, y: nH / 2 });
  }
  window.addEventListener('resize', resizeCanvas);

  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner, engine);
})();
