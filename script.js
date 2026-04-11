/* ============================================
   DIGITAL PORTFOLIO — Interactive Script
   Phase 1: Handwriting Animation & Paper Theme
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Force scroll to top on page reload ---
  // Prevents the browser from restoring previous scroll position, ensuring
  // GSAP animations and the SVG stroke drawing start cleanly from the top.
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // --- Elements ---
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('comingSoonOverlay');
  const csTitle = document.getElementById('csTitle');
  const csDescription = document.getElementById('csDescription');
  const csClose = document.getElementById('csClose');

  const navLogo = document.getElementById('navLogo');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');

  // --- Theme Toggle Initialization ---
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    if (themeText) themeText.textContent = 'Modo claro';
    if (navLogo) navLogo.src = 'assets/Logo_Oficial_Unicartagena-dark-mode.png';
    const heroLogo = document.getElementById('heroLogo');
    if (heroLogo) heroLogo.src = 'assets/Logo_Oficial_Unicartagena-dark-mode.png';
  }

  // --- Custom Context Menu ---
  const contextMenu = document.getElementById('customContextMenu');
  const menuItems = document.querySelectorAll('.context-menu-item');

  // Prevent default context menu and show custom one
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    // Set active early to calculate real dimensions
    contextMenu.classList.add('active');

    // Calculate positioning to keep it within the viewport securely
    const menuWidth = contextMenu.offsetWidth || 240; // fallback if dimension reads 0
    const menuHeight = contextMenu.offsetHeight || 300;

    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 15;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 15;
    }

    // Position the menu fixed to viewport coordinates
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;

    // GSAP Pop-in intro animation (matching the lively paper theme)
    gsap.fromTo(contextMenu,
      { opacity: 0, scale: 0.85, transformOrigin: 'top left' },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)', clearProps: 'transformOrigin' }
    );
  });

  // Hide context menu when clicking anywhere else
  document.addEventListener('click', (e) => {
    if (contextMenu.classList.contains('active') && !contextMenu.contains(e.target)) {
      // Fade out
      gsap.to(contextMenu, {
        opacity: 0,
        scale: 0.95,
        duration: 0.15,
        onComplete: () => {
          contextMenu.classList.remove('active');
        }
      });
    }
  });

  // Handle menu actions
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // Close menu exactly like an outside click
      gsap.to(contextMenu, {
        opacity: 0, scale: 0.95, duration: 0.15, onComplete: () => contextMenu.classList.remove('active')
      });

      const action = item.getAttribute('data-action');
      const sectionId = item.getAttribute('data-section');

      if (action === 'scroll-top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (action === 'scroll-bottom') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else if (action === 'toggle-theme') {
        const heroLogo = document.getElementById('heroLogo');
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
          // Switch to Light Mode
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
          if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
          if (themeText) themeText.textContent = 'Modo oscuro';
          if (navLogo) navLogo.src = 'assets/Logo_Oficial_Unicartagena.png';
          if (heroLogo) heroLogo.src = 'assets/Logo_Oficial_Unicartagena.png';
        } else {
          // Switch to Dark Mode
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
          if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
          if (themeText) themeText.textContent = 'Modo claro';
          if (navLogo) navLogo.src = 'assets/Logo_Oficial_Unicartagena-dark-mode.png';
          if (heroLogo) heroLogo.src = 'assets/Logo_Oficial_Unicartagena-dark-mode.png';
        }
      } else if (action === 'goto' && sectionId) {
        const target = document.getElementById(sectionId);
        if (target) {
          // Add a small offset so it doesn't get hidden under the navbar entirely
          const yOffset = -80;
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        } else {
          // If the section doesn't exist, handle it as a locked "Coming Soon" tab
          const overlay = document.getElementById('comingSoonOverlay');
          const csTitle = document.getElementById('csTitle');
          const csDescription = document.getElementById('csDescription');

          let name = 'Esta sección';
          let msg = 'pronto estará disponible';
          if (sectionId === 'referenciando') { name = 'Referenciando'; msg = 'bases teóricas y metodológicas'; }
          if (sectionId === 'disenando') { name = 'Diseñando'; msg = 'la propuesta pedagógica'; }
          if (sectionId === 'creditos') { name = 'Créditos'; msg = 'participantes y asesores'; }

          csTitle.textContent = `${name} — Próximamente`;
          csDescription.textContent = `Esta sección aún está en construcción. Contenido: ${msg}. ¡Estén atentos!`;
          overlay.classList.add('active');
        }
      }
    });
  });

  // --- Scroll: navbar background & active link ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link[data-section]');

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile hamburger toggle ---
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link[data-section]').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // --- Coming Soon modal ---
  const comingSoonButtons = document.querySelectorAll('[data-coming-soon]');

  comingSoonButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.comingSoon;
      const message = btn.dataset.csMessage;
      csTitle.textContent = `${name} — Próximamente`;
      csDescription.textContent = `Esta sección aún está en construcción. Contenido: ${message}. ¡Estén atentos!`;
      overlay.classList.add('active');
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  csClose.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
    }
  });

  // --- Scroll Reveal (IntersectionObserver) ---
  const allRevealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const delayedReveals = Array.from(document.querySelectorAll('.hero-divider, .hero-meta .reveal'));
  const initialRevealElements = Array.from(allRevealElements).filter(el => !delayedReveals.includes(el));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  initialRevealElements.forEach(el => revealObserver.observe(el));

  // ================================================
  // LETTER-BY-LETTER ANIMATION TITLE
  // ================================================
  const heroTitle = document.getElementById('heroTitle');

  if (heroTitle) {
    const childNodes = Array.from(heroTitle.childNodes);
    heroTitle.innerHTML = '';

    let charIndex = 0;
    const baseDelay = 0.015; // 35ms per letter

    childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Split by words to keep them together for text wrapping
        const words = node.textContent.split(/(\s+)/);
        words.forEach(word => {
          // If it's whitespace, just append a space text node
          if (!word.trim()) {
            if (word.length > 0) {
              heroTitle.appendChild(document.createTextNode(' '));
            }
            return;
          }

          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';

          for (let i = 0; i < word.length; i++) {
            const span = document.createElement('span');
            span.textContent = word[i];
            span.className = 'letter-anim';
            span.style.animationDelay = `${charIndex * baseDelay}s`;
            wordSpan.appendChild(span);
            charIndex++;
          }
          heroTitle.appendChild(wordSpan);
        });

      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // It's the Wordwall span
        const text = node.textContent.trim();
        const mainSpan = document.createElement('span');
        mainSpan.className = node.className;
        mainSpan.style.display = 'inline-block';
        mainSpan.style.whiteSpace = 'nowrap';

        for (let i = 0; i < text.length; i++) {
          const span = document.createElement('span');
          span.textContent = text[i];
          span.className = 'letter-anim';
          span.style.animationDelay = `${charIndex * baseDelay}s`;
          mainSpan.appendChild(span);
          charIndex++;
        }
        heroTitle.appendChild(mainSpan);
      }
    });

    // Trigger delayed reveals after all letters finish animating
    const totalAnimTime = (charIndex * baseDelay) + 0.5; // 0.5s is the CSS animation duration
    setTimeout(() => {
      delayedReveals.forEach(el => revealObserver.observe(el));
    }, totalAnimTime * 1000);
  }

  // ================================================
  // LOCK ILLUSTRATION STATE AFTER ENTRANCE ANIMATION
  // ================================================
  // The entrance animations use forwards fill-mode. If we trigger a *new*
  // CSS animation on hover, the browser resets the element before starting
  // the hover animation, causing a flicker. Instead we:
  //  1. Listen for animationend on each illustration.
  //  2. Inline the final visual state so it no longer depends on fill-mode.
  //  3. Clear the animation declaration so CSS transitions can take over freely.

  const illBoy = document.querySelector('.ill-boy');
  if (illBoy) {
    illBoy.addEventListener('animationend', () => {
      illBoy.style.opacity = '1';
      illBoy.style.transform = 'translateY(0)';
      illBoy.style.animation = 'none';
    }, { once: true });
  }

  document.querySelectorAll('.ill-bubble').forEach(bubble => {
    bubble.addEventListener('animationend', () => {
      bubble.style.opacity = '1';
      bubble.style.transform = 'scale(1)';
      bubble.style.animation = 'none';
    }, { once: true });
  });

  // ================================================
  // LASER TRAIL EFFECT
  // ================================================

  // --- Trail duration knob ---
  // How fast the trail fades each frame (60fps).
  // Lower  →  longer trail  (e.g. 0.03 ≈ ~1.5 s)
  // Higher →  shorter trail (e.g. 0.15 ≈ ~0.2 s)
  const TRAIL_FADE_SPEED = 0.07;

  const canvas = document.createElement('canvas');
  canvas.id = 'laser-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  // Set the 50% opacity here, so the rendering inside the canvas 
  // is solid (1.0 alpha), stopping overlapping line caps from creating dots!
  canvas.style.opacity = '0.5';

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  let lastPoint = null;
  let moveTimeout = null;

  function addPoint(x, y) {
    if (lastPoint) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);

      // Draw SOLID color so overlaps don't multiply their transparency
      ctx.strokeStyle = '#FF7373'; // 158, 98, 245
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    lastPoint = { x, y };

    // Stop connecting points if the mouse stops for a bit
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      lastPoint = null;
    }, 100);
  }

  document.addEventListener('mousemove', (e) => {
    addPoint(e.clientX, e.clientY);
  });

  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      addPoint(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    lastPoint = null;
  });

  function fadeTrail() {
    // Fade everything uniformly each frame
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_FADE_SPEED})`;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(fadeTrail);
  }

  requestAnimationFrame(fadeTrail);

  // ================================================
  // SCROLL REVEAL — register .reveal-up elements
  // ================================================
  document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

  // ================================================
  // INTERACTIVE AVATAR 2 — Audio + Lip-Sync Engine
  // ================================================
  (function initAvatarPlayer() {
    const audio = document.getElementById('avatarAudio2');
    const playBtn = document.getElementById('playBtn2');
    const playIcon = document.getElementById('playIcon2');
    const pulseRing = document.getElementById('pulseRing2');
    const mouthImg = document.getElementById('avatarMouth2');
    const blinkImg = document.getElementById('avatarBlink2');

    if (!audio || !playBtn) return; // guard if elements missing

    // Mouth frame paths
    const MOUTH_FRAMES = [
      'assets/avatars/avatar-2-a.png',
      'assets/avatars/avatar-2-f.png',
      'assets/avatars/avatar-2-l.png',
      'assets/avatars/avatar-2-o.png',
      'assets/avatars/avatar-2-s.png',
    ];
    const SILENCE_THRESHOLD = 8;  // RMS below this = silence
    const FRAME_INTERVAL_MS = 90; // how often to swap mouth frames (~11fps)
    const BLINK_MIN_MS = 5000;
    const BLINK_MAX_MS = 9000;
    const BLINK_DURATION_MS = 150;

    let audioCtx = null;
    let analyser = null;
    let dataArray = null;
    let rafId = null;
    let mouthTimer = null;
    let blinkTimer = null;
    let isPlaying = false;

    // Preload all mouth frames
    MOUTH_FRAMES.forEach(src => { const img = new Image(); img.src = src; });

    // ── Helper: compute RMS amplitude ──
    function getRMS() {
      if (!analyser) return 0;
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] - 128) / 128;
        sum += v * v;
      }
      return Math.sqrt(sum / dataArray.length) * 255;
    }

    // ── Visualizer loop ──
    function visualizerLoop() {
      rafId = requestAnimationFrame(visualizerLoop);
      const rms = getRMS();
      // Map rms (0–~60) to scale (1.0–1.35)
      const scale = 1 + Math.min(rms / 60, 1) * 0.35;
      const opacity = Math.min(rms / 30, 1) * 0.8;
      pulseRing.style.setProperty('--pulse-scale', scale);
      pulseRing.style.setProperty('--pulse-opacity', opacity);
    }

    // ── Mouth frame cycling ──
    function startMouthAnim() {
      if (mouthTimer) return;
      mouthTimer = setInterval(() => {
        const rms = getRMS();
        if (rms < SILENCE_THRESHOLD) {
          // Silence — hide mouth overlay
          mouthImg.classList.remove('visible');
        } else {
          const src = MOUTH_FRAMES[Math.floor(Math.random() * MOUTH_FRAMES.length)];
          if (mouthImg.src !== src) mouthImg.src = src;
          mouthImg.classList.add('visible');
        }
      }, FRAME_INTERVAL_MS);
    }

    function stopMouthAnim() {
      clearInterval(mouthTimer);
      mouthTimer = null;
      mouthImg.classList.remove('visible');
    }

    // ── Random blink ──
    function scheduleBlink() {
      const delay = BLINK_MIN_MS + Math.random() * (BLINK_MAX_MS - BLINK_MIN_MS);
      blinkTimer = setTimeout(() => {
        blinkImg.classList.add('visible');
        setTimeout(() => {
          blinkImg.classList.remove('visible');
          scheduleBlink();
        }, BLINK_DURATION_MS);
      }, delay);
    }

    function stopBlink() {
      clearTimeout(blinkTimer);
      blinkTimer = null;
      blinkImg.classList.remove('visible');
    }

    // ── Web Audio setup (lazy, on first play) ──
    function setupAudioContext() {
      if (audioCtx) return;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.fftSize);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }

    // ── Play / Pause logic ──
    function startPlayback() {
      setupAudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      audio.play();
      isPlaying = true;
      playBtn.classList.add('playing');
      playIcon.classList.replace('fa-play', 'fa-pause');
      visualizerLoop();
      startMouthAnim();
      scheduleBlink();
    }

    function pausePlayback() {
      audio.pause();
      isPlaying = false;
      playBtn.classList.remove('playing');
      playIcon.classList.replace('fa-pause', 'fa-play');
      cancelAnimationFrame(rafId);
      pulseRing.style.setProperty('--pulse-scale', 1);
      pulseRing.style.setProperty('--pulse-opacity', 0);
      stopMouthAnim();
      // keep blink running while paused for naturalness
    }

    playBtn.addEventListener('click', () => {
      if (!isPlaying) {
        startPlayback();
      } else {
        pausePlayback();
      }
    });

    // Auto-reset when audio ends
    audio.addEventListener('ended', () => {
      isPlaying = false;
      playBtn.classList.remove('playing');
      playIcon.classList.replace('fa-pause', 'fa-play');
      cancelAnimationFrame(rafId);
      pulseRing.style.setProperty('--pulse-scale', 1);
      pulseRing.style.setProperty('--pulse-opacity', 0);
      stopMouthAnim();
      stopBlink();
    });
  })();

});

/* ============================================
   GSAP ScrollTrigger — SVG Line Drawing
   Draws the stroke as user scrolls through Inicio
   ============================================ */
(() => {
  const path = document.getElementById('stroke-path');
  if (!path || typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Measure full path length for the dash-offset trick
  const pathLength = path.getTotalLength();

  // Start fully invisible to prevent the round line-cap (circle)
  // from instantly appearing when scrolling hits the trigger
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;
  path.style.opacity = '0';

  // Create a synchronized timeline linked to the scroll progress
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#inicio',
      start: 'top top',      // begin when visible 
      end: 'bottom bottom',  // finish when it leaves
      scrub: 0.9,            // smooth lag
    }
  });

  // 1. Fade the path in quickly over the first 10% of the scroll timeline
  tl.to(path, { opacity: 1, duration: 0.1, ease: 'none' }, 0)
    // 2. Draw the stroke over the entire 100% of the timeline
    .to(path, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);

  // Simultaneously animate the background color of the #inicio section
  // Rather than inline colors which break Dark Mode, we fade an overlay
  gsap.to('.hero-bg-overlay', {
    opacity: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#inicio',
      start: 'center center',
      end: 'bottom bottom',
      scrub: true, // Ties exactly to scroll progress
    },
  });
})();


