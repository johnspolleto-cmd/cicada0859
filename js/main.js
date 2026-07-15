document.addEventListener('DOMContentLoaded', () => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  gsap.registerPlugin(ScrollTrigger);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // NAV HOOKS

  if (window.CikadaVideoScrub) {
    window.CikadaVideoScrub.initVideoScrub('hero');
    window.CikadaVideoScrub.initVideoScrub('city');
  }

  if (window.CikadaSignalWave) {
    window.CikadaSignalWave.initSignalWave('signal');
  }

  // FEATURE INIT HOOKS
});
