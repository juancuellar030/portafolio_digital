/* ============================================
   FLIPBOOK — Interactive JS Engine
   Page turning, drag, audio visualizer, PDF
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const scene = document.getElementById('flipbook-scene');
    const book = document.getElementById('flipbook');
    const leaves = Array.from(document.querySelectorAll('.fb-leaf'));
    const prevBtn = document.getElementById('fb-prev');
    const nextBtn = document.getElementById('fb-next');

    if (!book || leaves.length === 0) return;

    const totalLeaves = leaves.length;
    let currentLeaf = 0; // index of next leaf to turn (0 = cover showing)

    // ================================================
    // PAGE TURN ENGINE
    // ================================================

    function playFlipSound() {
        const audio = document.getElementById('page-flip-audio');
        if (audio) {
            audio.currentTime = 0; // Rewind
            audio.play().catch(e => { }); // Ignore play errors on un-interacted pages
        }
    }

    function updateState() {
        // Scene centering: closed when showing just cover or just back
        if (currentLeaf === 0) {
            scene.classList.add('closed');
            scene.classList.remove('back-closed');
        } else if (currentLeaf === totalLeaves) {
            scene.classList.add('back-closed');
            scene.classList.remove('closed');
        } else {
            scene.classList.remove('closed', 'back-closed');
        }

        // Z-index management
        leaves.forEach((leaf, i) => {
            if (i < currentLeaf) {
                // Turned leaves: later turns on top
                leaf.style.zIndex = i + 1;
            } else {
                // Unturned leaves: earlier on top
                leaf.style.zIndex = totalLeaves - i;
            }
        });

        // Nav button states
        prevBtn.disabled = (currentLeaf === 0);
        nextBtn.disabled = (currentLeaf === totalLeaves);
    }

    function turnNext() {
        if (currentLeaf >= totalLeaves) return;
        const leaf = leaves[currentLeaf];
        leaf.classList.add('turned');
        currentLeaf++;
        updateState();
        playFlipSound();
    }

    function turnPrev() {
        if (currentLeaf <= 0) return;
        currentLeaf--;
        const leaf = leaves[currentLeaf];
        leaf.classList.remove('turned');
        updateState();
        playFlipSound();
    }

    // Nav buttons
    nextBtn.addEventListener('click', turnNext);
    prevBtn.addEventListener('click', turnPrev);

    // Click on leaf to turn
    leaves.forEach((leaf, i) => {
        leaf.addEventListener('click', (e) => {
            // Don't turn if clicking interactive elements inside pages
            if (e.target.closest('a, button, iframe, audio, video, .fb-social-btn, .podcast-play-btn, .fb-doodle-btn')) return;

            if (leaf.classList.contains('turned')) {
                // Click on a turned page = go back
                if (i === currentLeaf - 1) turnPrev();
            } else {
                // Click on unturned page = go forward
                if (i === currentLeaf) turnNext();
            }
        });
    });

    // ================================================
    // DRAG TO TURN
    // ================================================

    let dragLeaf = null;
    let dragStartX = 0;
    let isDragging = false;
    const pageWidth = () => book.offsetWidth / 2;

    function onDragStart(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;

        // Determine which leaf to drag
        const bookRect = book.getBoundingClientRect();
        const midX = bookRect.left + bookRect.width / 2;

        if (clientX > midX && currentLeaf < totalLeaves) {
            // Dragging from right side = turn next
            dragLeaf = { el: leaves[currentLeaf], direction: 'next' };
        } else if (clientX <= midX && currentLeaf > 0) {
            // Dragging from left side = turn prev
            dragLeaf = { el: leaves[currentLeaf - 1], direction: 'prev' };
        } else {
            return;
        }

        isDragging = true;
        dragStartX = clientX;
        dragLeaf.el.classList.add('turning');
        e.preventDefault();
    }

    function onDragMove(e) {
        if (!isDragging || !dragLeaf) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const delta = clientX - dragStartX;
        const pw = pageWidth();
        let angle;

        if (dragLeaf.direction === 'next') {
            // Dragging left to turn forward: 0 → -180
            angle = Math.max(-180, Math.min(0, (delta / pw) * -180));
        } else {
            // Dragging right to turn back: -180 → 0
            angle = Math.max(-180, Math.min(0, -180 + (delta / pw) * 180));
        }

        dragLeaf.el.style.transform = `rotateY(${angle}deg)`;
    }

    function onDragEnd() {
        if (!isDragging || !dragLeaf) return;
        isDragging = false;
        dragLeaf.el.classList.remove('turning');

        // Get current rotation
        const style = getComputedStyle(dragLeaf.el);
        const matrix = new DOMMatrix(style.transform);
        // Approximate Y rotation from matrix
        const angle = Math.atan2(-matrix.m31, matrix.m33) * (180 / Math.PI);

        if (dragLeaf.direction === 'next') {
            if (angle < -90) {
                dragLeaf.el.style.transform = '';
                turnNext();
            } else {
                dragLeaf.el.style.transform = '';
                // Snap back — no state change
            }
        } else {
            if (angle > -90) {
                dragLeaf.el.style.transform = '';
                turnPrev();
            } else {
                dragLeaf.el.style.transform = '';
            }
        }

        dragLeaf = null;
    }

    book.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    book.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('touchmove', onDragMove, { passive: true });
    document.addEventListener('touchend', onDragEnd);

    // ================================================
    // KEYBOARD NAVIGATION
    // ================================================
    document.addEventListener('keydown', (e) => {
        // Only respond if flipbook is in view
        const rect = scene.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') turnNext();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') turnPrev();
    });

    // ================================================
    // SCROLL-TRIGGERED ENTRANCE (GSAP)
    // ================================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const viewport = document.getElementById('flipbook-viewport');
        gsap.from(viewport, {
            y: 80,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: viewport,
                start: 'top 85%',
                once: true,
            }
        });
    }

    // Initialize
    updateState();

    // ================================================
    // EXPAND VIEW TOGGLE
    // ================================================
    const expandBtn = document.getElementById('fb-toggle-expand');
    const expandText = document.getElementById('fb-expand-text');
    const viewport = document.getElementById('flipbook-viewport');
    const navbar = document.getElementById('navbar');
    let isExpanded = false;

    if (expandBtn && viewport && navbar) {
        expandBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            viewport.classList.toggle('flipbook-expanded', isExpanded);

            if (isExpanded) {
                expandText.textContent = 'Reducir Vista';
                expandBtn.querySelector('i').classList.replace('fa-expand', 'fa-compress');

                // Hide navbar
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.transition = 'transform 0.4s ease';

                // Scroll to center viewport
                setTimeout(() => {
                    viewport.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 50);

            } else {
                expandText.textContent = 'Ampliar Vista';
                expandBtn.querySelector('i').classList.replace('fa-compress', 'fa-expand');

                // Show navbar
                navbar.style.transform = '';
            }

            // Adjust flipbook scene transformation correctly after resize
            setTimeout(updateState, 350);
        });

        // Observer to unhide header if flipbook is out of view while expanded
        const observer = new IntersectionObserver((entries) => {
            if (isExpanded) {
                if (!entries[0].isIntersecting) {
                    navbar.style.transform = ''; // Show if scrolled away
                } else {
                    navbar.style.transform = 'translateY(-100%)'; // Hide if in view
                }
            }
        }, { threshold: 0.1 });
        observer.observe(viewport);
    }

    // ================================================
    // PODCAST AUDIO PLAYER + VISUALIZER
    // ================================================
    const podcastAudio = document.getElementById('podcastAudio');
    const podcastBtn = document.getElementById('podcastPlayBtn');
    const podcastIcon = document.getElementById('podcastPlayIcon');
    const vizCanvas = document.getElementById('podcast-visualizer');

    if (podcastAudio && podcastBtn && vizCanvas) {
        const vizCtx = vizCanvas.getContext('2d');
        let audioCtx, analyser, dataArray, vizRaf;
        let podcastPlaying = false;

        // Resize canvas to screen
        function resizeViz() {
            vizCanvas.width = window.innerWidth;
            vizCanvas.height = 150;
        }
        resizeViz();
        window.addEventListener('resize', resizeViz);

        function setupPodcastAudio() {
            if (audioCtx) return;
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaElementSource(podcastAudio);
            analyser = audioCtx.createAnalyser();

            // Adjust this to change the number of bars (must be a power of 2: 64, 128, 256, 512)
            // Higher number = more, thinner bars | Lower number = fewer, thicker bars
            analyser.fftSize = 256;

            dataArray = new Uint8Array(analyser.frequencyBinCount);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
        }

        // Doodle-style bar visualizer
        const barColors = ['#a29bfe'];

        function drawViz() {
            vizRaf = requestAnimationFrame(drawViz);
            analyser.getByteFrequencyData(dataArray);

            vizCtx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);

            // Voice audio mainly occupies lower frequencies, so we skip the empty higher bins 
            // to make sure the active bars stretch across the entire screen width.
            const barCount = Math.floor(dataArray.length * 0.75);
            const barWidth = vizCanvas.width / barCount;
            const maxH = vizCanvas.height - 8;

            // Adjust this multiplier to increase/decrease bar height sensitivity (1.0 is default)
            const sensitivity = 1.2;

            // Adjust this for bar transparency (0.0 is invisible, 1.0 is solid opaque)
            vizCtx.globalAlpha = 0.6;

            for (let i = 0; i < barCount; i++) {
                const val = Math.min(1, (dataArray[i] / 255) * sensitivity);
                const h = val * maxH;
                const x = i * barWidth;
                const y = vizCanvas.height - h;

                // Rectangle bars with doodle colors
                vizCtx.fillStyle = barColors[i % barColors.length];
                vizCtx.fillRect(x + 1, y, barWidth - 2, h);
            }
        }

        function playPodcast() {
            setupPodcastAudio();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            podcastAudio.play();
            podcastPlaying = true;
            podcastBtn.classList.add('playing');
            podcastIcon.classList.replace('fa-play', 'fa-pause');
            vizCanvas.classList.add('active');
            drawViz();
        }

        function pausePodcast() {
            podcastAudio.pause();
            podcastPlaying = false;
            podcastBtn.classList.remove('playing');
            podcastIcon.classList.replace('fa-pause', 'fa-play');
            cancelAnimationFrame(vizRaf);
            vizCanvas.classList.remove('active');
        }

        podcastBtn.addEventListener('click', () => {
            if (!podcastPlaying) playPodcast();
            else pausePodcast();
        });

        podcastAudio.addEventListener('ended', () => {
            pausePodcast();
        });
    }

    // ================================================
    // PDF EXPORT
    // ================================================
    const downloadBtn = document.getElementById('fb-download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            downloadBtn.innerHTML = '<i class="fa-solid fa-hourglass-half"></i> Generando PDF...';
            downloadBtn.disabled = true;

            try {
                // Lazy-load libraries
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

                const { jsPDF } = window.jspdf;
                const pageW = 370;
                const pageH = 493;
                const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [pageW, pageH] });

                // Collect all faces in reading order
                const faces = [];
                leaves.forEach(leaf => {
                    const front = leaf.querySelector('.fb-front');
                    const back = leaf.querySelector('.fb-back');
                    if (front) faces.push(front);
                    if (back) faces.push(back);
                });

                for (let i = 0; i < faces.length; i++) {
                    const face = faces[i];
                    // Temporarily make face visible for capture
                    const origTransform = face.style.transform;
                    const origVis = face.style.backfaceVisibility;
                    face.style.transform = 'none';
                    face.style.backfaceVisibility = 'visible';

                    const canvas = await html2canvas(face, {
                        width: pageW,
                        height: pageH,
                        scale: 2,
                        useCORS: true,
                        backgroundColor: '#fdfaf5'
                    });

                    face.style.transform = origTransform;
                    face.style.backfaceVisibility = origVis;

                    if (i > 0) pdf.addPage();
                    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pageW, pageH);

                    // Add clickable interactive links to the PDF
                    const links = face.querySelectorAll('a[href]');
                    links.forEach(link => {
                        const rect = link.getBoundingClientRect();
                        const faceRect = face.getBoundingClientRect();

                        const x = ((rect.left - faceRect.left) / faceRect.width) * pageW;
                        const y = ((rect.top - faceRect.top) / faceRect.height) * pageH;
                        const w = (rect.width / faceRect.width) * pageW;
                        const h = (rect.height / faceRect.height) * pageH;

                        pdf.link(x, y, w, h, { url: link.href });
                    });
                }

                pdf.save('Marco_de_Referencia_Ebook.pdf');
            } catch (err) {
                console.error('PDF export error:', err);
                alert('Error al generar el PDF. Intenta de nuevo.');
            }

            downloadBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Descargar como PDF';
            downloadBtn.disabled = false;
        });
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

});
