#!/bin/bash
# Runs each F6 component in its own browser process; per-id result JSON in per/.
cd "$(dirname "$0")/../.."; O=audit/f6-production-2026-10-17; mkdir -p $O/per
for id in ${IDS:-F6-01 F6-02 F6-03 F6-04 F6-05 F6-06 F6-07 F6-09 F6-10 F6-11 F6-14}; do
 NOVA_ONLY_IDS=$id timeout 600 node $O/test-f6-production.cjs > $O/per/$id.log 2>&1; cp $O/semantic-browser.json $O/per/$id.json; grep -E "^$id [0-9]+/|ERROR|FAIL" $O/per/$id.log | cut -c1-260
done
