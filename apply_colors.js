const fs = require('fs');
let html = fs.readFileSync('blog_draft_wordwall_juego_grado1.html', 'utf8');

// 1. Add colors
if (!html.includes('--ww-card-cyan')) {
    html = html.replace('--ww-card-orange: #fdb631;', `--ww-card-orange: #fdb631;
      --ww-card-cyan: #7cecf6;
      --ww-card-pink: #f897df;
      --ww-card-lime: #b0f566;`);
}

// 2. Replace card specific styling
const oldCardStyling = `    /* Different backgrounds for visual variety */
    .card:nth-child(even) {
      background: var(--ww-card-orange);
    }`;
const newCardStyling = `    /* Different backgrounds for visual variety */
    .card:nth-child(5n+1), .level-card:nth-child(5n+1), .theory-strip:nth-child(5n+1), .author-card:nth-child(5n+1) { background: var(--ww-card-yellow); }
    .card:nth-child(5n+2), .level-card:nth-child(5n+2), .theory-strip:nth-child(5n+2), .author-card:nth-child(5n+2) { background: var(--ww-card-cyan); }
    .card:nth-child(5n+3), .level-card:nth-child(5n+3), .theory-strip:nth-child(5n+3), .author-card:nth-child(5n+3) { background: var(--ww-card-pink); }
    .card:nth-child(5n+4), .level-card:nth-child(5n+4), .theory-strip:nth-child(5n+4), .author-card:nth-child(5n+4) { background: var(--ww-card-lime); }
    .card:nth-child(5n+5), .level-card:nth-child(5n+5), .theory-strip:nth-child(5n+5), .author-card:nth-child(5n+5) { background: var(--ww-card-orange); }`;

html = html.replace(oldCardStyling, newCardStyling);

// 3. Replace game-btn styling
const oldBtnRegex = /\.game-btn:nth-child\(even\) \{ background: var\(--ww-card-orange\); \}\s*\.game-btn:nth-child\(3\) \{ background: var\(--ww-btn-green\); \}\s*\.game-btn:nth-child\(4\) \{ background: var\(--ww-teal-light\); \}/;
const newBtnStyling = `.game-btn:nth-child(1) { background: var(--ww-card-yellow); }
    .game-btn:nth-child(2) { background: var(--ww-card-cyan); }
    .game-btn:nth-child(3) { background: var(--ww-card-pink); }
    .game-btn:nth-child(4) { background: var(--ww-card-lime); }`;

html = html.replace(oldBtnRegex, newBtnStyling);

fs.writeFileSync('blog_draft_wordwall_juego_grado1.html', html, 'utf8');
console.log('Colors successfully updated');
