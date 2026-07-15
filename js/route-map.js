function computeCheckpointDelay(index, total, baseDelay) {
  if (total <= 1) return 0;
  return (index / (total - 1)) * baseDelay;
}

function initRouteMap(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const path = section.querySelector('.route__path');
  const points = Array.from(section.querySelectorAll('.route__point'));
  if (!path) return;

  const length = path.getTotalLength();
  path.style.strokeDasharray = String(length);
  path.style.strokeDashoffset = String(length);

  if (window.CikadaReducedMotion) {
    path.style.strokeDashoffset = '0';
    points.forEach((point) => {
      gsap.set(point, { autoAlpha: 1 });
    });
    return;
  }

  gsap.to(path, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
      end: 'bottom 40%',
      scrub: true,
    },
  });

  points.forEach((point, i) => {
    const delay = computeCheckpointDelay(i, points.length, 0.6);
    gsap.to(point, {
      autoAlpha: 1,
      duration: 0.5,
      delay,
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
      },
    });
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { computeCheckpointDelay, initRouteMap };
}
if (typeof window !== 'undefined') {
  window.CikadaRouteMap = { computeCheckpointDelay, initRouteMap };
}
