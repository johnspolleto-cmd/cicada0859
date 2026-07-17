document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Lenis === 'undefined') {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.visibility = 'visible';
    });
    document.querySelectorAll('.route__point').forEach((el) => {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });
    if (window.CikadaMatrixCicada) {
      window.CikadaMatrixCicada.initMatrixCicada('hero');
    }
    return;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  gsap.registerPlugin(ScrollTrigger);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.CikadaReducedMotion = prefersReducedMotion;

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('.reveal').forEach((el) => {
    if (prefersReducedMotion) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }
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

  const loginLink = document.querySelector('.nav__login');
  if (loginLink) {
    loginLink.addEventListener('click', (event) => event.preventDefault());
  }

  document.querySelectorAll('a[href^="#"]:not(.nav__login)').forEach((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      lenis.scrollTo(target, { duration: prefersReducedMotion ? 0 : 1.4 });
    });
  });

  if (window.CikadaVideoScrub) {
    window.CikadaVideoScrub.initVideoScrub('hero');
    window.CikadaVideoScrub.initVideoScrub('city');
  }

  if (window.CikadaMatrixCicada) {
    window.CikadaMatrixCicada.initMatrixCicada('hero');
  }

  if (window.CikadaSignalWave) {
    window.CikadaSignalWave.initSignalWave('signal');
  }

  if (window.CikadaRouteMap) {
    window.CikadaRouteMap.initRouteMap('route');
  }

  if (window.CikadaWaitlistForm) {
    window.CikadaWaitlistForm.initWaitlistForm('waitlist-form');
  }

  // FEATURE INIT HOOKS
});
