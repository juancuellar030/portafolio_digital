// infografia.js

document.addEventListener('DOMContentLoaded', () => {
    // Markdown content mapping based on infographic.md
    const infoData = {
        anchor: {
            title: "El Ancla<br><span style='font-size: 0.7em; opacity: 0.8;'>Enfoque de Investigación</span>",
            text: "<strong>Enfoque Cuantitativo.</strong> Esta investigación se fundamenta en la recolección y el análisis sistemático de datos numéricos para garantizar la objetividad, comparabilidad y validez técnica de los resultados pedagógicos obtenidos."
        },
        prism: {
            title: "El Prisma de Cristal<br><span style='font-size: 0.7em; opacity: 0.8;'>Modelo de Investigación</span>",
            text: "<strong>Investigación Evaluativa.</strong> Más allá de describir, este modelo busca emitir juicios de valor sobre la eficacia de la intervención con Wordwall, determinando cómo la praxis docente transforma realmente el desempeño comunicativo."
        },
        jellyfish: {
            title: "Medusas<br><span style='font-size: 0.7em; opacity: 0.8;'>Tipo de Investigación</span>",
            text: "<strong>Diseño Pre-experimental.</strong> La ruta sigue una secuencia de tres momentos: Observación Inicial (Pre-test), Tratamiento (Intervención gamificada) y Observación Final (Post-test) para contrastar los cambios tras el uso de la tecnología."
        },
        school: {
            title: "Cardumen de Peces<br><span style='font-size: 0.7em; opacity: 0.8;'>Población y Muestra</span>",
            text: "<strong>Muestra Censal.</strong> El estudio se realiza con 40 estudiantes de 6 y 7 años del Colegio Colombo Inglés. Al ser una población finita y accesible, se trabaja con el 100% de los niños para eliminar errores de muestreo."
        },
        seashell: {
            title: "La Concha Marina<br><span style='font-size: 0.7em; opacity: 0.8;'>Técnicas e Instrumentos</span>",
            text: "<strong>Recolección de Datos.</strong> Utilizamos la Prueba Objetiva (Cédula de Test) para medir el rendimiento académico y el Cuestionario con Escala Likert pictográfica para captar la percepción y el compromiso de los niños con el juego."
        },
        chest: {
            title: "Cofre del Tesoro<br><span style='font-size: 0.7em; opacity: 0.8;'>Estrategia Pedagógica</span>",
            text: "<strong>Aprendizaje Basado en Secuencias Didácticas (ABSD).</strong> Es el motor de la intervención donde el juego y Wordwall convergen para catalizar la motivación intrínseca y convertir el esfuerzo académico en una experiencia gratificante."
        },
        bubbles: {
            title: "Burbujas<br><span style='font-size: 0.7em; opacity: 0.8;'>Variables del Estudio</span>",
            text: "<strong>Interacción de Variables.</strong> La Variable Independiente es nuestra estrategia gamificada mediada por Wordwall; la Variable Dependiente es el rendimiento académico en la competencia comunicativa de los estudiantes."
        }
    };

    const displayEl = document.querySelector('.content-display');
    const titleEl = document.getElementById('info-title');
    const descEl = document.getElementById('info-desc');
    const items = document.querySelectorAll('.info-item');

    let defaultTitle = "Explora la Investigación";
    let defaultDesc = "Pasa el cursor o toca los elementos marinos para descubrir cada componente del diseño metodológico.";

    // Setup interaction
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const id = item.getAttribute('data-id');
            if (infoData[id]) {
                updateDisplay(infoData[id].title, infoData[id].text);
            }
        });

        item.addEventListener('mouseleave', () => {
            // Revert back to default with a slight delay
            updateDisplay(defaultTitle, defaultDesc);
        });

        // Touch support mapping to toggle
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            if (infoData[id]) {
                updateDisplay(infoData[id].title, infoData[id].text);
            }
        });
    });

    function updateDisplay(newTitle, newDesc) {
        if (titleEl.innerHTML === newTitle && descEl.innerHTML === newDesc) return;

        // Trigger fade out
        displayEl.classList.add('fade-out');

        // Wait for transition, then change text and fade back in
        setTimeout(() => {
            titleEl.innerHTML = newTitle;
            descEl.innerHTML = newDesc;
            displayEl.classList.remove('fade-out');
        }, 300); // 300ms matches the CSS transition time roughly
    }
});
