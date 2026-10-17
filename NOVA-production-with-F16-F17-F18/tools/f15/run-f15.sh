#!/bin/bash
# Run the F15 production test once per component (separate browser per component).
# Env: NOVA_SOURCE_ROOT (project root containing F15/, integration/, 00-master/), NODE_PATH (folder with playwright),
#      NOVA_CHROMIUM_PATH (optional browser binary), NOVA_SOURCE_DIR (optional, e.g. "originals" for a baseline run), IDS.
ROOT=${NOVA_SOURCE_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}; cd "$ROOT"
O=${NOVA_F15_OUT:-$ROOT/audit/f15-production-2026-10-17}; mkdir -p "$O/per"; export NOVA_SOURCE_ROOT=$ROOT NOVA_F15_OUT=$O
for id in ${IDS:-F15-01 F15-02 F15-06 F15-07 F15-08 F15-09 F15-10 F15-11 F15-12 F15-13 F15-14}; do
 NOVA_ONLY_IDS=$id NOVA_REPORT_SHARD=$id timeout 500 node integration/qa/test-f15-production.cjs > "$O/per/$id.log" 2>&1
 grep -E "^$id [0-9]+/|ERROR|FAIL" "$O/per/$id.log" | cut -c1-220
done
