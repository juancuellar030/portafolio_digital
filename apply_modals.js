const fs = require('fs');
let html = fs.readFileSync('blog_draft_wordwall_juego_grado1.html', 'utf8');

// 1. Add CSS
const cssReplacement = `    /* ── MODAL ── */
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(30,27,75,0.85); z-index: 1000;
      display: none; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s ease;
      backdrop-filter: blur(4px);
    }
    .modal-overlay.active { display: flex; opacity: 1; }
    .modal-content {
      width: 90%; max-width: 900px; height: 80vh; background: transparent;
      border-radius: var(--radius-lg); position: relative;
      border: 4px solid var(--ww-border); box-shadow: 0 12px 0 var(--ww-border);
      overflow: visible;
      transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .modal-overlay.active .modal-content { transform: scale(1); }
    .modal-close-wrapper { position: absolute; top: -16px; right: -16px; z-index: 10; }
    .modal-close {
      width: 48px; height: 48px; border-radius: 50%;
      background: #ff4757; color: #fff; border: 4px solid var(--ww-border);
      font-size: 28px; font-weight: 900; cursor: pointer; display: flex;
      align-items: center; justify-content: center; 
      box-shadow: 0 4px 0 var(--ww-border); transition: all 0.1s;
    }
    .modal-close:active { transform: translateY(4px); box-shadow: 0 0 0 var(--ww-border); }
    
    .games-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
    .game-btn {
      background: var(--ww-card-yellow); border: 4px solid var(--ww-border);
      border-radius: var(--radius); padding: 1.5rem; text-align: center;
      cursor: pointer; position: relative;
      box-shadow: 0 8px 0 var(--ww-border); transition: all 0.1s;
      font-family: inherit; color: var(--text);
    }
    .game-btn:nth-child(even) { background: var(--ww-card-orange); }
    .game-btn:nth-child(3) { background: var(--ww-btn-green); }
    .game-btn:nth-child(4) { background: var(--ww-teal-light); }
    
    .game-btn:active { transform: translateY(8px); box-shadow: 0 0 0 var(--ww-border); }
    .game-btn .icon { font-size: 40px; margin-bottom: 12px; display: inline-flex; width: 64px; height: 64px; border: 3px solid var(--ww-border); border-radius: 16px; background: #fff; align-items: center; justify-content: center; box-shadow: 0 4px 0 var(--ww-border); }
    .game-btn .icon .lucide { width: 36px; height: 36px; }
    .game-btn h3 { font-size: 22px; font-weight: 900; margin-bottom: 8px; color: var(--ww-border); }
    .game-btn p { font-size: 15px; font-weight: 700; opacity: 0.9; }

    /* Print helper */`;
html = html.replace('/* Print helper */', cssReplacement);

// 2. Replace Intervencion content
const startMarker = '<!-- Semana 1 -->';
const endMarker = '</div>\n\n\n  <!-- ════════════════════════════════════════\n  PAGE 9 — RESULTADOS';
const backupEndMarker = '</div>\n\n  <!-- ════════════════════════════════════════\n  PAGE 9 — RESULTADOS';
const newContent = `<!-- Actividades Wordwall (Clickables) -->
    <div class="note-box" style="margin-top:2rem">
      <i data-lucide="gamepad-2"></i> <strong>Juega tú también:</strong> Haz clic en los botones para interactuar con las actividades reales utilizadas en el proyecto.
    </div>

    <div class="games-grid">
      <button class="game-btn" onclick="openModal('https://wordwall.net/embed/c968e77b27e54d289bcf64d42866a972?themeId=55&templateId=38&fontStackId=12')">
        <div class="icon"><i data-lucide="paw-print"></i></div>
        <h3>Farm Animals</h3>
        <p>Semana 1 - Vocabulario de la granja</p>
      </button>

      <button class="game-btn" onclick="openModal('https://wordwall.net/embed/72a7ecfcacf04cb1a949ee2a00f631ee?themeId=27&templateId=82&fontStackId=15')">
        <div class="icon"><i data-lucide="apple"></i></div>
        <h3>Food Game</h3>
        <p>Semana 2 - Alimentos y bebidas</p>
      </button>

      <button class="game-btn" onclick="openModal('https://wordwall.net/embed/3421db303cf04a169637d43ec16c12c2?themeId=66&templateId=72&fontStackId=12')">
        <div class="icon"><i data-lucide="message-circle"></i></div>
        <h3>Have got Game</h3>
        <p>Repaso de estructuras</p>
      </button>

      <button class="game-btn" onclick="openModal('https://wordwall.net/embed/b7e7ba945121458d82c5fb4e295c2c1d?themeId=62&templateId=38&fontStackId=12')">
        <div class="icon"><i data-lucide="heart"></i></div>
        <h3>Like/Don't like</h3>
        <p>Expresar preferencias</p>
      </button>
    </div>
    
  </div>

  <!-- ════════════════════════════════════════
  PAGE 9 — RESULTADOS`;

let startIndex = html.indexOf(startMarker);
let endIndex = html.indexOf(endMarker);
if (endIndex === -1) {
    endIndex = html.indexOf(backupEndMarker);
}
if (startIndex !== -1 && endIndex !== -1) {
    html = html.substring(0, startIndex) + newContent + html.substring(endIndex + backupEndMarker.length);
} else {
    console.log("Could not find start or end markers for content replacement", { startIndex, endIndex });
}

// 3. Add Modal HTML and Script
const modalHtml = `
  <!-- MODAL FOR WORDWALL IFRAME -->
  <div id="ww-modal" class="modal-overlay" onclick="closeModal(event)">
    <div class="modal-content" onclick="event.stopPropagation()">
      <div class="modal-close-wrapper">
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <iframe id="ww-iframe" src="" width="100%" height="100%" frameborder="0" allowfullscreen style="border-radius:var(--radius-lg); background:#fff;"></iframe>
    </div>
  </div>

  <script src="https://unpkg.com/lucide@latest"></script>`;
html = html.replace('<script src="https://unpkg.com/lucide@latest"></script>', modalHtml);

const modalScript = `      window.scrollTo(0, 0);
    }

    function openModal(url) {
      document.getElementById('ww-iframe').src = url;
      document.getElementById('ww-modal').classList.add('active');
      document.body.style.overflow = 'hidden';
      if(window.lucide) window.lucide.createIcons();
    }

    function closeModal(e) {
      document.getElementById('ww-modal').classList.remove('active');
      setTimeout(() => { document.getElementById('ww-iframe').src = ''; }, 300);
      document.body.style.overflow = '';
    }
  </script>`;
html = html.replace('      window.scrollTo(0, 0);\n    }\n  </script>', modalScript);

fs.writeFileSync('blog_draft_wordwall_juego_grado1.html', html, 'utf8');
console.log('Successfully updated HTML for WordWall modals');
