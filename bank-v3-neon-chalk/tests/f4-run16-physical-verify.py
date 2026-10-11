#!/usr/bin/env python3
"""F4 Run17 patched physical pointer QA on Run14 STAGED HTML, with exact-core SHA checks.

No modifications to core/, F4/, source/, or GitHub. Original test scripts execute in a
TemporaryDirectory containing only COPIES of staged HTML and QA test scripts.
"""
from pathlib import Path
import argparse, hashlib, json, os, shutil, subprocess, sys, tempfile, time
from f4_run17_report_schema import normalize_report

BANK=Path(__file__).resolve().parents[1]
HERE=Path(__file__).resolve().parent
STAGE=BANK/'review'/'F4-RUN14-stage'
CURRENT={'js':'ac0b40a0bf19246ec3a9824798bd67dfe738c91c',
         'css':'1830cd68b3a345cbeefae69782bf2b309765d5fa'}
LEGACY={'js':'45b41ce94d27ed63e877faac6023e483855da76d',
        'css':'aad5139b1a5de01983efcb78dee6aabf917ea0a4'}
FILES={
'F4-01':'F4-01-part-whole-bar.html',
'F4-02':'F4-02-comparison-bar.html',
'F4-03':'F4-03-cuisenaire-rod-builder.html',
'F4-04':'F4-04-multi-step-bar-model.html',
'F4-06':'F4-06-percentage-bar.html',
'F4-07':'F4-07-ratio-bar.html',
'F4-08':'F4-08-algebra-bar.html',
'F4-09':'F4-09-before-and-after-bar.html',
'F4-11':'F4-11-word-problem-highlighter.html',
'F4-12':'F4-12-rates-tape-diagram.html',
}

def blob(data):
 return hashlib.sha1(('blob %d\0'%len(data)).encode()+data).hexdigest()

def filehash(p):return hashlib.sha256(p.read_bytes()).hexdigest()

def validate(stage, diagnostic):
 if not stage.is_dir():raise RuntimeError('Missing staged HTML; run python build/build-f4-run14.py first.')
 manifest_file=stage/'F4-RUN14-BUILD-RESULTS.json'
 if not manifest_file.is_file():raise RuntimeError('No Run14 build manifest: refusing unverified staged input.')
 m=json.loads(manifest_file.read_text(encoding='utf-8'))
 core={ext:blob((BANK/'core'/f'nova-core.{ext}').read_bytes()) for ext in ['js','css']}
 isexact=(core==CURRENT and m.get('core_git_blobs')==CURRENT and m.get('baseline')=='github-48a7eb7-f12')
 if not isexact and not diagnostic:
  raise RuntimeError(f'Not the exact GitHub core: {core}. Use --diagnostic only for clearly labelled legacy/synthetic testing; NEVER for final acceptance.')
 if not isexact and not (diagnostic and (core==LEGACY or m.get('core_git_blobs')==core)):
  raise RuntimeError('Diagnostic snapshot and manifest core hashes disagree; cannot verify this staged build.')
 for key, name in FILES.items():
  fp=stage/name; entry=m.get('built',{}).get(key)
  if not fp.is_file() or not entry or entry.get('sha256')!=filehash(fp):
   raise RuntimeError(f'{key}: staged file missing or SHA differs from Run14 manifest.')
 return isexact,core,m

def run_one(stage, engine, tests, timeout):
 """Independent browser process and temporary filesystem per test."""
 output=[]
 for case in tests:
  with tempfile.TemporaryDirectory(prefix=f'nova-run16-{engine.lower()}-') as tmp:
   temp=Path(tmp);(temp/'F4').mkdir();(temp/'tests').mkdir();(temp/'shots'/'F4-01').mkdir(parents=True)
   shutil.copyfile(stage/FILES[engine],temp/'F4'/FILES[engine])
   original=(HERE/'f4-run16-cases'/case).read_text(encoding='utf8')
   # Retain the Linux Chromium path when present; otherwise use the OS Playwright
   # browser, optionally overridden with NOVA_CHROMIUM. Original scripts unchanged.
   original='import os\n'+original
   executable="(os.environ.get('NOVA_CHROMIUM') or ('/usr/bin/chromium' if os.path.exists('/usr/bin/chromium') else None))"
   original=original.replace("executable_path='/usr/bin/chromium'",'executable_path='+executable)
   test=temp/'tests'/case;test.write_text(original,encoding='utf8')
   env=dict(os.environ);env['PYTHONUNBUFFERED']='1'
   cmd=[sys.executable,str(test)]
   if engine=='F4-01':
    cmd += ['--html',str(temp/'F4'/FILES[engine]),'--record',str(temp/'tests'/'F4-01-BROWSER-RESULTS.json'),
      '--shots',str(temp/'shots'/'F4-01')]
   started=time.monotonic()
   log_out=temp/'stdout.log';log_err=temp/'stderr.log'
   with log_out.open('wb') as so, log_err.open('wb') as se:
    try:
     proc=subprocess.run(cmd,cwd=temp,env=env,stdout=so,stderr=se,timeout=timeout)
     code=proc.returncode;timed=False
    except subprocess.TimeoutExpired:
     code=None;timed=True
   out=log_out.read_text(encoding='utf8',errors='replace')[-8000:]
   err=log_err.read_text(encoding='utf8',errors='replace')[-3000:]
   files=list((temp/'tests').glob('*RESULTS.json'))
   derived=[]
   for fp in files:
    try:
     parsed=normalize_report(json.loads(fp.read_text(encoding='utf-8')),fp.name)
     derived.append({'name':fp.name, **parsed})
    except Exception as e:
     derived.append({'name':fp.name,'read_error':str(e),'passed_all':False})
   ok=(code==0 and not timed and bool(derived)
       and all(d.get('passed_all') is True for d in derived))
   output.append({'engine':engine,'case':case,'passed':ok,'timed_out':timed,'exit_code':code,
    'duration_sec':round(time.monotonic()-started,2),'results':derived,'stdout_tail':out,'stderr_tail':err})
 return output

def main():
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument('--diagnostic',action='store_true',help='Diagnostic only; NEVER counts as exact-core approval.')
 parser.add_argument('--stage',type=Path,default=STAGE)
 parser.add_argument('--engines',nargs='*',choices=sorted(FILES))
 parser.add_argument('--timeout',type=int,default=160,help='Per-regression-script timeout, seconds, default 160')
 args=parser.parse_args()
 if not 20<=args.timeout<=600:parser.error('--timeout should be 20-600 seconds')
 try:isexact,core,build=validate(args.stage.resolve(),args.diagnostic)
 except Exception as exc:
  # Invalidate any earlier green Run16 result so a blocked rerun cannot leave a stale PASS.
  dest=BANK/'review'/'F4-RUN16-PHYSICAL-RESULTS.json'
  dest.parent.mkdir(parents=True,exist_ok=True)
  dest.write_text(json.dumps({'run':'F4-RUN17 patched physical suite',
    'status':'BLOCKED_EXACT_CORE_OR_STAGE_GUARD','reason':str(exc),
    'exact_current_github_core':False,'owner_gold_approval':False,
    'summary':{'passed_scripts':0,'total_scripts':0,'failed_scripts':0,'timed_out_scripts':0}},indent=2)+'\n',encoding='utf8')
  print('RUN16 BLOCKED',exc,file=sys.stderr)
  return 2
 config=json.loads((BANK/'docs'/'F4-RUN16-CASES.json').read_text())
 engines=args.engines or list(FILES)
 report={'run':'F4-RUN16','status':'IN_PROGRESS','exact_current_github_core':isexact,'core_blob_sha':core,
  'source_stage':str(args.stage.resolve()),'owner_gold_approval':False,
  'engines':engines,'cases':[],'limits':['Native touch and screen reader not tested',
  'F4-05 is a frozen F5-11 preset; F4-10 is integrated into F4-08',
  'Test runs against staged review HTML, not full live lesson integration']}
 dest=BANK/'review'/'F4-RUN16-PHYSICAL-RESULTS.json';dest.parent.mkdir(exist_ok=True)
 for eng in engines:
  for check in run_one(args.stage.resolve(),eng,config[eng],args.timeout):
   report['cases'].append(check)
   print(eng,check['case'],'PASS' if check['passed'] else 'FAIL/TIMEOUT',check['duration_sec'],'seconds',flush=True)
   dest.write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
 passed=sum(bool(x['passed']) for x in report['cases']);total=len(report['cases'])
 report['summary']={'passed_scripts':passed,'total_scripts':total,'failed_scripts':total-passed,
  'timed_out_scripts':sum(x['timed_out'] for x in report['cases'])}
 report['status']=('EXACT_CORE_POINTER_QA_PASS_OWNER_REVIEW_PENDING' if isexact and total==sum(len(config[e]) for e in engines) and passed==total else
 'DIAGNOSTIC_ONLY_NOT_EXACT_CORE_ACCEPTANCE' if (not isexact and passed==total) else 'FAIL_OR_INCOMPLETE')
 dest.write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
 print('RESULT',report['status'],report['summary'],'Report:',dest,flush=True)
 return 0 if passed==total else 1

if __name__=='__main__':sys.exit(main())
