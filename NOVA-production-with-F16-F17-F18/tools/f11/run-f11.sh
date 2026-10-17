#!/bin/bash
# Run the F11 production test once per component (separate browser per component).
# Env: NOVA_SOURCE_ROOT (project root containing F11/, integration/, 00-master/), NODE_PATH (folder with playwright),
#      NOVA_CHROMIUM_PATH (optional browser binary), NOVA_SOURCE_DIR (optional, e.g. "originals" for a baseline run), IDS.
ROOT=${NOVA_SOURCE_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}; cd "$ROOT"
O=${NOVA_F11_OUT:-$ROOT/audit/f11-production-2026-10-17}; mkdir -p "$O/per"; export NOVA_SOURCE_ROOT=$ROOT NOVA_F11_OUT=$O
for id in ${IDS:-F11-01 F11-02 F11-03 F11-04 F11-05 F11-06 F11-07 F11-08 F11-09 F11-10 F11-11}; do
 NOVA_ONLY_IDS=$id NOVA_REPORT_SHARD=$id timeout 500 node integration/qa/test-f11-production.cjs > "$O/per/$id.log" 2>&1
 grep -E "^$id [0-9]+/|ERROR|FAIL" "$O/per/$id.log" | cut -c1-220
done
