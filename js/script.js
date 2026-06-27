'use strict';

// ── DOM References ────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const backToTop = document.getElementById('backToTop');
const typedRole = document.getElementById('typedRole');
const typeCursor = document.getElementById('typeCursor');

// =============================================
//  NAVBAR — Scroll shadow + active link
// =============================================
function onScroll() {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 30);

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });

  // Back-to-top
  backToTop.classList.toggle('visible', window.scrollY > 500);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // init

// ── Back To Top ───────────────────────────────
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =============================================
//  MOBILE HAMBURGER MENU
// =============================================
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('active');
  navMenu.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on backdrop click
navMenu.addEventListener('click', e => {
  if (e.target === navMenu) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// =============================================
//  TYPING ANIMATION — Hero Role
// =============================================
const roles = [
  'DevOps & Cloud Enthusiast',
  'Infrastructure Automator',
  'Kubernetes Explorer',
  'CI/CD Pipeline Builder',
  'AWS Cloud Explorer',
];

let roleIdx = 0;
let charIdx = 0;
let deleting = false;
let typingTimer;

function typeLoop() {
  const current = roles[roleIdx];

  if (!deleting) {
    // Typing forward
    charIdx++;
    typedRole.textContent = current.slice(0, charIdx);

    if (charIdx === current.length) {
      // Finished word — pause before deleting
      deleting = true;
      typingTimer = setTimeout(typeLoop, 2200);
      return;
    }
    typingTimer = setTimeout(typeLoop, 95);
  } else {
    // Deleting
    charIdx--;
    typedRole.textContent = current.slice(0, charIdx);

    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingTimer = setTimeout(typeLoop, 300);
      return;
    }
    typingTimer = setTimeout(typeLoop, 55);
  }
}

// Kick off after page load
setTimeout(typeLoop, 900);

// =============================================
//  SCROLL ANIMATIONS — Intersection Observer
// =============================================
const animTargets = document.querySelectorAll('[data-animate]');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger siblings in the same parent
    const parent = entry.target.parentElement;
    const siblings = [...parent.querySelectorAll('[data-animate]')];
    const idx = siblings.indexOf(entry.target);

    setTimeout(() => {
      entry.target.classList.add('in-view');
    }, idx * 90);

    scrollObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
});

animTargets.forEach(el => scrollObserver.observe(el));

// =============================================
//  LAUNCH SEQUENCE MINI-GAME
// =============================================

/**
 * Each step: { delay (ms), type, text }
 * Types: 'cmd' | 'ok' | 'info' | 'warn' | 'blast' | 'gap'
 */
const SEQUENCE = [
  { delay: 0, type: 'cmd', text: 'devops-launch --env prod --target kavya-portfolio' },
  { delay: 550, type: 'gap', text: '' },
  { delay: 600, type: 'info', text: '⚙  Initialising launch configuration...' },
  { delay: 1050, type: 'ok', text: '✓  Configuration loaded successfully.' },
  { delay: 1350, type: 'gap', text: '' },
  { delay: 1400, type: 'info', text: '🔍 Running pre-flight system diagnostics...' },
  { delay: 1900, type: 'ok', text: '✓  CPU / Memory / Disk — all nominal.' },
  { delay: 2150, type: 'ok', text: '✓  Network connectivity verified.' },
  { delay: 2400, type: 'gap', text: '' },
  { delay: 2450, type: 'info', text: '📦 Building Docker image  kavya-sureja:latest ...' },
  { delay: 3100, type: 'ok', text: '✓  Image built  (Layer cache: 87% hit)' },
  { delay: 3350, type: 'info', text: '⬆  Pushing to container registry...' },
  { delay: 3850, type: 'ok', text: '✓  Image pushed — digest: sha256:a3f9c2...' },
  { delay: 4100, type: 'gap', text: '' },
  { delay: 4150, type: 'info', text: '⚓ Applying Kubernetes manifests...' },
  { delay: 4650, type: 'ok', text: '✓  Deployment created — kavya-portfolio' },
  { delay: 4900, type: 'info', text: '🔄 Rolling update: 0/3 → 1/3 → 2/3 → 3/3 pods' },
  { delay: 5500, type: 'ok', text: '✓  All 3 pods running & healthy.' },
  { delay: 5750, type: 'gap', text: '' },
  { delay: 5800, type: 'info', text: '🔒 Verifying SSL certificates...' },
  { delay: 6100, type: 'ok', text: '✓  TLS 1.3 — valid · expires 2027.' },
  { delay: 6350, type: 'info', text: '📬 Activating contact channels...' },
  { delay: 6650, type: 'ok', text: '✓  All endpoints reachable.' },
  { delay: 6950, type: 'gap', text: '' },
  { delay: 7000, type: 'blast', text: '🚀  PIPELINE COMPLETE — Welcome to my world!' },
  { delay: 7400, type: 'info', text: '   Contact channels are now live ↓' },
];

let launchStarted = false;

function startLaunchSequence() {
  if (launchStarted) return;
  launchStarted = true;

  const btn = document.getElementById('launchBtn');
  const btnText = document.getElementById('launchBtnText');
  const tIdle = document.getElementById('tIdle');
  const tOutput = document.getElementById('tOutput');
  const tBody = document.getElementById('terminalBody');

  // Update button state
  btn.disabled = true;
  btn.querySelector('.launch-icon-wrap').textContent = '⏳';
  btnText.textContent = 'Sequence Running…';

  // Hide idle prompt
  tIdle.style.display = 'none';

  SEQUENCE.forEach((step, i) => {
    setTimeout(() => {
      if (step.type === 'gap') {
        const gap = document.createElement('div');
        gap.className = 't-gap';
        tOutput.appendChild(gap);
        return;
      }

      const line = document.createElement('div');
      line.className = 't-line';

      if (step.type === 'cmd') {
        line.innerHTML =
          `<span class="t-prompt">kavya@devops:~$</span> ` +
          `<span class="t-cmd">${escHtml(step.text)}</span>`;
      } else if (step.type === 'ok') {
        line.innerHTML = `<span class="t-ok">${escHtml(step.text)}</span>`;
      } else if (step.type === 'warn') {
        line.innerHTML = `<span class="t-warn">${escHtml(step.text)}</span>`;
      } else if (step.type === 'blast') {
        line.innerHTML = `<strong class="t-blast t-ok">${escHtml(step.text)}</strong>`;
      } else {
        line.innerHTML = `<span class="t-info">${escHtml(step.text)}</span>`;
      }

      tOutput.appendChild(line);

      // Auto-scroll terminal to bottom
      tBody.scrollTop = tBody.scrollHeight;

      // After last item — reveal contact links
      if (i === SEQUENCE.length - 1) {
        setTimeout(revealContact, 700);
      }
    }, step.delay);
  });
}

function revealContact() {
  const contactLinks = document.getElementById('contactLinks');
  contactLinks.classList.add('revealed');

  const btn = document.getElementById('launchBtn');
  const btnText = document.getElementById('launchBtnText');
  btn.querySelector('.launch-icon-wrap').textContent = '✅';
  btnText.textContent = 'Launch Complete!';

  // Smooth scroll to contact links
  setTimeout(() => {
    contactLinks.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 400);
}

/** Escape HTML to prevent XSS */
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// =============================================
//  SMOOTH SECTION SCROLL (polyfill-safe)
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// =============================================
//  THREE.JS 3D BACKGROUNDS (Subtle & Theme-Matched)
// =============================================
if (typeof THREE !== 'undefined') {
  // Global mouse coordinates for parallax
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
  }, { passive: true });

  // Scene Scaffolder
  function createScene(containerId, initFn, animateFn) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const state = { scene, camera, renderer, container, isVisible: false };

    initFn(state);

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Visibility observer to pause animation loop when section is hidden
    const viewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        state.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    viewObserver.observe(container);

    function loop(time) {
      if (state.isVisible) {
        animateFn(state, time);
        renderer.render(scene, camera);
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    return state;
  }

  // --- 1. HERO CONSTELLATION NETWORK ---
  createScene('canvas-hero', 
    (state) => {
      const count = 75;
      const geom = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const vels = [];

      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 16;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
        vels.push({
          x: (Math.random() - 0.5) * 0.008,
          y: (Math.random() - 0.5) * 0.008,
          z: (Math.random() - 0.5) * 0.008
        });
      }

      geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: 0x7DB9F0, // Sky Blue
        size: 0.12,
        transparent: true,
        opacity: 0.75
      });

      state.particles = new THREE.Points(geom, mat);
      state.scene.add(state.particles);
      state.vels = vels;

      const lineMat = new THREE.LineBasicMaterial({
        color: 0x6C5A4E, // Warm Walnut
        transparent: true,
        opacity: 0.18
      });
      const lineGeom = new THREE.BufferGeometry();
      const linePos = new Float32Array(count * count * 6);
      lineGeom.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
      state.lineMesh = new THREE.LineSegments(lineGeom, lineMat);
      state.scene.add(state.lineMesh);
    },
    (state) => {
      const pos = state.particles.geometry.attributes.position.array;
      const vels = state.vels;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        pos[i * 3] += vels[i].x;
        pos[i * 3 + 1] += vels[i].y;
        pos[i * 3 + 2] += vels[i].z;

        if (Math.abs(pos[i * 3]) > 8) vels[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > 5) vels[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > 4) vels[i].z *= -1;
      }
      state.particles.geometry.attributes.position.needsUpdate = true;

      const linePos = state.lineMesh.geometry.attributes.position.array;
      let lineIdx = 0;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

          if (dist < 2.4) {
            linePos[lineIdx++] = pos[i * 3];
            linePos[lineIdx++] = pos[i * 3 + 1];
            linePos[lineIdx++] = pos[i * 3 + 2];
            linePos[lineIdx++] = pos[j * 3];
            linePos[lineIdx++] = pos[j * 3 + 1];
            linePos[lineIdx++] = pos[j * 3 + 2];
          }
        }
      }
      for (let k = lineIdx; k < linePos.length; k++) {
        linePos[k] = 0;
      }
      state.lineMesh.geometry.attributes.position.needsUpdate = true;

      // Mouse parallax camera tilt
      state.camera.position.x += (mouseX * 4 - state.camera.position.x) * 0.05;
      state.camera.position.y += (-mouseY * 4 - state.camera.position.y) * 0.05;
      state.camera.lookAt(0, 0, 0);
    }
  );

  // --- 2. ABOUT FLOATING CONTAINER BOXES ---
  createScene('canvas-about',
    (state) => {
      state.cubes = [];
      const colors = [0x7DB9F0, 0x6C5A4E, 0x183153];
      for (let i = 0; i < 5; i++) {
        const size = Math.random() * 1.4 + 0.8;
        const geom = new THREE.BoxGeometry(size, size, size);
        const edges = new THREE.EdgesGeometry(geom);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.35
        }));

        const mat = new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.02,
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geom, mat);
        mesh.add(line);

        mesh.position.set(
          (Math.random() - 0.5) * 11,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

        state.scene.add(mesh);
        state.cubes.push({
          mesh,
          rx: (Math.random() - 0.5) * 0.003,
          ry: (Math.random() - 0.5) * 0.003,
          floatSpeed: Math.random() * 0.0008 + 0.0004,
          floatOffset: Math.random() * Math.PI
        });
      }
    },
    (state, time) => {
      state.cubes.forEach(c => {
        c.mesh.rotation.x += c.rx;
        c.mesh.rotation.y += c.ry;
        c.mesh.position.y += Math.sin(time * 0.001 + c.floatOffset) * c.floatSpeed;
      });
    }
  );

  // --- 3. SKILLS NETWORK CLUSTER GLOBE ---
  createScene('canvas-skills',
    (state) => {
      const radius = 3.6;
      const geom = new THREE.IcosahedronGeometry(radius, 2);
      
      const ptsMat = new THREE.PointsMaterial({
        color: 0x7DB9F0,
        size: 0.1,
        transparent: true,
        opacity: 0.75
      });
      const points = new THREE.Points(geom, ptsMat);

      const edges = new THREE.EdgesGeometry(geom);
      const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: 0x6C5A4E,
        transparent: true,
        opacity: 0.15
      }));

      state.group = new THREE.Group();
      state.group.add(points);
      state.group.add(lines);
      state.scene.add(state.group);
    },
    (state) => {
      state.group.rotation.y += 0.0016;
      state.group.rotation.x += 0.0006;
    }
  );

  // --- 4. PROJECTS CI/CD PIPELINE FLOW ---
  createScene('canvas-projects',
    (state) => {
      state.pipelines = [];
      const colors = [0x7DB9F0, 0x6C5A4E];

      for (let i = 0; i < 5; i++) {
        const y = -3.5 + i * 1.8;
        const pts = [
          new THREE.Vector3(-10, y, 0),
          new THREE.Vector3(-3.5, y + (Math.random() - 0.5) * 1.5, 0),
          new THREE.Vector3(3.5, y + (Math.random() - 0.5) * 1.5, 0),
          new THREE.Vector3(10, y, 0)
        ];

        const curve = new THREE.CatmullRomCurve3(pts);
        const curvePoints = curve.getPoints(50);
        const geom = new THREE.BufferGeometry().setFromPoints(curvePoints);

        const line = new THREE.Line(geom, new THREE.LineBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.16
        }));
        state.scene.add(line);

        const pulseMat = new THREE.MeshBasicMaterial({
          color: 0x7DB9F0,
          transparent: true,
          opacity: 0.8
        });
        const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), pulseMat);
        state.scene.add(pulse);

        state.pipelines.push({
          curve,
          pulse,
          progress: Math.random(),
          speed: 0.0018 + Math.random() * 0.0015
        });
      }
    },
    (state) => {
      state.pipelines.forEach(p => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;
        const pt = p.curve.getPointAt(p.progress);
        p.pulse.position.copy(pt);
      });
    }
  );

  // --- 5. CONTACT MESH GLOBE ---
  createScene('canvas-contact',
    (state) => {
      const geom = new THREE.DodecahedronGeometry(4, 1);
      const edges = new THREE.EdgesGeometry(geom);
      const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: 0x6C5A4E,
        transparent: true,
        opacity: 0.18
      }));

      const points = new THREE.Points(geom, new THREE.PointsMaterial({
        color: 0x7DB9F0,
        size: 0.13,
        transparent: true,
        opacity: 0.8
      }));

      state.group = new THREE.Group();
      state.group.add(lines);
      state.group.add(points);
      state.scene.add(state.group);
    },
    (state) => {
      state.group.rotation.y += 0.0018;
      state.group.rotation.z += 0.0006;
    }
  );
}
