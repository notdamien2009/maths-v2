#!/bin/bash
# Runs each F8 component in its own browser process; per-id result JSON in per/.
cd "$(dirname "$0")/../.."; O=audit/f8-production-2026-10-17; mkdir -p $O/per
for id in ${IDS:-F8-01 F8-02 F8-03 F8-04 F8-05 F8-06 F8-07 F8-08 F8-09 F8-10 F8-11 F8-12 F8-13 F8-14 F8-15 F8-16 F8-17 F8-18}; do
 NOVA_ONLY_IDS=$id timeout 600 node $O/test-f8-production.cjs > $O/per/$id.log 2>&1; cp $O/semantic-browser.json $O/per/$id.json; grep -E "^$id [0-9]+/|ERROR|FAIL" $O/per/$id.log | cut -c1-260
done
