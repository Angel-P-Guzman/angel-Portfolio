/* ─────────────────────────────────────────────────────────────
   projects.js – filter bar + detail modal for projects page
   ───────────────────────────────────────────────────────────── */

// ── Project data ───────────────────────────────────────────────
const PROJECTS = {
  capy: {
    tag:   'Backend · Cloud · Automation',
    title: 'CapyTechnologies – Automation Platform',
    date:  'May 2025 – Present',
    desc:  'Backend automation platform for social media content. Built an Instagram story automation feature that onboarded and supported 100+ beta users, with asynchronous task processing via Celery and Docker-based deployment on Google Cloud.',
    bullets: [
      'Architected Instagram story automation with Django + Celery for async task queues',
      'Containerised services with Docker; deployed on Google Cloud Platform',
      'Supported 100+ beta test users with automated story posting',
      'Designed RESTful APIs for frontend integration and third-party services',
      'Implemented robust error handling and retry logic for resilient API interactions',
    ],
    stack: ['Django', 'Python', 'Celery', 'Docker', 'Google Cloud', 'PostgreSQL', 'Redis', 'REST APIs'],
    links: [],
  },

  distributed: {
    tag:   'Distributed Systems · DevOps',
    title: 'Distributed Flask + Redis System',
    date:  '2025',
    desc:  'Dockerised multi-container distributed application separating API and state layers using Flask and Redis. Designed with fault-tolerant REST endpoints and a comprehensive integration test suite.',
    bullets: [
      'Built multi-container app using Docker Compose with separated API and state layers',
      'Designed REST endpoints with 503-on-service-failure fault-tolerant handling',
      'Implemented integration test layers covering availability, API correctness, and state consistency',
      'Simulated Redis downtime and network failures to validate system resilience',
      'Demonstrated understanding of container networking and service communication',
    ],
    stack: ['Python', 'Flask', 'Redis', 'Docker', 'Docker Compose', 'Integration Testing'],
    links: [],
  },

  zachsherm: {
    tag:   'Web · Linux · DevOps',
    title: 'zachsherm.quest – Production Website',
    date:  '2024 – 2025',
    desc:  'Deployed and maintained a production website on a Linux VPS with custom domain, HTTPS, and containerised services. Responsible for the full stack — from server setup to DNS and SSL configuration.',
    bullets: [
      'Deployed Django application on a Linux VPS with custom domain and HTTPS',
      'Configured Nginx reverse proxy and containerised services using Docker',
      'Secured with Cloudflare DNS + SSL protection',
      'Managed live server debugging, maintenance, and updates in a Linux environment',
    ],
    stack: ['Django', 'Docker', 'Nginx', 'Linux', 'Cloudflare', 'VPS'],
    links: [{ label: 'Visit Site ↗', url: 'https://zachsherm.quest' }],
  },

  airquality: {
    tag:   'IoT · Embedded · Hardware',
    title: 'Wireless Classroom Air Quality Monitor',
    date:  'December 2024',
    desc:  'Led development of a wireless CO₂, temperature, and humidity monitoring system for university classrooms. Includes a real-time Flask dashboard and SMS threshold alerts via Twilio, piloted in a live classroom setting.',
    bullets: [
      'Designed IoT sensor system using Arduino and Raspberry Pi for real-time monitoring',
      'Integrated CO₂, temperature, and humidity sensors with data aggregation and processing',
      'Built Flask-based web dashboard for real-time data visualisation and historical trends',
      'Implemented Twilio SMS alert system for threshold-based notifications to building managers',
      'Successfully piloted in university classroom, improving student awareness of air quality',
    ],
    stack: ['Arduino', 'Flask', 'Raspberry Pi', 'Twilio', 'Python', 'SQLite', 'JavaScript'],
    links: [{ label: 'GitHub ↗', url: 'https://github.com/Angel-P-Guzman/Air-quality-Monitor' }],
  },

  digimon: {
    tag:   'Embedded · C++ · Hardware',
    title: 'Digimon ESP32 Virtual Pet',
    date:  'June – September 2025',
    desc:  'Tamagotchi-style virtual pet running on an ESP32 microcontroller with a small display. Features a full state machine for pet health, custom pixel sprites, and physical button input handling — all within tight memory and CPU constraints.',
    bullets: [
      'Developed embedded UI system with state management on the ESP32 microcontroller',
      'Designed custom pixel sprites and animation system for the OLED/TFT display',
      'Implemented full pet life cycle: feeding, cleaning, playing, sleeping, and aging',
      'Handled hardware-level button debouncing and input routing',
      'Worked within tight heap and stack constraints on bare-metal C++',
    ],
    stack: ['C++', 'ESP32', 'PlatformIO'],
    links: [{ label: 'GitHub ↗', url: 'https://github.com/Angel-P-Guzman/digimon-esp32-vpet' }],
  },

  ytd: {
    tag:   'Desktop App · Python',
    title: 'ytd-Downloader-GUI',
    date:  'June 2025',
    desc:  'Cross-platform desktop GUI application for downloading video and audio with automated cloud uploads. Ships as a single executable via PyInstaller for Windows, macOS, and Linux.',
    bullets: [
      'Built GUI with Python Tkinter for intuitive video/audio downloading workflow',
      'Integrated yt-dlp for high-quality extraction from multiple platforms',
      'Implemented automatic Discord API cloud upload for convenient file storage',
      'Packaged with PyInstaller for single-file cross-platform distribution',
      'Added format selection, quality options, batch downloading, and progress tracking',
    ],
    stack: ['Python', 'Tkinter', 'PyInstaller', 'Discord API', 'yt-dlp', 'Threading'],
    links: [],
  },

  aztec: {
    tag:   'Hackathon · Web · Scraping',
    title: 'Aztec Connect – Club Scraper',
    date:  'April 2025 · SDSU Hackathon',
    desc:  'Web scraper and Django app built at the SDSU Hackathon to improve discoverability of SDSU\'s 200+ student clubs. Lets students find clubs that match their interests through search and interest-based filtering.',
    bullets: [
      'Designed and built a web scraper to index 200+ SDSU student clubs',
      'Created Django web app with search and interest-based filtering',
      'Built and shipped the full project within the 24-hour hackathon window',
    ],
    stack: ['Django', 'Python', 'Web Scraping', 'HTML', 'CSS'],
    links: [],
  },
};

// ── Modal ──────────────────────────────────────────────────────
(function () {
  const modal      = document.getElementById('proj-modal');
  const panel      = modal ? modal.querySelector('.proj-modal-panel') : null;
  const backdrop   = modal ? modal.querySelector('.proj-modal-backdrop') : null;
  const closeBtn   = modal ? modal.querySelector('.proj-modal-close') : null;
  const modalBody  = document.getElementById('modal-body');
  let   lastFocus  = null;

  if (!modal) return;

  function open(id) {
    const data = PROJECTS[id];
    if (!data) return;

    lastFocus = document.activeElement;

    // Build links HTML
    let linksHTML = '';
    if (data.links && data.links.length) {
      linksHTML = '<div class="modal-links">' +
        data.links.map(function (l) {
          return '<a href="' + l.url + '" class="btn btn-outline" target="_blank" rel="noopener noreferrer">' + l.label + '</a>';
        }).join('') +
        '</div>';
    }

    modalBody.innerHTML =
      '<p class="modal-tag">' + escHtml(data.tag) + '</p>' +
      '<h2 class="modal-title" id="modal-title">' + escHtml(data.title) + '</h2>' +
      '<p class="modal-date">' + escHtml(data.date) + '</p>' +
      '<div class="modal-divider"></div>' +
      '<p class="modal-desc">' + escHtml(data.desc) + '</p>' +
      '<ul class="modal-bullets">' +
        data.bullets.map(function (b) { return '<li>' + escHtml(b) + '</li>'; }).join('') +
      '</ul>' +
      '<p class="modal-stack-label">Tech Stack</p>' +
      '<div class="modal-stack">' +
        data.stack.map(function (s) { return '<span>' + escHtml(s) + '</span>'; }).join('') +
      '</div>' +
      linksHTML;

    panel.classList.remove('closing');
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Focus the close button
    closeBtn.focus();
    trapFocus();
  }

  function close() {
    panel.classList.add('closing');
    panel.addEventListener('animationend', function onEnd() {
      panel.removeEventListener('animationend', onEnd);
      modal.setAttribute('hidden', '');
      panel.classList.remove('closing');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }, { once: true });
  }

  // Focus trap
  function trapFocus() {
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    function handler(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    modal.addEventListener('keydown', handler);
    // Remove when modal closes
    modal.addEventListener('hidden', function () {
      modal.removeEventListener('keydown', handler);
    }, { once: true });
  }

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) close();
  });

  // Backdrop click
  if (backdrop) backdrop.addEventListener('click', close);

  // Close button
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Card clicks – delegate from proj-grid (projects page) OR homepage cards-grid
  function attachCardGrid(container) {
    if (!container) return;
    container.addEventListener('click', function (e) {
      const card = e.target.closest('[data-id]');
      if (card) open(card.dataset.id);
    });
    container.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('[data-id]');
        if (card) { e.preventDefault(); open(card.dataset.id); }
      }
    });
  }
  attachCardGrid(document.getElementById('proj-grid'));       // projects page
  attachCardGrid(document.querySelector('.cards-grid'));      // homepage featured

  // ── Filter bar ──────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.proj-card').forEach(function (card) {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const cats = (card.dataset.categories || '').split(' ');
          card.classList.toggle('hidden', !cats.includes(filter));
        }
      });
    });
  });

  // ── Utility ─────────────────────────────────────────────────
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
