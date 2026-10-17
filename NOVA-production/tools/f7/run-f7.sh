#!/bin/bash
# Run the F7 production test once per component (separate browser per component).
# Env: NOVA_SOURCE_ROOT (project root containing F7/, integration/, 00-master/), NODE_PATH (folder with playwright),
#      NOVA_CHROMIUM_PATH (optional browser binary), NOVA_SOURCE_DIR (optional, e.g. "originals" for a baseline run), IDS.
ROOT=${NOVA_SOURCE_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}; cd "$ROOT"
O=${NOVA_F7_OUT:-$ROOT/audit/f7-production-2026-10-16}; mkdir -p "$O/per"; export NOVA_SOURCE_ROOT=$ROOT NOVA_F7_OUT=$O
for id in ${IDS:-F7-01 F7-02 F7-03 F7-04 F7-05 F7-06 F7-07 F7-08 F7-09 F7-10 F7-11 F7-12 F7-13 F7-14}; do
 NOVA_ONLY_IDS=$id NOVA_REPORT_SHARD=$id timeout 500 node integration/qa/test-f7-production.cjs > "$O/per/$id.log" 2>&1
 grep -E "^$id [0-9]+/|ERROR|FAIL" "$O/per/$id.log" | cut -c1-220
done
