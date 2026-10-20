'use strict';
const config = window.PAGE;
const mediaVersion = config.assetRevision ? `?v=${encodeURIComponent(config.assetRevision)}` : "";
const $ = id => document.getElementById(id);
const make = (tag, cls, text) => {
  const element = document.createElement(tag);
  if (cls) element.className = cls;
  if (text !== undefined) element.textContent = text;
  return element;
};
const safeUrl = value => {
  if (!value) return null;
  try { const url = new URL(value, location.href); return ['http:', 'https:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
};
if (config.authors.length) {
  let row = make('div', 'author-row');
  $('authors').append(row);
  config.authors.forEach((author, i) => {
    if (i && i === config.authorRowBreak) {
      row = make('div', 'author-row');
      $('authors').append(row);
    }
    const entry = make('span', 'author-entry');
    const url = safeUrl(author.url);
    const element = make(url ? 'a' : 'span', 'author-name', author.name);
    if (url) {
      element.href = url;
      element.target = '_blank';
      element.rel = 'noopener';
      element.title = `Visit ${author.name}’s profile`;
    }
    entry.append(element, make('sup', 'author-markers', (author.affiliation || '') + (author.markers || '')));
    row.append(entry);
  });
} else $('authors').append(make('span', 'todo-text', 'TODO · Author names, order & homepages'));
if (config.affiliations.length) {
  config.affiliations.forEach(affiliation => {
    const item = make('span', 'affiliation-item');
    if (typeof affiliation === 'string') item.textContent = affiliation;
    else item.append(make('sup', '', affiliation.id), document.createTextNode(affiliation.name));
    $('affiliations').append(item);
  });
} else $('affiliations').textContent = 'TODO · Institutions & affiliations';
$('author-notes').textContent = config.authorNotes || '';
(config.contactEmails || []).forEach((email, i) => {
  if (i) $('author-contact').append(' · ');
  const link = make('a', '', email);
  link.href = 'mailto:' + email;
  $('author-contact').append(link);
});
const icons = {
  paper: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h4M9 12h6M9 16h6"/>',
  code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20"/>',
  dataset: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>'
};
for (const [key, label] of [['paper', 'Paper'], ['code', 'Code'], ['dataset', 'Dataset']]) {
  const url = safeUrl(config.links[key]);
  const element = make(url ? 'a' : 'button', 'resource-pill');
  const icon = make('span', 'resource-icon');
  icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg>`;
  element.append(icon, make('span', '', label));
  if (url) { element.href = url; element.target = '_blank'; element.rel = 'noopener'; }
  else { element.disabled = true; element.title = `${label} coming soon`; element.append(make('span', 'todo-badge', '(coming soon)')); }
  $('links').append(element);
}
function videoCard(item, accessibleLabel) {
  const figure = make('figure', 'video-card');
  const stage = make('div', 'video-stage');
  figure.append(stage);
  if (!item.file) { stage.append(make('div', 'missing-video', 'TODO · Add the video and poster')); return figure; }
  const video = make('video');
  video.controls = true; video.muted = true; video.playsInline = true; video.preload = 'metadata';
  video.poster = `assets/${item.file}.jpg${mediaVersion}`;
  video.setAttribute('aria-label', accessibleLabel);
  const source = make('source'); source.src = `assets/${item.file}.mp4${mediaVersion}`; source.type = 'video/mp4'; video.append(source);
  const error = make('div', 'media-error');
  error.append(make('span', '', 'TODO · Video is missing or cannot be decoded in this browser.'));
  const link = make('a', '', 'Open video file'); link.href = source.src; link.target = '_blank'; link.rel = 'noopener'; error.append(link);
  stage.append(video, error);
  const showError = () => figure.classList.add('failed');
  video.addEventListener('error', showError); source.addEventListener('error', showError);
  video.addEventListener('play', () => document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); }));
  return figure;
}
$('featured-video').append(videoCard(config.featured, 'Recorded real-time streaming demonstration'));
function carousel(items, label, id) {
  const root = make('div', 'carousel'); root.id = `${id}-carousel`;
  root.setAttribute('role', 'region'); root.setAttribute('aria-roledescription', 'carousel'); root.setAttribute('aria-label', label); root.tabIndex = 0;
  const grid = make('div', 'carousel-grid');
  const prev = make('button', 'carousel-arrow previous', '‹'); prev.type = 'button'; prev.setAttribute('aria-label', `Previous video in ${label}`);
  const next = make('button', 'carousel-arrow next', '›'); next.type = 'button'; next.setAttribute('aria-label', `Next video in ${label}`);
  const viewport = make('div', 'carousel-viewport');
  const track = make('div', 'carousel-track'); track.id = `${id}-track`; viewport.append(track);
  prev.setAttribute('aria-controls', track.id); next.setAttribute('aria-controls', track.id);
  const slides = items.map((item, i) => {
    const slide = make('div', 'carousel-slide');
    slide.setAttribute('role', 'group'); slide.setAttribute('aria-roledescription', 'slide'); slide.setAttribute('aria-label', `${i + 1} of ${items.length}`);
    slide.append(videoCard(item, `${label}, video ${i + 1}`)); track.append(slide); return slide;
  });
  const pagination = make('div', 'carousel-pagination');
  const dots = make('div', 'carousel-dots');
  const dotButtons = items.map((item, i) => { const button = make('button', 'carousel-dot'); button.type = 'button'; button.setAttribute('aria-label', `Show video ${i + 1} in ${label}`); button.addEventListener('click', () => show(i)); dots.append(button); return button; });
  const counter = make('span', 'carousel-counter'); counter.setAttribute('aria-live', 'polite'); counter.setAttribute('aria-atomic', 'true');
  let current = 0;
  function show(index) {
    current = ((index % items.length) + items.length) % items.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.inert = !active; slide.setAttribute('aria-hidden', String(!active));
      if (!active) slide.querySelectorAll('video').forEach(video => video.pause());
      dotButtons[i].classList.toggle('active', active);
      dotButtons[i].setAttribute('aria-pressed', String(active));
    });
    track.style.transform = `translateX(-${current * 100}%)`;
    root.dataset.index = String(current); counter.textContent = `${current + 1} / ${items.length}`;
    prev.disabled = next.disabled = items.length < 2;
  }
  prev.addEventListener('click', () => show(current - 1)); next.addEventListener('click', () => show(current + 1));
  root.addEventListener('keydown', event => {
    if (event.target.tagName === 'VIDEO') return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
  });
  let touchX = null;
  viewport.addEventListener('touchstart', event => { touchX = event.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', event => {
    if (touchX === null) return;
    const distance = event.changedTouches[0].clientX - touchX;
    if (Math.abs(distance) > 65 && items.length > 1) show(current + (distance < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });
  pagination.append(dots, counter); grid.append(prev, viewport, next); root.append(grid, pagination); show(0); return root;
}
for (const gallery of config.galleries) {
  const section = make('section', 'gallery-section'); section.id = gallery.id;
  const heading = make('div', 'gallery-heading');
  heading.append(make('h3', '', gallery.label), make('p', 'gallery-description', gallery.description));
  section.append(heading, carousel(gallery.cases, gallery.label, gallery.id)); $('galleries').append(section);
}
function table(rows, columns, label, options = {}) {
  const scroll = make('div', 'table-scroll'); scroll.tabIndex = 0; scroll.setAttribute('role', 'region'); scroll.setAttribute('aria-label', `${label}; scroll horizontally to view all metrics`);
  const tableElement = make('table'); tableElement.append(make('caption', 'sr-only', label));
  const head = make('thead'), headingRow = make('tr');
  columns.forEach(column => { const th = make('th', '', column); th.scope = 'col'; headingRow.append(th); }); head.append(headingRow); tableElement.append(head);
  const body = make('tbody');
  const best = columns.map((column, i) => i === 0 ? null : (column.includes('↑') ? Math.max : Math.min)(...rows.map(row => row[i])));
  rows.forEach((row, index) => {
    if (options.groups?.[index]) { const separator = make('tr', 'phase-divider'); const cell = make('th', '', options.groups[index]); cell.colSpan = columns.length; cell.scope = 'rowgroup'; separator.append(cell); body.append(separator); }
    const tr = make('tr', row[0].startsWith('StreamingSwap') ? 'ours' : '');
    row.forEach((value, i) => {
      const cell = make(i === 0 ? 'th' : 'td', !options.groups && i && value === best[i] ? 'best' : '', i === 0 ? value : Number(value).toFixed(columns[i].startsWith('FVD') ? 2 : 3));
      if (i === 0) cell.scope = 'row'; tr.append(cell);
    }); body.append(tr);
  }); tableElement.append(body); scroll.append(tableElement); return scroll;
}
$('short-table').append(table(config.shortRows, config.columns, 'Table 1: short-video benchmark'));
$('long-table').append(table(config.longRows, config.columns, 'Table 1: long-video benchmark'));
for (const kind of ['short', 'long']) $(kind + '-comparisons').append(carousel(config.comparisons[kind], `${kind === 'short' ? 'Short' : 'Long'}-video visual comparisons`, kind));
$('citation').textContent = config.citation || '% TODO: Add final BibTeX entry.\n% Title: From Short Clips to Real-Time Streams:\n% Identity-Aware Supervision and Context-Efficient Generation\n% for Video Face Swapping\n% Venue, year and public URL: pending confirmation.';
if (config.citation) {
  const button = $('copy-citation'); button.disabled = false; button.textContent = 'Copy';
  button.addEventListener('click', async () => { try { await navigator.clipboard.writeText(config.citation); button.textContent = 'Copied'; setTimeout(() => button.textContent = 'Copy', 1500); } catch { button.textContent = 'Select and copy the entry below'; } });
}
