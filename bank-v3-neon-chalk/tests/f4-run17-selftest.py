#!/usr/bin/env python3
"""Local offline QA: strict parser and fail-closed defect regression.
No browsers or source files altered. Does not claim current-core acceptance.
"""
from pathlib import Path
import importlib.util, json, sys
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from f4_run17_report_schema import normalize_report
checks=[]

def expect(name, sample, should_pass):
 try:
  out=normalize_report(sample,name)
  ok=should_pass == out['passed_all']
 except ValueError:
  ok=not should_pass
 checks.append({'name':name,'passed':ok})
 if not ok:
  print('FAIL',name)

# Exact JSON shapes extracted from the F4 runs, reduced to three cases for portability.
for case in [
 ('legacy-list',{'tests':3,'pass':3,'fail':0,'checks':[{'passed':True}]*3}),
 ('count-details',{'checks':3,'passed':3,'failed':0,'details':[{'passed':True}]*3}),
 ('results-list',{'passed':3,'failed':0,'results':[{'passed':True}]*3}),
 ('total-checks',{'total':3,'passed':3,'failed':0,'checks':[{'passed':True}]*3}),
 ('derived-list',{'checks':[{'passed':True}]*3})]:
 expect(case[0],case[1],True)
for name,data in [
 ('wrong-answer',{'checks':3,'passed':2,'failed':1,'details':[{'passed':True}]*2+[{'passed':False}]}),
 ('inconsistent-summary',{'checks':3,'passed':3,'failed':0,'details':[{'passed':True}]*2+[{'passed':False}]}),
 ('missing-evidence',{'checks':3,'passed':3,'failed':0,'details':[{'passed':True}]*2}),
 ('negative-count',{'checks':3,'passed':-1,'failed':4}),
 ('no-qa',{'failed':0,'passed':0}),
 ('no-summary',{'checks':3}),
 ('not-a-dict',[1,2,3]),
 ('non-boolean-evidence',{'checks':1,'results':[{'passed':1}],'passed':1,'failed':0}),
 ('unknown-evidence',{'checks':1,'details':[{'success':True}],'passed':1,'failed':0}),
 ('bad-total',{'checks':2,'passed':1,'failed':0}),
 ('all-fail',{'tests':3,'pass':0,'fail':3,'checks':[{'passed':False}]*3})]:
 expect(name,data,False)
# Ensure the patched runner imports and has the strict normalizer.
script=HERE/'f4-run16-physical-verify.py'
s=script.read_text(encoding='utf-8')
checks.append({'name':'runner-uses-strict-parser','passed':('normalize_report(json.loads(fp.read_text(' in s and 'd.get(\'total\',d.get(\'tests\',len(checks)))' not in s)})
checks.append({'name':'runner-keeps-exact-core-gate','passed':("if not isexact and not diagnostic:" in s)})
failed=sum(not x['passed'] for x in checks)
r={'run':'F4-RUN17','suite':'report parser and fail-closed gate','checks':len(checks),'passed':len(checks)-failed,'failed':failed,'results':checks,'actual_current_github_core_checked':False,'gold_approval':False}
print(f"RUN17 OFFLINE SELFTEST: {r['passed']}/{r['checks']} passed")
if __name__=='__main__':
 # Store results under review/, not in the tests/ source directory.
 dst=HERE.parent/'review'/'F4-RUN17-SELFTEST-RESULTS.json';dst.parent.mkdir(exist_ok=True)
 dst.write_text(json.dumps(r,indent=2)+'\n',encoding='utf-8')
 sys.exit(bool(failed))
