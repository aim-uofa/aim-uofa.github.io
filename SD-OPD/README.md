# SD-OPD project page

Static project page for **Reinforcing What the Student Has Learned: Teacher-Guided On-Policy Distillation**.

- Paper: https://arxiv.org/abs/2611.07722
- Code: https://github.com/aim-uofa/sd-opd
- Intended GitHub Pages URL: https://aim-uofa.github.io/SD-OPD/

## Local preview

From the `aim-uofa.github.io` repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/SD-OPD/`. No installation or build step is required. Publishing uses the parent repository's existing GitHub Pages workflow.

## Editing

- `index.html`: paper metadata, authors, text, all five result tables, and summary charts.
- `static/css/index.css`: layout, responsive styles, and print styles.
- `static/js/index.js`: result selection, figure viewer, and citation copying.
- `citation.bib`: downloadable citation; keep it consistent with the displayed BibTeX.

The tables and charts reproduce Table 1 of arXiv v2, including the published averages, gains, and best-student markers. Do not recalculate gains from the rounded display values. Without JavaScript, all five tables remain visible; printing also includes every setting.

`static/images/method.png` comes from the code repository. The feedback and training SVGs are vector exports of Figures 2 and 4 from the paper's arXiv v2 source. Figures can be enlarged or opened separately at their original resolution. Fonts and all page assets are hosted locally.

The layout is adapted from [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template), itself based on [Nerfies](https://nerfies.github.io/). Website: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Inter: SIL Open Font License, included in `static/fonts/OFL.txt`.
