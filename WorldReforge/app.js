'use strict';
(() => {
  const cases = window.WR_CASES;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const players = [];
  const icon = playing => playing ? '<path d="M7 5h4v14H7zm7 0h4v14h-4z"/>' : '<path d="m8 5 11 7-11 7z"/>';
  class ComparisonPlayer {
    constructor(root) {
      this.root = root;
      this.video = root.querySelector('video');
      this.video.muted = true;
      this.image = root.querySelector('.frame-image');
      this.slider = root.querySelector('input[type=range]');
      this.output = root.querySelector('output');
      this.button = root.querySelector('.play-button');
      this.speed = root.querySelector('select');
      this.error = root.querySelector('.media-error');
      this.inspect = false; this.visible = false; this.userPaused = false;
      this.button.addEventListener('click', () => this.toggle());
      this.slider.addEventListener('input', () => this.seek(Number(this.slider.value)));
      this.speed.addEventListener('change', () => {this.video.playbackRate = Number(this.speed.value);});
      this.video.addEventListener('play', () => this.updateButton());
      this.video.addEventListener('click', () => this.toggle());
      this.video.addEventListener('pause', () => this.updateButton());
      this.video.addEventListener('timeupdate', () => {
        if (!this.inspect) {this.slider.value = Math.min(16, Math.floor(this.video.currentTime * 5));this.updateOutput();}
      });
      this.video.addEventListener('error', () => {this.error.hidden = false; this.seek(0);});
      this.root.addEventListener('keydown', event => {
        if (event.target.matches('input,select,button,a')) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {event.preventDefault();this.seek(Math.min(16, Math.max(0, Number(this.slider.value) + (event.key === 'ArrowRight' ? 1 : -1))));}
      });
      players.push(this);
    }
    load(item, autoplay = false) {
      this.pause(); this.item = item; this.inspect = false;
      this.image.hidden = true; this.image.removeAttribute('src');
      this.error.hidden = true; this.slider.value = 0; this.updateOutput();
      this.video.poster = item.poster; this.video.src = item.video; this.video.load();
      this.video.playbackRate = Number(this.speed.value);
      if (autoplay && !reducedMotion) this.play();
    }
    updateOutput() {this.output.textContent = `Frame ${this.slider.value} / 16`; this.slider.setAttribute('aria-valuetext', this.output.textContent);}
    updateButton() {const playing = !this.video.paused;this.button.querySelector('svg').innerHTML = icon(playing);this.button.querySelector('span').textContent = playing ? 'Pause' : 'Play';this.button.setAttribute('aria-label', playing ? 'Pause comparison' : 'Play comparison');}
    seek(frame) {this.userPaused = true;this.pause();this.inspect = true;this.slider.value = frame;this.updateOutput();this.image.src = this.item.frames[frame];this.image.alt = `${this.item.title}: Ground truth, Pretrained, and WorldReforge at frame ${frame}`;this.image.hidden = false;if (Number.isFinite(this.video.duration)) this.video.currentTime = frame / 5;}
    pause() {this.video.pause();}
    play() {this.inspect = false;this.image.hidden = true;if (this.video.currentTime >= 3.2) this.video.currentTime = 0;return this.video.play().catch(() => this.updateButton());}
    toggle() {this.userPaused = !this.video.paused;if (this.video.paused) this.play();else this.pause();}
  }


  const card = c => `<article class="case-card" data-id="${c.id}"><div class="comparison inline-comparison" tabindex="0" aria-label="${c.title} video comparison"><div class="card-model-labels"><span>Ground truth</span><span>Pretrained</span><span>WorldReforge</span></div><div class="media-stage"><video aria-label="${c.title}: Ground truth, Pretrained, WorldReforge" loop muted playsinline preload="none" poster="${c.poster}"></video><img alt="Comparison at the selected frame" class="frame-image" hidden><div class="media-error" hidden>Video unavailable. Use the frame slider.</div></div><div class="playback-controls"><button class="play-button" aria-label="Play comparison"><svg viewBox="0 0 24 24" aria-hidden="true">${icon(false)}</svg><span>Play</span></button><input aria-label="Comparison frame" type="range" min="0" max="16" step="1" value="0"><output class="frame-number">Frame 0 / 16</output><select aria-label="Playback speed"><option value="0.5">0.5×</option><option selected value="1">1×</option><option value="2">2×</option></select></div></div><div class="card-content"><div class="card-title-row"><h3>${c.title}</h3></div></div></article>`;
  const groupText={simulation:'Simulation',real:'Real-world interactions'};
  const groupDescription={
    simulation:'Diverse object shapes and executions reveal pushing, rotation, slip, and grasping dynamics.',
    real:'Contact and grasping across DROID and Reforge-Real test transfer to real-world interactions.'
  };
  document.querySelector('#gallery').innerHTML=['simulation','real'].map(domain=>{
    const members=cases.filter(c=>domain==='simulation'?c.domain==='simulation':c.domain!=='simulation'),title=groupText[domain];
    return `<section class="domain-group" data-domain="${domain}" aria-labelledby="videos-${domain}"><div class="domain-heading"><div><h3 id="videos-${domain}">${title}</h3><p>${groupDescription[domain]}</p></div><div class="carousel-controls"><button class="button" data-autoplay aria-label="Pause ${title} automatic scrolling" aria-controls="track-${domain}">Pause</button><button class="button" data-scroll="-1" aria-label="Previous ${title} video" aria-controls="track-${domain}">Previous</button><button class="button" data-scroll="1" aria-label="Next ${title} video" aria-controls="track-${domain}">Next</button></div></div><div class="video-track" id="track-${domain}" tabindex="0" role="region" aria-label="${title} video carousel">${members.map(card).join('')}</div></section>`;
  }).join('');
  document.querySelectorAll('.domain-group').forEach(group=>{
    const track=group.querySelector('.video-track');
    const originals=[...track.children];
    if(originals.length<2){
      group.querySelector('.carousel-controls').hidden=true;
      track.classList.add('single-case');track.dataset.autoscroll='disabled';
      return;
    }
    originals.forEach(item=>{
      const clone=item.cloneNode(true);
      clone.dataset.duplicate='true';clone.setAttribute('aria-hidden','true');
      clone.querySelectorAll('button,input,select,a,[tabindex]').forEach(element=>element.tabIndex=-1);
      track.append(clone);
    });
    const toggle=group.querySelector('[data-autoplay]');
    let enabled=!reducedMotion,hovered=false,touching=false,visible=false;
    let cycle=0,step=0,previous=0,fraction=0,manualUntil=0;
    function measure(){
      step=track.children[1].offsetLeft-track.children[0].offsetLeft;
      cycle=track.children[originals.length].offsetLeft-track.children[0].offsetLeft;
    }
    function updateToggle(){
      toggle.textContent=enabled?'Pause':'Auto-scroll';
      toggle.setAttribute('aria-label',`${enabled?'Pause':'Start'} ${groupText[group.dataset.domain]} automatic scrolling`);
    }
    function wrap(){if(cycle&&track.scrollLeft>=cycle)track.scrollLeft-=cycle;}
    function move(direction){
      manualUntil=performance.now()+1000;fraction=0;
      if(direction<0&&track.scrollLeft<step)track.scrollLeft+=cycle;
      track.scrollBy({left:direction*step,behavior:reducedMotion?'instant':'smooth'});
    }
    group.querySelectorAll('[data-scroll]').forEach(button=>button.addEventListener('click',()=>move(Number(button.dataset.scroll))));
    toggle.addEventListener('click',()=>{enabled=!enabled;updateToggle();});
    group.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')hovered=true;});
    group.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse')hovered=false;});
    track.addEventListener('pointerdown',()=>{touching=true;});
    window.addEventListener('pointerup',()=>{if(touching){touching=false;manualUntil=performance.now()+1800;}});
    window.addEventListener('pointercancel',()=>{touching=false;});
    track.addEventListener('wheel',()=>{manualUntil=performance.now()+1800;},{passive:true});
    track.addEventListener('focusin',event=>{
      const item=event.target.closest('.case-card');
      if(item&&!item.dataset.duplicate&&event.target.matches(':focus-visible'))
        track.scrollLeft=item.offsetLeft-originals[0].offsetLeft;
    });
    track.addEventListener('keydown',event=>{
      if(event.target!==track)return;
      if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}
      if(event.key==='Home'||event.key==='End'){event.preventDefault();manualUntil=performance.now()+1000;track.scrollTo({left:event.key==='Home'?0:step*(originals.length-1),behavior:reducedMotion?'instant':'smooth'});}
    });
    new ResizeObserver(measure).observe(track);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:0.1}).observe(track);
    function animate(now){
      const dt=Math.min(now-previous,64);previous=now;
      const focused=group.contains(document.activeElement)&&document.activeElement.matches(':focus-visible');
      const running=enabled&&visible&&!hovered&&!touching&&!focused&&!document.hidden&&!document.body.classList.contains('modal-open')&&now>=manualUntil;
      track.dataset.autoscroll=running?'running':'paused';
      if(running){fraction+=dt*32/1000;const pixels=Math.floor(fraction);fraction-=pixels;track.scrollLeft+=pixels;}
      if(now>=manualUntil&&!touching)wrap();
      requestAnimationFrame(animate);
    }
    measure();updateToggle();requestAnimationFrame(animate);
  });
  const visibleVideos = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const player = entry.target.comparisonPlayer;
      player.visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
      if (!player.visible || document.hidden || document.body.classList.contains('modal-open')) player.pause();
      else if (!reducedMotion && !player.userPaused) player.play();
    });
  }, {threshold: [0, 0.4]});
  document.querySelectorAll('.case-card').forEach(card => {
    const root = card.querySelector('.inline-comparison');
    const player = new ComparisonPlayer(root);
    root.comparisonPlayer = player;
    player.load(cases.find(c => c.id === card.dataset.id));
    visibleVideos.observe(root);
  });
  function syncVisibleVideos() {
    players.forEach(player => {
      if (document.hidden || document.body.classList.contains('modal-open') || !player.visible) player.pause();
      else if (!reducedMotion && !player.userPaused) player.play();
    });
  }
  document.addEventListener('visibilitychange', syncVisibleVideos);
  const figureDialog=document.querySelector('#figure-viewer');
  const figureViewport=document.querySelector('.figure-viewport');
  const figureZoom=document.querySelector('#figure-zoom');
  const figureSpecs={
    teaser:{title:'WorldReforge overview',path:'assets/paper/teaser.svg',kind:'paper'},
    dataset:{title:'The Reforge dataset',path:'assets/paper/dataset.svg',kind:'paper'},
    framework:{title:'The WorldReforge framework',path:'assets/paper/framework.svg',kind:'paper'},
    cube:{title:'Rubik’s cube · unseen object',path:'assets/rgb/cube.webp',kind:'rgb'},
    marker:{title:'Marker · seen object',path:'assets/rgb/marker.webp',kind:'rgb'},
    funnel:{title:'Funnel · DROID',path:'assets/rgb/funnel.webp',kind:'rgb'},
    sprite:{title:'Sprite bottle · Reforge-Real',path:'assets/rgb/sprite.webp',kind:'rgb'}
  };
  document.querySelectorAll('button[data-figure]').forEach(button=>button.addEventListener('click',()=>{
    const name=button.dataset.figure,spec=figureSpecs[name];players.forEach(p=>p.pause());
    document.querySelector('#figure-title').textContent=spec.title;
    const im=document.querySelector('#figure-image');im.src=spec.path;im.alt=button.querySelector('img').alt;
    figureViewport.dataset.figure=name;figureViewport.dataset.kind=spec.kind;figureViewport.classList.remove('zoomed');
    figureZoom.textContent='Zoom in';figureZoom.setAttribute('aria-pressed','false');
    figureDialog.showModal();figureViewport.scrollTo(0,0);document.body.classList.add('modal-open');
  }));
  figureZoom.addEventListener('click',()=>{const zoomed=figureViewport.classList.toggle('zoomed');figureZoom.textContent=zoomed?'Fit to view':'Zoom in';figureZoom.setAttribute('aria-pressed',String(zoomed));});
  document.querySelector('#close-figure').addEventListener('click',()=>figureDialog.close());
  figureDialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');syncVisibleVideos();});
  const links=[...document.querySelectorAll('.site-header nav a')];let scheduled=false;
  function updateNav(){scheduled=false;let active=links[0];for(const a of links){if(document.querySelector(a.getAttribute('href')).getBoundingClientRect().top<=150)active=a;}links.forEach(a=>{a.classList.toggle('active',a===active);if(a===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateNav);}},{passive:true});updateNav();
})();
