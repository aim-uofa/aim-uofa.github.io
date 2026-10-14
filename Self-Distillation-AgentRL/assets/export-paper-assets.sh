#!/usr/bin/env bash
# Export the unmodified paper figures and crop the compiled paper's result tables.
# Usage: bash assets/export-paper-assets.sh /path/to/1_paper_latex
set -euo pipefail
paper_root="${1:?Pass the paper directory containing build/ and latex/.}"
asset_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

for figure in overview generated_validation_curves generated_stability_cases generated_cost_performance_settings; do
  case "$figure" in
    overview) name=overview ;;
    generated_validation_curves) name=training-curves ;;
    generated_stability_cases) name=stability-cases ;;
    generated_cost_performance_settings) name=cost-performance ;;
  esac
  cp -- "${paper_root}/latex/figure/${figure}.pdf" "${asset_dir}/${name}.pdf"
  pdftoppm -singlefile -scale-to 3600 -png \
    "${asset_dir}/${name}.pdf" "${asset_dir}/${name}"
done

# The current compiled paper has Tables 2 and 3 on PDF pages 4 and 5.
# Coordinates are pixels at 450 dpi. Include the original table captions.
pdftoppm -f 4 -l 4 -singlefile -r 450 -x 438 -y 425 -W 2850 -H 2313 -png \
  "${paper_root}/build/main.pdf" "${asset_dir}/results-alfworld-scienceworld"
pdftoppm -f 5 -l 5 -singlefile -r 450 -x 438 -y 425 -W 2850 -H 2832 -png \
  "${paper_root}/build/main.pdf" "${asset_dir}/results-searchqa-webshop"
