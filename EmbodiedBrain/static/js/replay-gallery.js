(() => {
  'use strict';

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const media = new Map();
  const advanceDelay = 8000;

  function loadVideo(video) {
    const source = video.dataset.src;
    if (source && !video.hasAttribute('src')) video.setAttribute('src', source);
  }

  function updateVideo(video, state) {
    const fullscreen = document.fullscreenElement === video || video.webkitDisplayingFullscreen;
    const visible = !document.hidden && (state.visible || fullscreen);

    if (!visible) {
      if (!video.paused) {
        state.galleryPausing = true;
        video.pause();
      }
      return;
    }

    loadVideo(video);

    if (!motion.matches && video.muted && video.paused && !state.userPaused && video.hasAttribute('src')) {
      video.play()?.catch(() => { /* Native controls remain available if autoplay is blocked. */ });
    }
  }

  const videoObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const {target, isIntersecting, intersectionRatio} of entries) {
      const state = media.get(target);
      state.visible = isIntersecting && intersectionRatio >= 0.35;
      updateVideo(target, state);
    }
  }, {threshold: [0, 0.35]}) : null;

  function observeVideo(video) {
    const state = {visible: false, galleryPausing: false, userPaused: false};
    media.set(video, state);
    video.addEventListener('pause', () => {
      if (state.galleryPausing) {
        state.galleryPausing = false;
      } else if (!video.ended) {
        state.userPaused = true;
      }
    });
    video.addEventListener('play', () => { state.userPaused = false; });

    if (videoObserver) {
      videoObserver.observe(video);
    } else {
      video.addEventListener('pointerdown', () => loadVideo(video), {once: true});
      video.addEventListener('focus', () => loadVideo(video), {once: true});
    }
  }

  function syncVideos() {
    for (const [video, state] of media) updateVideo(video, state);
  }

  function setupStrip(strip) {
    const track = strip.querySelector('[data-replay-track]');
    if (!track) return;

    const cards = [...track.children];
    for (const card of cards) {
      const video = card.querySelector('video[data-src]');
      if (video) observeVideo(video);
    }

    const previous = strip.querySelector('[data-replay-prev]');
    const next = strip.querySelector('[data-replay-next]');
    const toggle = strip.querySelector('[data-replay-toggle]');
    if (!previous || !next || !toggle || cards.length < 2) return;

    const dots = strip.querySelector('[data-replay-dots]');
    let autoScroll = !motion.matches;
    let visible = false;
    let hovered = false;
    let pointer = null;
    let timer = null;
    let requestedSlide = null;
    let positions = [];
    let dotButtons = [];

    function currentSlide() {
      const left = track.scrollLeft;
      return positions.reduce((closest, position, index) =>
        Math.abs(position - left) < Math.abs(positions[closest] - left) ? index : closest, 0);
    }

    function updateControls() {
      previous.disabled = next.disabled = toggle.disabled = positions.length < 2;
      toggle.textContent = autoScroll ? 'Pause scrolling' : 'Auto-scroll';
      toggle.setAttribute('aria-pressed', String(autoScroll));
      toggle.setAttribute('aria-label', autoScroll ? 'Pause automatic scrolling' : 'Start automatic scrolling');
    }

    function updateSlideState() {
      const current = currentSlide();
      dotButtons.forEach((button, index) => button.setAttribute('aria-current', String(index === current)));
      const progress = current / Math.max(positions.length - 1, 1);
      strip.style.setProperty('--scene-pan', `${progress * 100}%`);
    }

    function mayAdvance() {
      const focused = document.activeElement;
      const hasKeyboardFocus = strip.contains(focused) && focused.matches(':focus-visible');
      return visible && autoScroll && !hovered && pointer === null && !hasKeyboardFocus &&
        !document.hidden && !document.fullscreenElement && positions.length > 1;
    }

    function scheduleAdvance() {
      if (timer !== null) window.clearTimeout(timer);
      timer = mayAdvance() ? window.setTimeout(() => {
        timer = null;
        if (mayAdvance()) move(1);
      }, advanceDelay) : null;
    }

    function showSlide(index) {
      if (positions.length < 2) return;
      const wrapped = index < 0 || index >= positions.length;
      const target = (index + positions.length) % positions.length;
      requestedSlide = target;
      track.scrollTo({
        left: positions[target],
        behavior: motion.matches || wrapped ? 'instant' : 'smooth',
      });
      if (Math.abs(track.scrollLeft - positions[target]) < 2) requestedSlide = null;
      updateSlideState();
      scheduleAdvance();
    }

    function move(direction) {
      showSlide((requestedSlide ?? currentSlide()) + direction);
    }

    function refreshSize() {
      const end = Math.max(0, track.scrollWidth - track.clientWidth);
      const first = cards[0].getBoundingClientRect().left;
      positions = [];
      for (const card of cards) {
        const left = Math.min(end, Math.round(card.getBoundingClientRect().left - first));
        if (!positions.length || left - positions[positions.length - 1] > 1) positions.push(left);
      }

      if (dots && dotButtons.length !== positions.length) {
        dotButtons = positions.map((_, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'replay-dot';
          button.dataset.replayDot = String(index);
          button.setAttribute('aria-label', 'Show slide ' + (index + 1) + ' of ' + positions.length);
          button.addEventListener('click', () => showSlide(index));
          return button;
        });
        dots.replaceChildren(...dotButtons);
      }
      requestedSlide = null;
      updateControls();
      updateSlideState();
      scheduleAdvance();
    }

    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    toggle.addEventListener('click', () => {
      autoScroll = !autoScroll;
      updateControls();
      scheduleAdvance();
    });

    track.addEventListener('keydown', event => {
      if (event.target !== track) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key === 'ArrowLeft' ? -1 : 1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        showSlide(event.key === 'Home' ? 0 : positions.length - 1);
      }
    });

    strip.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') {
        hovered = true;
        scheduleAdvance();
      }
    });
    strip.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse') {
        hovered = false;
        scheduleAdvance();
      }
    });
    track.addEventListener('pointerdown', event => {
      pointer = event.pointerId;
      requestedSlide = null;
      scheduleAdvance();
    });
    function releasePointer(event) {
      if (pointer === event.pointerId) {
        pointer = null;
        scheduleAdvance();
      }
    }
    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer);
    track.addEventListener('wheel', () => {
      requestedSlide = null;
      scheduleAdvance();
    }, {passive: true});
    track.addEventListener('scroll', () => {
      if (requestedSlide !== null && Math.abs(track.scrollLeft - positions[requestedSlide]) < 2) requestedSlide = null;
      updateSlideState();
      scheduleAdvance();
    }, {passive: true});
    strip.addEventListener('focusin', scheduleAdvance);
    strip.addEventListener('focusout', () => queueMicrotask(scheduleAdvance));
    document.addEventListener('visibilitychange', scheduleAdvance);
    document.addEventListener('fullscreenchange', scheduleAdvance);
    motion.addEventListener('change', () => {
      if (motion.matches) autoScroll = false;
      updateControls();
      scheduleAdvance();
    });

    if ('ResizeObserver' in window) {
      new ResizeObserver(refreshSize).observe(track);
    } else {
      window.addEventListener('resize', refreshSize);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
        scheduleAdvance();
      }, {threshold: 0.1}).observe(track);
    } else {
      autoScroll = false;
    }

    strip.dataset.enhanced = '';
    refreshSize();
  }

  for (const strip of document.querySelectorAll('[data-replay-strip]')) setupStrip(strip);
  document.addEventListener('visibilitychange', syncVideos);
  document.addEventListener('fullscreenchange', syncVideos);
  motion.addEventListener('change', syncVideos);
})();
