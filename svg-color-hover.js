(function () {
  'use strict';

  var POSITION_CLASSES = [
    'ill-bubble', 'bubble1', 'bubble2', 'bubble3', 'bubble4'
  ];

  function coloredSrcFrom(src) {
    if (!src || src.indexOf('_colored') !== -1) return null;
    return src.replace(/\.svg(\?.*)?$/i, '_colored.svg$1');
  }

  function wrapImage(img, options) {
    if (!img || img.closest('.svg-color-hover') || img.classList.contains('svg-color-hover__base')) {
      return null;
    }

    var coloredSrc = img.dataset.coloredSrc || coloredSrcFrom(img.getAttribute('src'));
    if (!coloredSrc) return null;

    var wrap = document.createElement('span');
    wrap.className = 'svg-color-hover';

    if (options && options.transferPositionClasses) {
      POSITION_CLASSES.forEach(function (cls) {
        if (img.classList.contains(cls)) {
          wrap.classList.add(cls);
          img.classList.remove(cls);
        }
      });
    }

    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    img.classList.add('svg-color-hover__base');

    var colored = document.createElement('img');
    colored.className = 'svg-color-hover__color';
    colored.src = coloredSrc;
    colored.alt = '';
    colored.setAttribute('aria-hidden', 'true');
    colored.addEventListener('error', function () {
      colored.remove();
    });
    wrap.appendChild(colored);

    return wrap;
  }

  function initSvgColorHover(selector, options) {
    document.querySelectorAll(selector).forEach(function (img) {
      wrapImage(img, options || {});
    });
  }

  function boot() {
    initSvgColorHover('.ill-bubble', { transferPositionClasses: true });
    initSvgColorHover('.lake-item__img');
    initSvgColorHover('.info-item img');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
