#!/bin/bash
# Run the F9 production test once per component (separate browser per component).
# Env: NOVA_SOURCE_ROOT (project root containing F9/, integration/, 00-master/), NODE_PATH (folder with playwright),
#      NOVA_CHROMIUM_PATH (optional browser binary), NOVA_SOURCE_DIR (optional, e.g. "originals" for a baseline run), IDS.
ROOT=${NOVA_SOURCE_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}; cd "$ROOT"
O=${NOVA_F9_OUT:-$ROOT/audit/f9-production-2026-10-17}; mkdir -p "$O/per"; export NOVA_SOURCE_ROOT=$ROOT NOVA_F9_OUT=$O
for id in ${IDS:-F9-01 F9-02 F9-03 F9-04 F9-05 F9-06 F9-07 F9-08 F9-09 F9-10 F9-11 F9-12 F9-13}; do
 NOVA_ONLY_IDS=$id NOVA_REPORT_SHARD=$id timeout 500 node integration/qa/test-f9-production.cjs > "$O/per/$id.log" 2>&1
 grep -E "^$id [0-9]+/|ERROR|FAIL" "$O/per/$id.log" | cut -c1-220
done
