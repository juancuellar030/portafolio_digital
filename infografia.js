// infografia.js

document.addEventListener('DOMContentLoaded', () => {
    const infoData = {
        anchor: {
            title: "El Ancla<br><span class='info-subtitle'>Enfoque de Investigación</span>",
            text: "<strong>Enfoque Cuantitativo:</strong> Esta investigación se fundamenta en la recolección y el análisis sistemático de datos numéricos para garantizar la objetividad, comparabilidad y validez técnica de los resultados pedagógicos obtenidos."
        },
        prism: {
            title: "El Prisma de Cristal<br><span class='info-subtitle'>Modelo de Investigación</span>",
            text: "<strong>Investigación Evaluativa:</strong> Más allá de describir, este modelo busca emitir juicios de valor sobre la eficacia de la intervención con Wordwall, determinando cómo la praxis docente transforma realmente el desempeño comunicativo."
        },
        jellyfish: {
            title: "Medusas<br><span class='info-subtitle'>Tipo de Investigación</span>",
            text: "<strong>Diseño Pre-experimental:</strong> La ruta sigue una secuencia de tres momentos: Observación Inicial (Pre-test), Tratamiento (Intervención gamificada) y Observación Final (Post-test) para contrastar los cambios tras el uso de la tecnología."
        },
        school: {
            title: "Cardumen de Peces<br><span class='info-subtitle'>Población y Muestra</span>",
            text: "<strong>Muestra Censal:</strong> El estudio se realiza con 40 estudiantes de 6 y 7 años del Colegio Colombo Inglés. Al ser una población finita y accesible, se trabaja con el 100% de los niños para eliminar errores de muestreo."
        },
        seashell: {
            title: "La Concha Marina<br><span class='info-subtitle'>Técnicas e Instrumentos</span>",
            text: "<strong>Recolección de Datos:</strong> Utilizamos la Prueba Objetiva (Cédula de Test) para medir el rendimiento académico y el Cuestionario con Escala Likert pictográfica para captar la percepción y el compromiso de los niños con el juego."
        },
        chest: {
            title: "Cofre del Tesoro<br><span class='info-subtitle'>Estrategia Pedagógica</span>",
            text: "<strong>Aprendizaje Basado en Secuencias Didácticas (ABSD):</strong> Es el motor de la intervención donde el juego y Wordwall convergen para catalizar la motivación intrínseca y convertir el esfuerzo académico en una experiencia gratificante."
        },
        bubbles: {
            title: "Burbujas<br><span class='info-subtitle'>Variables del Estudio</span>",
            text: "<strong>Interacción de Variables:</strong> La Variable Independiente es nuestra estrategia gamificada mediada por Wordwall; la Variable Dependiente es el rendimiento académico en la competencia comunicativa de los estudiantes."
        }
    };

    const displayEl = document.querySelector('.content-display');
    const titleEl = document.getElementById('info-title');
    const descEl = document.getElementById('info-desc');
    const items = document.querySelectorAll('.info-item');
    const stageEl = document.querySelector('.info-stage');

    const defaultTitle = "Explora la Investigación";
    const defaultDesc = "Pasa el cursor o toca los elementos marinos para descubrir cada componente del diseño metodológico.";

    const SWAP_MS = 260;
    const REVERT_MS = 320;

    let swapTimer = null;
    let revertTimer = null;
    let pendingTitle = defaultTitle;
    let pendingDesc = defaultDesc;

    items.forEach((item) => {
        item.addEventListener('mouseenter', () => {
            cancelRevert();
            const id = item.getAttribute('data-id');
            if (infoData[id]) {
                updateDisplay(infoData[id].title, infoData[id].text);
            }
        });

        item.addEventListener('click', () => {
            cancelRevert();
            const id = item.getAttribute('data-id');
            if (infoData[id]) {
                updateDisplay(infoData[id].title, infoData[id].text);
            }
        });
    });

    if (stageEl) {
        stageEl.addEventListener('mouseleave', (event) => {
            if (!stageEl.contains(event.relatedTarget)) {
                scheduleRevert();
            }
        });
    }

    function cancelRevert() {
        clearTimeout(revertTimer);
    }

    function scheduleRevert() {
        cancelRevert();
        revertTimer = setTimeout(() => {
            if (isAnyBubbleHovered()) {
                return;
            }
            updateDisplay(defaultTitle, defaultDesc);
        }, REVERT_MS);
    }

    function isAnyBubbleHovered() {
        return [...items].some((item) => item.matches(':hover'));
    }

    function updateDisplay(newTitle, newDesc) {
        pendingTitle = newTitle;
        pendingDesc = newDesc;

        if (titleEl.innerHTML === newTitle && descEl.innerHTML === newDesc) {
            return;
        }

        if (swapTimer || displayEl.classList.contains('fade-out')) {
            return;
        }

        beginSwap();
    }

    function beginSwap() {
        displayEl.classList.remove('fade-in');
        displayEl.classList.add('fade-out');

        swapTimer = setTimeout(finishSwap, SWAP_MS);
    }

    function finishSwap() {
        titleEl.innerHTML = pendingTitle;
        descEl.innerHTML = pendingDesc;
        displayEl.classList.remove('fade-out');
        displayEl.classList.add('fade-in');

        swapTimer = null;

        const needsAnotherSwap =
            titleEl.innerHTML !== pendingTitle || descEl.innerHTML !== pendingDesc;

        if (needsAnotherSwap) {
            beginSwap();
        }
    }
});
