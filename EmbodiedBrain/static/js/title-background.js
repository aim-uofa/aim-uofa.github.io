(() => {
  'use strict';

  const video = document.querySelector('[data-title-background]');
  const toggle = document.querySelector('[data-title-motion]');
  if (!video || !toggle) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = !('IntersectionObserver' in window);
  let userPaused = false;

  function syncPlayback() {
    if (motion.matches || document.hidden || !visible || userPaused) {
      video.pause();
      return;
    }

    if (!video.hasAttribute('src')) video.setAttribute('src', video.dataset.src);
    if (video.paused) video.play().catch(() => { /* The poster stays visible if autoplay is blocked. */ });
  }

  video.addEventListener('playing', () => {
    video.dataset.ready = '';
    toggle.hidden = false;
  }, {once: true});

  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    toggle.toggleAttribute('data-paused', userPaused);
    const label = userPaused ? 'Play background video' : 'Pause background video';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    syncPlayback();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.14;
      syncPlayback();
    }, {threshold: [0, 0.14]});
    observer.observe(video);
  }

  document.addEventListener('visibilitychange', syncPlayback);
  motion.addEventListener('change', syncPlayback);
  syncPlayback();
})();
