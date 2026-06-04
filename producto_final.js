document.addEventListener('DOMContentLoaded', () => {
  const hasGsap = typeof gsap !== 'undefined';

  const ACTIVITIES = {
    identificando: {
      kicker: 'Capítulo 1 · Abre la caja',
      title: 'Identificando',
      thumb: 'assets/producto-final/templates/open-the-box.png'
    },
    referenciando: {
      kicker: 'Capítulo 2 · Revela la carta',
      title: 'Referenciando',
      thumb: 'assets/producto-final/templates/flip-tiles.png'
    },
    metodologia: {
      kicker: 'Capítulo 3 · Orden de clasificación',
      title: 'Metodología',
      thumb: 'assets/producto-final/templates/rank-order.png'
    },
    disenando: {
      kicker: 'Capítulo 4 · Cuestionario de juego',
      title: 'Diseñando',
      thumb: 'assets/producto-final/templates/gameshow-quiz.png'
    },
    resultados: {
      kicker: 'Resultados · Persecución en laberinto',
      title: 'Impacto del proyecto',
      thumb: 'assets/producto-final/templates/maze-chase.png'
    },
    creditos: {
      kicker: 'Créditos · Sopa de letras',
      title: 'Red de conocimiento',
      thumb: 'assets/producto-final/templates/wordsearch.png'
    }
  };

  const activityOverlay = document.getElementById('pfActivityOverlay');
  const navModal = document.getElementById('pfNavModal');
  const activityTitle = document.getElementById('pfActivityTitle');
  const activityKicker = document.getElementById('pfActivityKicker');
  const activityThumb = document.getElementById('pfActivityThumb');
  const activityContent = document.getElementById('pfActivityContent');
  const panels = document.querySelectorAll('[data-activity-panel]');

  let activeActivity = null;
  let countersStarted = false;

  if (hasGsap) {
    gsap.utils.toArray('.pf-reveal').forEach((element, index) => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        delay: Math.min(index * 0.03, 0.2),
        ease: 'power2.out'
      });
    });
  } else {
    document.querySelectorAll('.pf-reveal').forEach((element) => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  }

  document.querySelectorAll('[data-open-activity]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openActivity(trigger.dataset.openActivity);
    });
  });

  document.querySelectorAll('[data-close-activity]').forEach((button) => {
    button.addEventListener('click', closeActivity);
  });

  activityOverlay.addEventListener('click', (event) => {
    if (event.target === activityOverlay) {
      closeActivity();
    }
  });

  document.querySelectorAll('[data-open-nav-modal]').forEach((button) => {
    button.addEventListener('click', () => openNavModal());
  });

  document.querySelectorAll('[data-close-nav-modal]').forEach((button) => {
    button.addEventListener('click', closeNavModal);
  });

  navModal.addEventListener('click', (event) => {
    if (event.target === navModal) {
      closeNavModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (activityOverlay.classList.contains('is-open')) closeActivity();
    if (navModal.classList.contains('is-open')) closeNavModal();
  });

  initOpenBoxGame();
  initRevealCardsGame();
  initRankOrderGame();

  initGameshowQuiz();

  buildWordsearch();

  function openActivity(id) {
    const meta = ACTIVITIES[id];
    if (!meta) return;

    closeNavModal();
    activeActivity = id;

    activityKicker.textContent = meta.kicker;
    activityTitle.textContent = meta.title;
    activityThumb.src = meta.thumb;
    activityThumb.alt = meta.title;

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.activityPanel !== id;
    });

    document.querySelectorAll('.pf-template-item').forEach((item) => {
      item.classList.toggle('is-selected', item.dataset.openActivity === id);
    });

    resetActivityState(id);

    const modalView = activityOverlay.querySelector('.pf-modal-view');
    modalView.classList.toggle('pf-activity-modal-wide', id === 'referenciando' || id === 'metodologia' || id === 'disenando');

    activityOverlay.classList.add('is-open');
    activityOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (!countersStarted && (id === 'resultados' || id === 'disenando')) {
      countersStarted = true;
      document.querySelectorAll('[data-count-to]').forEach((counter) => {
        animateCounter(counter, Number(counter.dataset.countTo));
      });
    }

    if (hasGsap) {
      gsap.fromTo('.pf-modal-view', { scale: 0.96, y: 20 }, { scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.4)' });
    }
  }

  function closeActivity() {
    activityOverlay.classList.remove('is-open');
    activityOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeActivity = null;

    stopGameshowQuiz();

    activityOverlay.querySelector('.pf-modal-view')?.classList.remove('pf-activity-modal-wide');

    document.querySelectorAll('.pf-template-item').forEach((item) => {
      item.classList.remove('is-selected');
    });
  }

  function openNavModal() {
    navModal.classList.add('is-open');
    navModal.setAttribute('aria-hidden', 'false');
  }

  function closeNavModal() {
    navModal.classList.remove('is-open');
    navModal.setAttribute('aria-hidden', 'true');
  }

  function resetActivityState(id) {
    if (id === 'identificando') {
      resetOpenBoxGame();
    }
    if (id === 'referenciando') {
      resetRevealCardsGame();
    }
    if (id === 'metodologia') {
      resetRankOrderGame();
    }
    if (id === 'disenando') {
      resetGameshowQuiz();
    }
  }
});

const OPEN_BOX_DATA = [
  {
    id: 1,
    borderColor: '#ff8c42',
    textContent: 'La quietud de los métodos tradicionales y las presiones curriculares están apagando el brillo y la motivación en las aulas de primer grado.'
  },
  {
    id: 2,
    borderColor: '#62e86c',
    textContent: '¿De qué manera el uso del juego, apoyado en Wordwall, impacta el rendimiento académico en la competencia comunicativa del Colegio Colombo Inglés?'
  },
  {
    id: 3,
    borderColor: '#5eb3ff',
    textContent: 'Analizar el impacto de la gamificación en el rendimiento de los estudiantes de grado primero.'
  }
];

let openBoxRevealTimer = null;
let openBoxIsAnimating = false;

function getOpenBoxTextScale(text) {
  const len = text.length;
  if (len > 120) return 0.064;
  if (len > 85) return 0.072;
  if (len > 55) return 0.081;
  return 0.090;
}

function initOpenBoxGame() {
  resetOpenBoxGame();
}

function resetOpenBoxGame() {
  const game = document.getElementById('pfOpenBoxGame');
  const grid = document.getElementById('pfOpenBoxGrid');
  if (!game || !grid) return;

  if (openBoxRevealTimer) {
    clearTimeout(openBoxRevealTimer);
    openBoxRevealTimer = null;
  }

  openBoxIsAnimating = false;
  game.classList.remove('is-busy');
  grid.innerHTML = '';

  if (typeof gsap !== 'undefined') {
    gsap.killTweensOf('.pf-openbox-box, .pf-openbox-box-inner');
  }

  OPEN_BOX_DATA.forEach((boxData) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pf-openbox-box';
    button.dataset.boxId = String(boxData.id);
    button.style.setProperty('--box-color', boxData.borderColor);
    button.style.setProperty('--text-scale', String(getOpenBoxTextScale(boxData.textContent)));
    button.setAttribute('aria-label', `Abrir caja ${boxData.id}`);

    button.innerHTML = `
      <span class="pf-openbox-box-inner">
        <span class="pf-openbox-face pf-openbox-front">
          <span class="pf-openbox-number">${boxData.id}</span>
        </span>
        <span class="pf-openbox-face pf-openbox-back">
          <span class="pf-openbox-text">${boxData.textContent}</span>
        </span>
      </span>
    `;

    button.addEventListener('click', () => revealOpenBox(button));
    grid.appendChild(button);
  });
}

function revealOpenBox(box) {
  if (openBoxIsAnimating || box.classList.contains('is-opened')) return;

  const game = document.getElementById('pfOpenBoxGame');
  const stage = document.getElementById('pfOpenBoxStage');
  const grid = document.getElementById('pfOpenBoxGrid');
  const inner = box.querySelector('.pf-openbox-box-inner');
  const siblings = [...grid.querySelectorAll('.pf-openbox-box')].filter((item) => item !== box);
  const hasGsap = typeof gsap !== 'undefined';

  openBoxIsAnimating = true;
  game.classList.add('is-busy');
  box.classList.add('is-revealing');

  // Work in the stage's own coordinate space (avoids transformed-ancestor
  // containing-block issues that displaced the fixed-positioned box).
  const startRect = box.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();

  const slot = {
    left: startRect.left - stageRect.left,
    top: startRect.top - stageRect.top,
    width: startRect.width,
    height: startRect.height
  };

  const targetSize = Math.max(
    160,
    Math.min(stageRect.width * 0.75, stageRect.height * 0.78, 480)
  );
  const targetLeft = (stageRect.width - targetSize) / 2;
  const targetTop = (stageRect.height - targetSize) / 2;

  siblings.forEach((sibling) => sibling.classList.add('is-hidden'));

  // revealSound.play();

  if (!hasGsap) {
    box.classList.add('is-opened');
    siblings.forEach((sibling) => sibling.classList.remove('is-hidden'));
    box.classList.remove('is-revealing');
    game.classList.remove('is-busy');
    openBoxIsAnimating = false;
    return;
  }

  gsap.set(box, {
    position: 'absolute',
    left: slot.left,
    top: slot.top,
    width: slot.width,
    height: slot.height,
    margin: 0,
    zIndex: 30
  });

  const timeline = gsap.timeline({
    onComplete: () => {
      openBoxRevealTimer = setTimeout(() => returnOpenBoxToGrid(box, siblings, slot), 2800);
    }
  });

  timeline
    .to(box, {
      left: targetLeft,
      top: targetTop,
      width: targetSize,
      height: targetSize,
      duration: 0.55,
      ease: 'power3.out'
    })
    .to(inner, {
      rotateY: 180,
      duration: 0.45,
      ease: 'power2.inOut'
    }, '-=0.15')
    .to(box, {
      scale: 1.04,
      duration: 0.18,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut'
    }, '-=0.35');
}

function returnOpenBoxToGrid(box, siblings, slot) {
  const hasGsap = typeof gsap !== 'undefined';

  if (!hasGsap) {
    finishOpenBoxReturn(box, siblings);
    return;
  }

  gsap.to(box, {
    left: slot.left,
    top: slot.top,
    width: slot.width,
    height: slot.height,
    scale: 1,
    duration: 0.55,
    ease: 'power3.inOut',
    onComplete: () => finishOpenBoxReturn(box, siblings)
  });
}

function finishOpenBoxReturn(box, siblings) {
  const game = document.getElementById('pfOpenBoxGame');
  const inner = box.querySelector('.pf-openbox-box-inner');

  gsap.set(box, {
    clearProps: 'position,left,top,width,height,margin,zIndex,scale'
  });
  gsap.set(inner, { clearProps: 'transform' });

  box.classList.add('is-opened');
  box.classList.remove('is-revealing');
  siblings.forEach((sibling) => sibling.classList.remove('is-hidden'));

  game.classList.remove('is-busy');
  openBoxIsAnimating = false;
  openBoxRevealTimer = null;
}

const REVEAL_CARDS_DATA = [
  {
    id: 1,
    title: 'Contexto',
    textContent: 'Colegio Bilingüe Nacional Colombo Inglés, Neiva, Huila: entorno campestre de 30,000 m² enfocado en excelencia y bilingüismo.'
  },
  {
    id: 2,
    title: 'Marco Legal',
    textContent: 'Ley 115, Decreto 1290 de evaluación formativa y Ley 1978 de modernización TIC respaldan la integración de recursos digitales.'
  },
  {
    id: 3,
    title: 'Marco Teórico',
    textContent: 'Constructivismo de Piaget y Vygotsky: el juego media el aprendizaje en la Zona de Desarrollo Próximo.'
  },
  {
    id: 4,
    title: 'Conceptos Clave',
    textContent: 'Gamificación, motivación intrínseca, TIC, Wordwall y desarrollo integral como ejes de la propuesta pedagógica.'
  }
];

function initRevealCardsGame() {
  resetRevealCardsGame();
}

function resetRevealCardsGame() {
  const row = document.getElementById('pfRevealCardsRow');
  if (!row) return;

  row.innerHTML = '';

  REVEAL_CARDS_DATA.forEach((cardData) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pf-poker-card';
    button.dataset.cardId = String(cardData.id);
    button.setAttribute('aria-label', `Abrir carta ${cardData.id}: ${cardData.title}`);

    button.innerHTML = `
      <span class="pf-poker-card-inner">
        <span class="pf-poker-card-face pf-poker-card-cover">
          <span class="pf-poker-card-number">${cardData.id}</span>
        </span>
        <span class="pf-poker-card-face pf-poker-card-content">
          <strong class="pf-poker-card-title">${cardData.title}</strong>
          <span class="pf-poker-card-text">${cardData.textContent}</span>
        </span>
      </span>
    `;

    button.addEventListener('click', () => flipRevealCard(button));
    row.appendChild(button);
  });
}

function flipRevealCard(card) {
  if (card.classList.contains('is-flipped')) return;

  card.classList.add('is-flipped');
  // cardFlipSound.play();

  if (typeof gsap !== 'undefined') {
    gsap.fromTo(card, { scale: 1 }, {
      scale: 1.04,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut'
    });
  }
}

const RANK_ORDER_DATA = [
  {
    id: 'step-1',
    order: 1,
    text: 'Enfoque Cuantitativo: recolección y análisis de datos numéricos para garantizar objetividad y comparabilidad.'
  },
  {
    id: 'step-2',
    order: 2,
    text: 'Diseño Pre-experimental: Pre-test, intervención y Post-test con un solo grupo.'
  },
  {
    id: 'step-3',
    order: 3,
    text: 'Alcance Evaluativo: determinación de la eficacia de la estrategia mediante juicios técnicos.'
  },
  {
    id: 'step-4',
    order: 4,
    text: 'Población: 40 estudiantes de 6 y 7 años del grado primero (muestra censal).'
  }
];

let rankOrderDrag = null;

function initRankOrderGame() {
  const submit = document.getElementById('pfRankOrderSubmit');
  if (submit && !submit.dataset.bound) {
    submit.dataset.bound = 'true';
    submit.addEventListener('click', submitRankOrder);
  }
  resetRankOrderGame();
}

function resetRankOrderGame() {
  const source = document.getElementById('pfRankOrderSource');
  const submit = document.getElementById('pfRankOrderSubmit');
  const feedback = document.getElementById('pfRankOrderFeedback');
  if (!source) return;

  rankOrderDrag = null;

  document.querySelectorAll('.pf-rankorder-dropzone').forEach((zone) => {
    zone.innerHTML = '';
    zone.classList.remove('is-over', 'is-filled');
  });

  source.innerHTML = '';
  const shuffled = [...RANK_ORDER_DATA].sort(() => Math.random() - 0.5);
  shuffled.forEach((item) => source.appendChild(createRankOrderCard(item)));

  if (submit) {
    submit.disabled = true;
    submit.classList.remove('is-success', 'is-error');
  }
  if (feedback) feedback.textContent = '';
}

function createRankOrderCard(item) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'pf-rankorder-card';
  card.dataset.cardId = item.id;
  card.dataset.order = String(item.order);
  card.textContent = item.text;
  card.addEventListener('pointerdown', startRankDrag);
  return card;
}

function startRankDrag(event) {
  if (event.button !== 0 || rankOrderDrag) return;

  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();

  rankOrderDrag = {
    card,
    pointerId: event.pointerId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    originParent: card.parentElement,
    width: rect.width,
    height: rect.height
  };

  card.classList.add('is-dragging');
  card.setPointerCapture(event.pointerId);

  if (typeof gsap !== 'undefined') {
    gsap.set(card, {
      position: 'fixed',
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      margin: 0,
      zIndex: 3000
    });
  } else {
    Object.assign(card.style, {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: '0',
      zIndex: '3000'
    });
  }

  card.addEventListener('pointermove', moveRankDrag);
  card.addEventListener('pointerup', endRankDrag);
  card.addEventListener('pointercancel', endRankDrag);
}

function moveRankDrag(event) {
  if (!rankOrderDrag || event.pointerId !== rankOrderDrag.pointerId) return;

  const { card, offsetX, offsetY } = rankOrderDrag;
  const left = event.clientX - offsetX;
  const top = event.clientY - offsetY;

  if (typeof gsap !== 'undefined') {
    gsap.set(card, { left, top });
  } else {
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }

  highlightRankDropzones(event.clientX, event.clientY);
}

function highlightRankDropzones(x, y) {
  document.querySelectorAll('.pf-rankorder-dropzone').forEach((zone) => {
    const occupied = zone.querySelector('.pf-rankorder-card');
    const isValid = isPointInRankZone(x, y, zone) && (!occupied || occupied === rankOrderDrag?.card);
    zone.classList.toggle('is-over', isValid);
  });
}

function isPointInRankZone(x, y, zone) {
  const rect = zone.getBoundingClientRect();
  const pad = 28;
  return x >= rect.left - pad && x <= rect.right + pad && y >= rect.top - pad && y <= rect.bottom + pad;
}

function findBestRankDropzone(x, y) {
  let best = null;
  let bestDist = Infinity;

  document.querySelectorAll('.pf-rankorder-dropzone').forEach((zone) => {
    const occupied = zone.querySelector('.pf-rankorder-card');
    if (occupied && occupied !== rankOrderDrag?.card) return;
    if (!isPointInRankZone(x, y, zone)) return;

    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(x - cx, y - cy);

    if (dist < bestDist) {
      bestDist = dist;
      best = zone;
    }
  });

  return best;
}

function isPointInRankSource(x, y) {
  const source = document.getElementById('pfRankOrderSource');
  if (!source) return false;
  const rect = source.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function endRankDrag(event) {
  if (!rankOrderDrag || event.pointerId !== rankOrderDrag.pointerId) return;

  const { card, originParent } = rankOrderDrag;

  card.removeEventListener('pointermove', moveRankDrag);
  card.removeEventListener('pointerup', endRankDrag);
  card.removeEventListener('pointercancel', endRankDrag);
  card.classList.remove('is-dragging');

  try {
    card.releasePointerCapture(event.pointerId);
  } catch (_) {
    /* pointer already released */
  }

  document.querySelectorAll('.pf-rankorder-dropzone').forEach((zone) => zone.classList.remove('is-over'));

  const dropzone = findBestRankDropzone(event.clientX, event.clientY);
  const source = document.getElementById('pfRankOrderSource');

  if (dropzone) {
    dropzone.appendChild(card);
    snapRankCard(card);
  } else if (isPointInRankSource(event.clientX, event.clientY)) {
    source.appendChild(card);
    resetRankCardLayout(card);
  } else {
    originParent.appendChild(card);
    resetRankCardLayout(card);
  }

  rankOrderDrag = null;
  syncRankDropzones();
  updateRankSubmitState();
}

function snapRankCard(card) {
  resetRankCardLayout(card);

  if (typeof gsap !== 'undefined') {
    gsap.fromTo(card, { scale: 1.14 }, {
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.55)'
    });
  } else {
    card.classList.add('is-snapped');
    setTimeout(() => card.classList.remove('is-snapped'), 600);
  }
}

function resetRankCardLayout(card) {
  if (typeof gsap !== 'undefined') {
    gsap.set(card, { clearProps: 'position,left,top,width,height,margin,zIndex' });
  } else {
    card.removeAttribute('style');
  }
}

function syncRankDropzones() {
  document.querySelectorAll('.pf-rankorder-dropzone').forEach((zone) => {
    zone.classList.toggle('is-filled', !!zone.querySelector('.pf-rankorder-card'));
  });
}

function updateRankSubmitState() {
  const submit = document.getElementById('pfRankOrderSubmit');
  if (!submit) return;

  const allFilled = [...document.querySelectorAll('.pf-rankorder-dropzone')]
    .every((zone) => zone.querySelector('.pf-rankorder-card'));

  submit.disabled = !allFilled;
  submit.classList.remove('is-success', 'is-error');

  const feedback = document.getElementById('pfRankOrderFeedback');
  if (feedback && allFilled) feedback.textContent = '';
}

function submitRankOrder() {
  const zones = [...document.querySelectorAll('.pf-rankorder-dropzone')];
  const allCorrect = zones.every((zone) => {
    const slot = Number(zone.dataset.dropzone);
    const card = zone.querySelector('.pf-rankorder-card');
    return card && Number(card.dataset.order) === slot;
  });

  const submit = document.getElementById('pfRankOrderSubmit');
  const feedback = document.getElementById('pfRankOrderFeedback');

  if (allCorrect) {
    submit?.classList.add('is-success');
    if (feedback) {
      feedback.textContent = '¡Excelente! La ruta metodológica está en el orden correcto.';
    }
    launchConfetti(document.getElementById('pfRankOrderGame'));
  } else {
    submit?.classList.add('is-error');
    if (feedback) {
      feedback.textContent = 'Algunos pasos no coinciden. Revisa el orden e inténtalo de nuevo.';
    }
  }
}

const QUIZ_DATA = [
  {
    prompt: '¿Qué modelo de diseño instruccional guió el Recurso Educativo Digital?',
    options: ['Modelo ADDIE', 'Modelo SAM', 'Modelo en cascada'],
    correct: 0
  },
  {
    prompt: '¿Cuántas actividades interactivas se diseñaron en Wordwall?',
    options: ['6 actividades', '12 actividades', '20 actividades'],
    correct: 1
  },
  {
    prompt: '¿Qué estrategia pedagógica orientó la intervención?',
    options: ['Clase magistral', 'Aprendizaje Basado en Secuencias Didácticas', 'Memorización'],
    correct: 1
  },
  {
    prompt: '¿Qué estructuras gramaticales se reforzaron?',
    options: ["is/are · has/hasn't got", 'Past perfect', 'Third conditional'],
    correct: 0
  },
  {
    prompt: '¿Qué centros de vocabulario se trabajaron?',
    options: ['Space & Stars', 'Fun on the Farm · Food with Friends', 'City Life'],
    correct: 1
  },
  {
    prompt: '¿Sobre qué plataforma se construyó el RED?',
    options: ['Wordwall', 'Kahoot', 'PowerPoint'],
    correct: 0
  }
];

const QUIZ_TIME = 20;
const QUIZ_LETTERS = ['A', 'B', 'C', 'D'];

let quizIndex = 0;
let quizScore = 0;
let quizTimerId = null;
let quizReadyId = null;
let quizAdvanceId = null;
let quizTimeLeft = QUIZ_TIME;
let quizAnswered = false;

function initGameshowQuiz() {
  const restart = document.getElementById('pfQuizRestart');
  if (restart && !restart.dataset.bound) {
    restart.dataset.bound = 'true';
    restart.addEventListener('click', () => resetGameshowQuiz());
  }
  resetGameshowQuiz();
}

function stopGameshowQuiz() {
  clearInterval(quizTimerId);
  clearTimeout(quizReadyId);
  clearTimeout(quizAdvanceId);
  quizTimerId = null;
  quizReadyId = null;
  quizAdvanceId = null;
}

function resetGameshowQuiz() {
  stopGameshowQuiz();
  quizIndex = 0;
  quizScore = 0;
  quizAnswered = false;

  const scoreEl = document.getElementById('pfQuizScore');
  if (scoreEl) scoreEl.textContent = '0';

  const result = document.getElementById('pfQuizResult');
  const question = document.getElementById('pfQuizQuestion');
  if (result) result.hidden = true;
  if (question) question.hidden = true;

  showQuizReady();
}

function showQuizReady() {
  const ready = document.getElementById('pfQuizReady');
  const question = document.getElementById('pfQuizQuestion');
  const result = document.getElementById('pfQuizResult');
  const label = document.getElementById('pfQuizReadyLabel');
  const counter = document.getElementById('pfQuizCounter');
  if (!ready) return;

  if (result) result.hidden = true;
  if (question) question.hidden = true;
  ready.hidden = false;

  if (label) label.textContent = `Pregunta ${quizIndex + 1}`;
  if (counter) counter.textContent = `${quizIndex + 1} de ${QUIZ_DATA.length}`;

  resetQuizProgress();

  if (typeof gsap !== 'undefined') {
    gsap.fromTo(ready.querySelector('.pf-gameshow-ready-box'),
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.6)' });
  }

  quizReadyId = setTimeout(showQuizQuestion, 1400);
}

function showQuizQuestion() {
  const ready = document.getElementById('pfQuizReady');
  const question = document.getElementById('pfQuizQuestion');
  const prompt = document.getElementById('pfQuizPrompt');
  const answers = document.getElementById('pfQuizAnswers');
  const counter = document.getElementById('pfQuizCounter');
  if (!question || !answers) return;

  const data = QUIZ_DATA[quizIndex];
  quizAnswered = false;

  if (ready) ready.hidden = true;
  question.hidden = false;
  if (counter) counter.textContent = `${quizIndex + 1} de ${QUIZ_DATA.length}`;
  if (prompt) prompt.textContent = data.prompt;

  answers.innerHTML = '';
  data.options.forEach((option, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pf-gameshow-answer';
    button.innerHTML = `
      <span class="pf-gameshow-answer-letter">${QUIZ_LETTERS[i]}</span>
      <span class="pf-gameshow-answer-text">${option}</span>
    `;
    button.addEventListener('click', () => selectQuizAnswer(i, button));
    answers.appendChild(button);
  });

  if (typeof gsap !== 'undefined') {
    gsap.fromTo('.pf-gameshow-answer',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'power2.out' });
  }

  startQuizTimer();
}

function startQuizTimer() {
  quizTimeLeft = QUIZ_TIME;
  updateQuizTimer();
  resetQuizProgress();

  const fill = document.getElementById('pfQuizProgress');
  if (fill && typeof gsap !== 'undefined') {
    gsap.fromTo(fill, { scaleX: 1 }, { scaleX: 0, duration: QUIZ_TIME, ease: 'none' });
  }

  quizTimerId = setInterval(() => {
    quizTimeLeft -= 1;
    updateQuizTimer();
    if (quizTimeLeft <= 0) {
      clearInterval(quizTimerId);
      quizTimerId = null;
      handleQuizTimeout();
    }
  }, 1000);
}

function updateQuizTimer() {
  const timer = document.getElementById('pfQuizTimer');
  if (!timer) return;
  const seconds = Math.max(0, quizTimeLeft);
  timer.textContent = `0:${String(seconds).padStart(2, '0')}`;
}

function resetQuizProgress() {
  const fill = document.getElementById('pfQuizProgress');
  if (!fill) return;
  if (typeof gsap !== 'undefined') {
    gsap.killTweensOf(fill);
    gsap.set(fill, { scaleX: 1 });
  } else {
    fill.style.transform = 'scaleX(1)';
  }
}

function selectQuizAnswer(index, button) {
  if (quizAnswered) return;
  quizAnswered = true;

  clearInterval(quizTimerId);
  quizTimerId = null;

  const fill = document.getElementById('pfQuizProgress');
  if (fill && typeof gsap !== 'undefined') gsap.killTweensOf(fill);

  const data = QUIZ_DATA[quizIndex];
  const buttons = [...document.querySelectorAll('.pf-gameshow-answer')];
  buttons.forEach((btn) => { btn.disabled = true; });

  if (index === data.correct) {
    button.classList.add('is-correct');
    quizScore += 1;
    const scoreEl = document.getElementById('pfQuizScore');
    if (scoreEl) scoreEl.textContent = String(quizScore);
    // correctSound.play();
    launchConfetti(document.getElementById('pfGameshowGame'));
  } else {
    button.classList.add('is-wrong');
    if (buttons[data.correct]) buttons[data.correct].classList.add('is-correct');
    // wrongSound.play();
  }

  quizAdvanceId = setTimeout(advanceQuiz, 1700);
}

function handleQuizTimeout() {
  if (quizAnswered) return;
  quizAnswered = true;

  const data = QUIZ_DATA[quizIndex];
  const buttons = [...document.querySelectorAll('.pf-gameshow-answer')];
  buttons.forEach((btn) => { btn.disabled = true; });
  if (buttons[data.correct]) buttons[data.correct].classList.add('is-correct');

  quizAdvanceId = setTimeout(advanceQuiz, 1700);
}

function advanceQuiz() {
  quizIndex += 1;
  if (quizIndex >= QUIZ_DATA.length) {
    showQuizResult();
  } else {
    showQuizReady();
  }
}

function showQuizResult() {
  const result = document.getElementById('pfQuizResult');
  const question = document.getElementById('pfQuizQuestion');
  const ready = document.getElementById('pfQuizReady');
  const scoreText = document.getElementById('pfQuizResultScore');
  const counter = document.getElementById('pfQuizCounter');
  if (!result) return;

  if (question) question.hidden = true;
  if (ready) ready.hidden = true;
  result.hidden = false;

  if (scoreText) scoreText.textContent = `${quizScore} / ${QUIZ_DATA.length}`;
  if (counter) counter.textContent = `${QUIZ_DATA.length} de ${QUIZ_DATA.length}`;
  resetQuizProgress();

  if (typeof gsap !== 'undefined') {
    gsap.fromTo(result.querySelector('.pf-gameshow-ready-box'),
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' });
  }
  launchConfetti(document.getElementById('pfGameshowGame'));
}

function launchConfetti(container) {
  if (!container) return;

  const colors = ['#ffd166', '#10a0f0', '#008214', '#ffffff'];
  for (let i = 0; i < 18; i += 1) {
    const piece = document.createElement('span');
    piece.style.cssText = `
      position:absolute;left:${35 + Math.random() * 30}%;top:${28 + Math.random() * 18}%;
      width:8px;height:12px;border-radius:2px;background:${colors[i % colors.length]};
      pointer-events:none;z-index:4;
    `;
    container.appendChild(piece);

    if (typeof gsap !== 'undefined') {
      gsap.to(piece, {
        x: (Math.random() - 0.5) * 320,
        y: 140 + Math.random() * 100,
        rotation: Math.random() * 480,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: () => piece.remove()
      });
    } else {
      piece.remove();
    }
  }
}

function animateCounter(element, target) {
  const isDecimal = !Number.isInteger(target);
  const start = performance.now();
  const duration = 1100;

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    element.textContent = isDecimal ? value.toFixed(target < 1 ? 2 : 2) : Math.round(value);

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      element.textContent = isDecimal ? target.toFixed(target < 1 ? 2 : 2) : String(target);
    }
  }

  requestAnimationFrame(frame);
}

function buildWordsearch() {
  const grid = document.querySelector('.pf-wordsearch');
  if (!grid || grid.childElementCount > 0) return;

  const rows = [
    'LOZADAGAMEWR',
    'UWORDWALLRIO',
    'CUELLARBOXEA',
    'DHAKEMAIZERL',
    'OSANDOVALRED',
    'TPIAGETQUIZA',
    'EVYGOTSKYBNR',
    'CREDITOCCSNO',
    'ACABRERATILE',
    'RNEIVAHUILAS',
    'TTICJUEGOSAB',
    'AVILLAMILRED'
  ];

  const foundCoordinates = new Set([
    ...range(0, 0, 5),
    ...range(2, 0, 6),
    ...range(4, 1, 8),
    ...range(8, 1, 7),
    ...range(11, 1, 8),
    ...range(5, 1, 6),
    ...range(6, 1, 8),
    ...range(1, 1, 8),
    ...range(10, 4, 5),
    ...range(3, 1, 4)
  ]);

  rows.forEach((row, rowIndex) => {
    row.split('').forEach((letter, columnIndex) => {
      const cell = document.createElement('span');
      cell.className = 'pf-word-cell';
      cell.textContent = letter;
      if (foundCoordinates.has(`${rowIndex}-${columnIndex}`)) {
        cell.classList.add('is-found');
      }
      grid.appendChild(cell);
    });
  });
}

function range(row, start, length) {
  return Array.from({ length }, (_, index) => `${row}-${start + index}`);
}
