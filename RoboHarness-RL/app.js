'use strict';
const videos=window.GALLERY;
// Stable variety: balance datasets and scenes without moving cards on refresh.
function mixGallery(items){
  function rank(v){
    let hash=2166136261;
    for(const c of `gallery-v1:${v.id}`)hash=Math.imul(hash^c.charCodeAt(0),16777619);
    return hash>>>0;
  }
  const groups=[...new Set(items.map(v=>v.benchmark))].sort().map(key=>{
    const pending=items.filter(v=>v.benchmark===key).sort((a,b)=>rank(a)-rank(b)||a.id.localeCompare(b.id));
    const totals=new Map();
    pending.forEach(v=>totals.set(v.setting,(totals.get(v.setting)||0)+1));
    return {pending,total:pending.length,used:0,totals,sceneUsed:new Map()};
  });
  const result=[];
  while(result.length<items.length){
    const group=groups.filter(g=>g.pending.length).sort((a,b)=>
      (b.total*(result.length+1)/items.length-b.used)-(a.total*(result.length+1)/items.length-a.used))[0];
    const recent=new Set(result.slice(-8).map(v=>v.title.toLowerCase().trim()));
    const fresh=group.pending.filter(v=>!recent.has(v.title.toLowerCase().trim()));
    const candidates=fresh.length?fresh:group.pending;
    const deficit=v=>group.totals.get(v.setting)*(group.used+1)/group.total-(group.sceneUsed.get(v.setting)||0);
    const next=candidates.reduce((best,v)=>deficit(v)>deficit(best)?v:best);
    group.pending.splice(group.pending.indexOf(next),1);
    group.used++;
    group.sceneUsed.set(next.setting,(group.sceneUsed.get(next.setting)||0)+1);
    result.push(next);
  }
  return result;
}
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const state={benchmark:'all'};
let filtered=[];
const playIcon='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 4 10 6-10 6z"/></svg>';
function benchmark(v){return v.benchmark==='robotwin'?'RoboTwin 2.0':'LIBERO-Pro';}
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function card(v){
  const article=el('article','video-card');article.dataset.id=v.id;
  const media=el('div','card-media');const open=el('button','open-video');
  open.setAttribute('aria-label','Play '+v.instruction);
  const im=el('img');im.src=v.poster;im.alt='';im.loading='lazy';im.decoding='async';
  const play=el('span','play-icon');play.innerHTML=playIcon;
  open.append(im,play);open.addEventListener('click',()=>openVideo(v.id));media.append(open);
  const info=el('div','card-info');info.append(el('p','card-meta',benchmark(v)),el('h3','',v.title));
  article.append(media,info);return article;
}
function render(){
  $$('.gallery-video').forEach(v=>v.pause());
  filtered=mixGallery(videos.filter(v=>state.benchmark==='all'||v.benchmark===state.benchmark));
  const rows=Array.from({length:Math.min(3,filtered.length)},(_,i)=>{
    const row=el('div','gallery-row');
    row.setAttribute('role','group');row.setAttribute('aria-label',`Video row ${i+1}`);
    row.tabIndex=0;
    row.append(...filtered.filter((v,index)=>index%3===i).map(card));
    row.addEventListener('keydown',e=>{
      if(e.target===row&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){
        e.preventDefault();holdGalleryRow(row);row.scrollBy({left:(e.key==='ArrowRight'?1:-1)*row.clientWidth*.8,behavior:scrollBehavior()});
      }
    });
    return row;
  });
  $('#video-grid').replaceChildren(...rows);
  $('#empty').hidden=filtered.length>0;

  $$('[data-benchmark]').forEach(b=>{
    const on=b.dataset.benchmark===state.benchmark;
    b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));
  });
}
$$('[data-benchmark]').forEach(b=>b.addEventListener('click',()=>{
  state.benchmark=b.dataset.benchmark;render();
}));
function scrollBehavior(){return matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';}
$('#clear-filters').addEventListener('click',()=>{state.benchmark='all';render();});
function openVideo(id){
  const item=videos.find(v=>v.id===id);
  const article=$$('.video-card').find(card=>card.dataset.id===id);
  if(!item||!article)return;
  let player=article.querySelector('.gallery-video');
  if(!player){
    player=el('video','gallery-video');
    player.controls=true;player.playsInline=true;player.preload='none';
    player.poster=item.poster;player.src=item.src;
    player.setAttribute('aria-label',item.instruction);
    player.setAttribute('tabindex','0');
    if(item.cues && location.protocol==='file:'){
      const track=player.addTextTrack('captions','Actions & feedback','en');
      item.cues.forEach(([start,end,text])=>track.addCue(new VTTCue(start,end,text)));
      track.mode='hidden';
    }else if(item.captions){
      const track=el('track');track.kind='captions';track.label='Actions & feedback';track.srclang='en';track.src=item.captions;player.append(track);
    }
    player.addEventListener('play',()=>{
      $$('.gallery-video').forEach(other=>{if(other!==player)other.pause();});
    });
    player.addEventListener('error',()=>{
      if(!article.querySelector('.video-error')){
        const message=el('p','video-error','Video unavailable. Please reload to retry.');
        message.setAttribute('role','alert');article.querySelector('.card-info').append(message);
      }
    });
    article.querySelector('.open-video').replaceWith(player);
    player.focus({preventScroll:true});
  }
  if(player.paused)player.play().catch(()=>{});else player.pause();
}
render();

// Each row moves independently. Only direct interaction or playback holds that row.
const galleryGrid=$('#video-grid');
const rowMotion=new WeakMap();
const rowPointers=new Map();
let galleryOnScreen=false;
let galleryFrame=0;
let galleryLastTime=0;
function motionFor(row){
  if(!rowMotion.has(row))rowMotion.set(row,{position:row.scrollLeft,direction:1,holdUntil:0});
  return rowMotion.get(row);
}
function holdGalleryRow(row){
  if(!row)return;
  const motion=motionFor(row);
  motion.holdUntil=performance.now()+900;
  motion.position=row.scrollLeft;
}
function syncGalleryMotion(){
  if(galleryOnScreen&&!document.hidden){
    if(!galleryFrame){galleryLastTime=0;galleryFrame=requestAnimationFrame(advanceGallery);}
  }else{
    cancelAnimationFrame(galleryFrame);galleryFrame=0;galleryLastTime=0;
    rowPointers.clear();
  }
}
function advanceGallery(time){
  galleryFrame=0;
  if(!galleryOnScreen||document.hidden)return;
  const dt=galleryLastTime?Math.min((time-galleryLastTime)/1000,.05):0;
  galleryLastTime=time;
  $$('.gallery-row').forEach((row,i)=>{
    const motion=motionFor(row);
    const touched=[...rowPointers.values()].includes(row);
    const playing=[...row.querySelectorAll('.gallery-video')].some(v=>!v.paused&&!v.ended);
    if(touched||playing||time<motion.holdUntil){motion.position=row.scrollLeft;return;}
    const max=Math.max(0,row.scrollWidth-row.clientWidth);
    if(!max)return;
    if(Math.abs(row.scrollLeft-motion.position)>2)motion.position=row.scrollLeft;
    motion.position+=motion.direction*[38,46,34][i]*dt;
    if(motion.position>=max){motion.position=max;motion.direction=-1;}
    if(motion.position<=0){motion.position=0;motion.direction=1;}
    row.scrollLeft=motion.position;
  });
  galleryFrame=requestAnimationFrame(advanceGallery);
}
galleryGrid.addEventListener('pointerdown',e=>{
  const row=e.target.closest('.gallery-row');
  if(row){rowPointers.set(e.pointerId,row);holdGalleryRow(row);}
});
function releaseGalleryPointer(e){
  const row=rowPointers.get(e.pointerId);
  if(row){rowPointers.delete(e.pointerId);holdGalleryRow(row);}
}
window.addEventListener('pointerup',releaseGalleryPointer);
window.addEventListener('pointercancel',releaseGalleryPointer);
window.addEventListener('blur',()=>rowPointers.clear());
galleryGrid.addEventListener('wheel',e=>{
  if(Math.abs(e.deltaX)>0||e.shiftKey)holdGalleryRow(e.target.closest('.gallery-row'));
},{passive:true});
galleryGrid.addEventListener('keydown',e=>holdGalleryRow(e.target.closest('.gallery-row')));
new IntersectionObserver(entries=>{
  galleryOnScreen=entries[0].isIntersecting;syncGalleryMotion();
},{threshold:0}).observe(galleryGrid);
document.addEventListener('visibilitychange',syncGalleryMotion);
syncGalleryMotion();
