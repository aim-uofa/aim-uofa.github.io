# Paper assets

All figures and result tables are exported directly from the existing paper;
no result cells are retyped or redrawn for this website.

- `overview.*`: `latex/figure/overview.pdf`.
- `training-curves.*`: `latex/figure/generated_validation_curves.pdf`.
- `stability-cases.*`: `latex/figure/generated_stability_cases.pdf`.
- `cost-performance.*`: `latex/figure/generated_cost_performance_settings.pdf`.
- `results-alfworld-scienceworld.png`: Table 2 and its original caption, page 4 of `build/main.pdf`, cropped at 450 DPI.
- `results-searchqa-webshop.png`: Table 3 and its original caption, page 5 of `build/main.pdf`, cropped at 450 DPI.

The source snapshot was exported on 2026-10-12. Vector figures are also included
as PDFs; their PNG previews have a longest edge of 3,600 pixels. Table PNGs are
2,850 pixels wide.

Source `build/main.pdf` SHA-256:
`6bb64f4b3ac0444fa66619dcb67ab2b42535d564d02a6527ada43e7060f0cb86`.

To re-export from the paper checkout:

```bash
bash assets/export-paper-assets.sh /path/to/1_paper_latex
```

If the manuscript's pagination or layout changes, check and update the two crop
regions in the export script before regenerating. The script does not build or
modify the manuscript.
