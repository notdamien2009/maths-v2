#!/bin/bash
cd "$(dirname "$0")"; A=$PWD; R=$(cd ../..; pwd)
./run-f10.sh > all.log 2>&1
node test-f10-native-regression.cjs > native.log 2>&1
node test-f10-resize.cjs > resize.log 2>&1
mkdir -p bank && cd bank && NOVA_CHROMIUM_PATH=/usr/bin/google-chrome NOVA_QA_WORKDIR=$A/bank NOVA_ONLY_IDS=$(seq -f "F10-%02g" 1 20 | paste -sd,) node $R/integration/qa/test-components.cjs > $A/bank.log 2>&1
cd $A && node adapter-rows.cjs > rows.log 2>&1
echo CHAIN-DONE >> rows.log
