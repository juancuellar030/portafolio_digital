(function () {
  var FO_Y = 28;
  var FO_BOTTOM_PAD = 32;
  var SVG_WIDTH = 312.02;
  var STAGE_PAD_PX = 40;
  var MAX_CARD_WIDTH = 680;

  function measureCard(svg, fo, inner) {
    fo.setAttribute('height', '400');

    var scale = svg.getBoundingClientRect().width / SVG_WIDTH;
    if (!scale) return null;

    var contentPx = inner.getBoundingClientRect().height;
    var foHeightSvg = Math.ceil(contentPx / scale);
    var viewBoxH = FO_Y + foHeightSvg + FO_BOTTOM_PAD;

    fo.setAttribute('height', String(foHeightSvg));
    svg.setAttribute('viewBox', '0 0 ' + SVG_WIDTH + ' ' + viewBoxH);

    return {
      scale: scale,
      viewBoxH: viewBoxH,
      renderedHeight: svg.getBoundingClientRect().height,
      renderedWidth: svg.getBoundingClientRect().width
    };
  }

  function fitCardHeight() {
    var svg = document.querySelector('.pf-intro-card-svg');
    var fo = document.querySelector('foreignObject');
    var inner = document.querySelector('.pf-intro-card-inner');
    if (!svg || !fo || !inner) return;

    svg.style.width = '';

    var maxCardHeight = window.innerHeight - STAGE_PAD_PX;
    var maxCardWidth = Math.min(MAX_CARD_WIDTH, window.innerWidth * 0.94);
    var metrics = measureCard(svg, fo, inner);
    if (!metrics) return;

    if (metrics.renderedHeight > maxCardHeight) {
      var widthFromHeight = maxCardHeight * (SVG_WIDTH / metrics.viewBoxH);
      svg.style.width = Math.floor(Math.min(widthFromHeight, maxCardWidth)) + 'px';
      measureCard(svg, fo, inner);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fitCardHeight);
  } else {
    fitCardHeight();
  }

  window.addEventListener('load', fitCardHeight);
  window.addEventListener('resize', fitCardHeight);
})();
