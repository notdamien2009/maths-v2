#!/bin/bash
# Runs each F5 component in its own browser process; merges into semantic-browser.json
cd /workspace/codex-f5/work; export NODE_PATH=/workspace/codex-f5/ref/integration/node_modules
O=audit/f5-production-2026-10-16; mkdir -p $O/per
for id in ${IDS:-F5-01 F5-02 F5-03 F5-04 F5-05 F5-06 F5-07 F5-09 F5-10 F5-11 F5-12 F5-13 F5-14 F5-15 F5-16 F5-17 F5-18 F5-19}; do
 NOVA_ONLY_IDS=$id NOVA_REPORT_SHARD=$id timeout 400 node integration/qa/test-f5-production.cjs > $O/per/$id.log 2>&1; tail -1 $O/per/$id.log | head -c 0; grep -E "^$id [0-9]+/|ERROR|FAIL" $O/per/$id.log | cut -c1-200
done
