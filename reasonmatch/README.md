# ReasonMatch — Project Page

A self-contained, static project page for **ReasonMatch** (CVPR 2026):
*Eliciting Complex Spatial Reasoning in MLLMs through Wide-Baseline Matching*.

No build step, no dependencies — a single `index.html` plus images in `assets/`.

## View locally

Open the file directly:

```bash
open index.html        # macOS
```

or serve it (recommended, so relative asset paths and clipboard APIs behave like production):

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Any static host works (GitHub Pages, Netlify, Vercel, an S3 bucket, etc.).
For **GitHub Pages**, put the contents of this `webpage/` directory at the site root
(or set Pages to serve from this folder) — it is already Pages-friendly.

## Files

- `index.html` — the entire page (HTML + embedded CSS + a small vanilla JS for nav, scroll-spy, and BibTeX copy). The method pipeline and the per-scenario F1 bar chart are both hand-drawn in HTML/CSS (no images).
- `assets/qualitative.png` — original cross-view reasoning example (rendered from `paper/figures/main/Thinking_latest.pdf`).
- `assets/qualitative-cropped.jpg` — cropped webpage version used in the qualitative section and social preview.

## Links used

- Code (pending public visibility): <https://github.com/aim-uofa/ReasonMatch>
- Dataset (ModelScope): <https://www.modelscope.cn/datasets/jxzh2020/ReasonMatchBench>
- arXiv: <http://arxiv.org/abs/2606.03577>

## ⚠️ Placeholders to fill before going public

Search `index.html` for `TODO(release)` and update:

1. **GitHub URL / visibility** — code buttons point to <https://github.com/aim-uofa/ReasonMatch>; make sure the repository is public before launch.
2. **Contact email** — footer uses `mailto:haoz0206@zju.edu.cn`.
3. **BibTeX** — CVPR proceedings metadata is filled; add arXiv metadata only if needed.

All numbers and claims on the page are taken verbatim from the final poster
(`~/Desktop/reasonmatch-cvpr2026.pdf`) and `paper/` — the source of truth. If any result
changes, update the corresponding table in `index.html`.
