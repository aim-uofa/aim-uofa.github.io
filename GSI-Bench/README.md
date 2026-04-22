# GSI-Bench Project Page

Static project homepage for **Exploring Spatial Intelligence from a Generative Perspective** (CVPR 2026).

```
project_page/
├── index.html                 # main page
└── assets/
    ├── css/style.css          # pastel palette styled to match the paper figures
    └── figures/               # auto-extracted from sec/*_cropped.pdf
        ├── teaser_main.png
        ├── pipeline.png
        ├── qualitative.png
        ├── supp_examples_1.png
        ├── supp_examples_2.png
        └── supp_examples_7.png
```

## Local preview

```bash
cd project_page
python3 -m http.server 8000
# open http://localhost:8000
```

## Before publishing

Replace the placeholder `href="#"` in the hero badges with the real URLs once available:

- **Paper (PDF)** — camera-ready / arXiv PDF link
- **arXiv** — arXiv abstract page
- **Code** — GitHub repo
- **Dataset** — HuggingFace / ModelScope / Google Drive, etc.

All numerical results, tables, figures, and captions come directly from the paper — no values modified.
