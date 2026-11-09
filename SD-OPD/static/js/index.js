'use strict';

// Keep every results table available when JavaScript is disabled.
const settingSelect = document.querySelector('#setting-select');
const panels = [...document.querySelectorAll('.result-panel')];
if (settingSelect && panels.length) {
  const showSetting = () => {
    panels.forEach(panel => { panel.hidden = panel.id !== settingSelect.value; });
  };
  document.querySelector('.results-toolbar').hidden = false;
  settingSelect.addEventListener('change', showSetting);
  showSetting();
}

const copyButton = document.querySelector('#copy-bibtex');
const copyStatus = document.querySelector('#copy-status');
let copyReset;
copyButton?.addEventListener('click', async () => {
  const citation = document.querySelector('#bibtex-code').textContent.trim();
  let copied = false;
  try {
    await navigator.clipboard.writeText(citation);
    copied = true;
  } catch {
    // Support direct file previews and browsers without the Clipboard API.
    const textarea = document.createElement('textarea');
    textarea.value = citation;
    textarea.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(textarea);
    textarea.select();
    try { copied = document.execCommand('copy'); } catch { /* Offer manual copying below. */ }
    textarea.remove();
    copyButton.focus({ preventScroll: true });
  }
  clearTimeout(copyReset);
  copyButton.querySelector('span').textContent = copied ? 'Copied!' : 'Copy';
  copyStatus.textContent = copied ? 'BibTeX copied to clipboard.' : 'Please select the citation below to copy it, or download the .bib file.';
  copyReset = setTimeout(() => {
    copyButton.querySelector('span').textContent = 'Copy';
    copyStatus.textContent = '';
  }, 4500);
});

const dialog = document.querySelector('#figure-dialog');
if (dialog && typeof dialog.showModal === 'function') {
  const dialogImage = dialog.querySelector('img');
  const dialogCaption = dialog.querySelector('p');
  const originalLink = dialog.querySelector('#figure-original');
  document.querySelectorAll('[data-zoom]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      dialogImage.src = link.href;
      dialogImage.alt = link.querySelector('img').alt;
      dialogCaption.textContent = link.dataset.caption;
      originalLink.href = link.href;
      dialog.showModal();
      document.body.classList.add('modal-open');
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
}
