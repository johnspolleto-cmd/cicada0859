function computeScrubTime(progress, duration) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return clamped * duration;
}

function initVideoScrub(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const video = section.querySelector('video');
  if (!video) return;

  let scrubReady = false;

  const enableScrub = () => {
    if (scrubReady) return;
    scrubReady = true;
    video.pause();
    ScrollTrigger.create({
      trigger: section,
      pin: true,
      scrub: true,
      start: 'top top',
      end: '+=150%',
      onUpdate: (self) => {
        if (!video.duration) return;
        video.currentTime = computeScrubTime(self.progress, video.duration);
      },
    });
  };

  video.addEventListener('loadedmetadata', enableScrub, { once: true });
  video.addEventListener('error', () => {
    section.classList.add('section--poster-fallback');
  });

  if (video.readyState >= 1) {
    enableScrub();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { computeScrubTime, initVideoScrub };
}
if (typeof window !== 'undefined') {
  window.CikadaVideoScrub = { computeScrubTime, initVideoScrub };
}
