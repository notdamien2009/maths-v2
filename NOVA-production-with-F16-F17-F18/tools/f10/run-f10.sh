#!/bin/bash
# Runs each F10 component in its own browser process; per-id result JSON in per/.
cd "$(dirname "$0")/../.."; O=audit/f10-production-2026-10-17; mkdir -p $O/per
for id in ${IDS:-$(seq -f "F10-%02g" 1 20)}; do
 NOVA_ONLY_IDS=$id timeout 600 node $O/test-f10-production.cjs > $O/per/$id.log 2>&1; cp $O/semantic-browser.json $O/per/$id.json; grep -E "^$id [0-9]+/|ERROR|FAIL" $O/per/$id.log | cut -c1-260
done
