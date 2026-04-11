/* ─────────────────────────────────────────────────────────────
   network.js – ambient floating node network
   Runs on every canvas.net-canvas found on the page.
   No interaction, no dependencies — pure canvas 2D.
   ───────────────────────────────────────────────────────────── */
(function () {
  var canvases = document.querySelectorAll('canvas.net-canvas');
  if (!canvases.length) return;
  canvases.forEach(function (canvas) { runNetwork(canvas); });

  function runNetwork(canvas) {
    var ctx = canvas.getContext('2d');
    var W, H, nodes, rafId;

    var NODE_COUNT = 38;
    var LINK_DIST  = 130;
    var SPEED      = 0.22;
    var COLORS = [
      'rgba(77,166,255,',
      'rgba(26,127,232,',
      'rgba(56,217,169,',
      'rgba(13,99,201,',
    ];

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * (window.devicePixelRatio || 1);
      canvas.height = H * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }

    function makeNode() {
      return {
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r:  1.5 + Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.3 + Math.random() * 0.4,
      };
    }

    function init() {
      resize();
      nodes = [];
      for (var i = 0; i < NODE_COUNT; i++) nodes.push(makeNode());
      loop();
    }

    function loop() {
      rafId = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.vx *= 0.998;
        n.vy *= 0.998;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20)    n.x = W + 20;
        if (n.x > W + 20) n.x = -20;
        if (n.y < -20)    n.y = H + 20;
        if (n.y > H + 20) n.y = -20;
      }

      // Draw connections
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d  = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(77,166,255,' + ((1 - d / LINK_DIST) * 0.15) + ')';
            ctx.lineWidth = 0.7;
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

    window.addEventListener('resize', function () {
      cancelAnimationFrame(rafId);
      resize();
      loop();
    });

    init();
  }
})();
