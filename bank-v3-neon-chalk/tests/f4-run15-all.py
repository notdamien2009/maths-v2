#!/usr/bin/env python3
"""Run five isolated F4 Run15 groups with hard deadlines and zero GitHub writes.

Refuses to mark the family validated if a group is absent, timed out, or failed.
Source validation is delegated to f4-run15-verify.py, which requires exact
GitHub core Git-blobs by default.  Generated files are confined to review/.
"""
from pathlib import Path
import argparse, json, subprocess, sys, hashlib
R=Path(__file__).resolve().parents[1]
GROUPS={
 'A':['F4-01','F4-02'],
 'B':['F4-03','F4-04'],
 'C':['F4-06','F4-07'],
 'D':['F4-08','F4-09'],
 'E':['F4-11','F4-12']
}

def main():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('--chromium',default=None)
 p.add_argument('--timeout',type=int,default=95,help='Hard deadline per group in seconds')
 p.add_argument('--diagnostic',action='store_true',help='For prior-core or simulated test evidence only (not approval)')
 p.add_argument('--allow-fixture',action='store_true',help='For synthetic fixture ONLY; not compatible with production approval')
 args=p.parse_args()
 if args.allow_fixture and not args.diagnostic:p.error('--allow-fixture requires --diagnostic')
 report={'name':'NOVA F4 Run15 batch acceptance','mode':'DIAGNOSTIC_NOT_RELEASE' if args.diagnostic else 'EXACT_GITHUB_CORE_ACCEPTANCE',
 'groups':{},'pass':False,'github_modified':False,'core_modified':False}
 pth=R/'review/F4-RUN15-ALL-RESULTS.json';pth.parent.mkdir(parents=True,exist_ok=True)
 guard=[]
 for f in [R/'core/nova-core.js',R/'core/nova-core.css']:
  if not f.is_file():raise SystemExit('Missing current core: '+str(f))
  guard.append(hashlib.sha256(f.read_bytes()).hexdigest())
 for group,ids in GROUPS.items():
  fn=f'F4-RUN15-BATCH-{group}.json'
  cmd=[sys.executable,str(R/'tests/f4-run15-verify.py'),'--engines',*ids,'--report-name',fn]
  if args.chromium:cmd+=['--chromium',args.chromium]
  if args.diagnostic:cmd+=['--diagnostic']
  if args.allow_fixture:cmd+=['--allow-fixture']
  try:
   sub=subprocess.run(cmd,capture_output=True,text=True,timeout=args.timeout)
   meta={'returncode':sub.returncode,'stdout_tail':sub.stdout[-1000:],'stderr_tail':sub.stderr[-800:]}
  except subprocess.TimeoutExpired as e:
   meta={'returncode':124,'error':f'Group timeout after {args.timeout}s — NOT VERIFIED'}
  f=R/'review'/fn
  if meta['returncode']==0 and f.is_file():
   j=json.loads(f.read_text(encoding='utf8'))
   meta['status']=j.get('status')
   meta['exact_core']=j.get('exact_github_core')
   meta['summary']=j.get('summary')
   meta['passed']=(all(v.get('failed')==0 for v in j.get('summary',{}).values())
                   and sum(x.get('total',0) for x in j['summary'].values())>0
                   and (args.diagnostic or j.get('exact_github_core') is True))
  else:meta['passed']=False
  report['groups'][group]=meta
  print(group,'PASS' if meta['passed'] else 'BLOCKED/FAIL',meta.get('summary',meta.get('error','')),flush=True)
  pth.write_text(json.dumps(report,indent=2)+'\n',encoding='utf8')
  if not meta['passed']:
   print('STOP: first failing group; see',pth,flush=True)
   break
 report['pass']=len(report['groups'])==len(GROUPS) and all(x['passed'] for x in report['groups'].values())
 report['approval']='DIAGNOSTIC ONLY' if args.diagnostic else ('EXACT CORE BROWSER/MATH CHECK PASSED, OWNER REVIEW PENDING' if report['pass'] else 'BLOCKED')
 guard_after=[hashlib.sha256(f.read_bytes()).hexdigest() for f in [R/'core/nova-core.js',R/'core/nova-core.css']]
 report['core_unchanged']=guard==guard_after
 report['pass']=report['pass'] and report['core_unchanged']
 pth.write_text(json.dumps(report,indent=2)+'\n',encoding='utf8')
 print('FINAL',report['approval'],'ALL GROUPS PASS',report['pass'],'RESULTS',pth,flush=True)
 return 0 if report['pass'] else 1
if __name__=='__main__':sys.exit(main())
