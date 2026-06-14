const fs = require('fs');
let html = fs.readFileSync('blog_draft_wordwall_juego_grado1.html', 'utf8');

const emap = {
    '🎮': 'gamepad-2', '🎯': 'target', '🌟': 'star', '🎲': 'dices', '🏆': 'trophy', '🚀': 'rocket',
    '💡': 'lightbulb', '🔍': 'search', '⚡': 'zap', '⬆': 'arrow-up', '⬇': 'arrow-down', '❓': 'help-circle',
    '📍': 'map-pin', '🗺️': 'map', '🗺': 'map', '🏫': 'school', '👥': 'users', '📚': 'book-open', '🧱': 'boxes',
    '🏅': 'award', '🔥': 'flame', '💻': 'laptop', '⏱️': 'timer', '⏱': 'timer', '❤️': 'heart', '🔄': 'refresh-cw',
    '📱': 'smartphone', '🎨': 'palette', '🔒': 'lock', '🔬': 'microscope', '🐄': 'paw-print', '🍎': 'apple',
    '🗣️': 'message-circle', '🗣': 'message-circle', '📓': 'book', '📊': 'bar-chart-2', '😄': 'smile', '😊': 'smile', '😐': 'meh',
    '😟': 'frown', '😢': 'frown', '✅': 'check-circle', '🔧': 'wrench', '🌍': 'globe', '👧': 'user',
    '👩‍🏫': 'graduation-cap', '👨‍👩‍👧': 'users', '🏛️': 'landmark', '🏛': 'landmark'
};

for (const [emoji, icon] of Object.entries(emap)) {
    html = html.split(emoji).join(`<i data-lucide="${icon}"></i>`);
}

if (!html.includes('.lucide {')) {
    html = html.replace('</style>', `
  .lucide { width: 1.2em; height: 1.2em; vertical-align: middle; display: inline-block; }
  .section-icon .lucide { width: 1.5em; height: 1.5em; }
  .hero::before { content: ''; }
</style>`);
}

// Add script at the end
if (!html.includes('lucide.min.js') && !html.includes('lucide@latest')) {
    html = html.replace('</body>', `<script src="https://unpkg.com/lucide@latest"></script>\n<script>lucide.createIcons();</script>\n</body>`);
}

fs.writeFileSync('blog_draft_wordwall_juego_grado1.html', html, 'utf8');
console.log('Emojis replaced successfully');
