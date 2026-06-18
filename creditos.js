(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initParallax() {
    if (prefersReducedMotion) return;

    const bg = document.getElementById('crParallaxBg');
    if (!bg) return;

    const factor = 0.38;
    let ticking = false;

    function layoutParallaxBg() {
      const vh = window.innerHeight;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
      const travel = maxScroll * factor;
      const bleed = vh * 0.22;
      bg.style.top = `-${bleed}px`;
      bg.style.height = `${vh + travel + bleed * 2}px`;
    }

    function update() {
      layoutParallaxBg();
      bg.style.transform = `translate3d(0, ${-window.scrollY * factor}px, 0)`;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    function onResize() {
      update();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onResize, { passive: true });
    }
    update();
  }

  function initDoodleSettle() {
    document.querySelectorAll('.cr-doodle').forEach((el) => {
      const settle = () => {
        if (el.classList.contains('cr-doodle--ready')) return;
        el.classList.add('cr-doodle--ready');
      };

      el.addEventListener('animationend', (e) => {
        if (e.animationName === 'crDoodlePop' || e.animationName === 'crDoodlePopMedal') {
          settle();
        }
      });

      if (getComputedStyle(el).opacity === '1' && getComputedStyle(el).animationName === 'none') {
        settle();
      }
    });
  }

  function initReveals() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.cr-reveal, .cr-reveal-left, .cr-reveal-right, .cr-reveal-scale, .cr-reveal-up')
        .forEach((el) => el.classList.add('visible'));
      return;
    }

    const revealSelectors = '.cr-reveal, .cr-reveal-left, .cr-reveal-right, .cr-reveal-scale, .cr-reveal-up';
    const reveals = document.querySelectorAll(revealSelectors);

    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  initParallax();
  initDoodleSettle();
  initReveals();
})();
