(function () {
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('#site-links');
  if (menu && links) {
    menu.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      menu.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      links.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
    }));
  }

  const copyButton = document.querySelector('[data-copy="bibtex"]');
  const bibtex = document.querySelector('#bibtex');
  const status = document.querySelector('.copy-status');
  if (copyButton && bibtex) {
    copyButton.addEventListener('click', async () => {
      const value = bibtex.textContent;
      try {
        await navigator.clipboard.writeText(value);
      } catch (_) {
        const range = document.createRange();
        range.selectNodeContents(bibtex);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
      }
      if (status) {
        status.textContent = 'BibTeX copied.';
        window.setTimeout(() => { status.textContent = ''; }, 2200);
      }
    });
  }

  const mainResults = document.querySelector('.main-results-table tbody');
  if (mainResults) {
    const rows = Array.from(mainResults.querySelectorAll('tr'));
    for (let start = 0; start < rows.length; start += 6) {
      const block = rows.slice(start, start + 6);
      for (let column = 1; column <= 6; column += 1) {
        const values = block
          .map((row) => Number.parseFloat(row.querySelectorAll('td')[column].textContent))
          .filter(Number.isFinite);
        const ranking = [...new Set(values)].sort((a, b) => b - a);
        const best = ranking[0];
        const second = ranking[1];
        block.forEach((row) => {
          const cell = row.querySelectorAll('td')[column];
          const value = Number.parseFloat(cell.textContent);
          if (value === best) cell.classList.add('best');
          else if (value === second) cell.classList.add('second');
        });
      }
    }
  }
})();
