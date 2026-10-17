#!/bin/bash
# Run the F13 production test once per component (separate browser per component).
# Env: NOVA_SOURCE_ROOT (project root containing F13/, integration/, 00-master/), NODE_PATH (folder with playwright),
#      NOVA_CHROMIUM_PATH (optional browser binary), NOVA_SOURCE_DIR (optional, e.g. "originals" for a baseline run), IDS.
ROOT=${NOVA_SOURCE_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}; cd "$ROOT"
O=${NOVA_F13_OUT:-$ROOT/audit/f13-production-2026-10-17}; mkdir -p "$O/per"; export NOVA_SOURCE_ROOT=$ROOT NOVA_F13_OUT=$O
for id in ${IDS:-F13-01 F13-02 F13-03 F13-04 F13-05 F13-06 F13-07 F13-08 F13-09 F13-10 F13-11 F13-12 F13-13 F13-14}; do
 NOVA_ONLY_IDS=$id NOVA_REPORT_SHARD=$id timeout 500 node integration/qa/test-f13-production.cjs > "$O/per/$id.log" 2>&1
 grep -E "^$id [0-9]+/|ERROR|FAIL" "$O/per/$id.log" | cut -c1-220
done
