#!/usr/bin/env python3
"""NOVA F4 Run15: read-only staged-family browser and mathematics verification.

Never rewrites the canonical core, any F4 engine, or GitHub.  The only output is
review/F4-RUN15-RESULTS.json.  Acceptance is limited to the EXACT GitHub blobs.

Run after: python build/build-f4-run14.py
Then:      python tests/f4-run15-verify.py
For investigation only: python tests/f4-run15-verify.py --diagnostic
"""
from pathlib import Path
import argparse, hashlib, json, sys, time

ROOT=Path(__file__).resolve().parents[1]
CURRENT={'js':'ac0b40a0bf19246ec3a9824798bd67dfe738c91c','css':'1830cd68b3a345cbeefae69782bf2b309765d5fa'}
OLD={'js':'45b41ce94d27ed63e877faac6023e483855da76d','css':'aad5139b1a5de01983efcb78dee6aabf917ea0a4'}
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
 'F4-12':'F4-12-rates-tape-diagram.html'
}

# One browser page contains one engine's model export; check relevant assertions only.
MODEL_CASES={
 'F4-01':'''() => [{name:'known complement',ok:window.F401_MATH?.checkPart({whole:18,known:[7]},11)===true},{name:'wrong complement',ok:window.F401_MATH?.checkPart({whole:18,known:[7]},12)===false}]''',
 'F4-02':'''() => [{name:'symmetric difference',ok:window.F402_MATH?.math({a:15,b:9}).difference===6&&window.F402_MATH?.math({a:9,b:15}).difference===6}]''',
 'F4-03':'''() => [{name:'equal rod trains',ok:window.F403_MATH?.equal([2,2,2],[6])===true},{name:'reject unequal rods',ok:window.F403_MATH?.equal([2,2,1],[6])===false}]''',
 'F4-04':'''() => [{name:'compound rather than additive',ok:window.F404_MATH?.compute(100,[10,-10]).at(-1)===99},{name:'reverse multipliers',ok:window.F404_MATH?.reverse(99,[10,-10])[0]===100}]''',
 'F4-06':'''() => [{name:'15% of 80',ok:window.F406_MATH?.percentAmount(80,15)===12},{name:'reverse percentage',ok:window.F406_MATH?.beforeChange(120,120)===100}]''',
 'F4-07':'''() => [{name:'simplify 6:9',ok:JSON.stringify(window.F407_MATH?.ratio(6,9))==='[2,3]'},{name:'60 in 2:3',ok:(()=>{let a=window.F407_MATH?.totals({a:2,b:3,total:60});return a?.A===24&&a?.B===36})()}]''',
 'F4-08':'''() => [{name:'solve 3x+5=26',ok:window.F408_MATH?.solve({n:3,b:5,total:26}).x===7},{name:'unsolved expression hidden',ok:window.F408_MATH?.solve({n:3,b:5,total:null}).x===null}]''',
 'F4-09':'''() => [{name:'20% increase',ok:window.F409_MATH?.calc({before:100,rate:20,kind:'increase',unknown:'after'}).after===120},{name:'20% decrease',ok:window.F409_MATH?.calc({before:100,rate:20,kind:'decrease',unknown:'before'}).after===80}]''',
 'F4-11':'''() => [{name:'expression',ok:window.F411_MATH?.maths({n:3,extra:4,kind:'expression',expected:'3x+4',total:null}).whole==='3x + 4'}]''',
 'F4-12':'''() => [{name:'120 in three hours',ok:window.F412_MATH?.math({units:3,rate:40,total:120,kind:'rate'}).answer===40},{name:'reject wrong total',ok:(()=>{try{window.F412_MATH?.math({units:3,rate:40,total:130,kind:'rate'});return false}catch{return true}})()}]'''
}


def gitblob(data):
 return hashlib.sha1((f'blob {len(data)}\0').encode()+data).hexdigest()

def run(args):
 try:
  from playwright.sync_api import sync_playwright
 except ImportError:
  raise SystemExit('Playwright missing. Install via: python -m pip install playwright && python -m playwright install chromium')
 stage=(ROOT/'review/F4-RUN14-stage') if args.stage is None else Path(args.stage)
 stage=stage.resolve()
 if not stage.is_dir():raise SystemExit(f'No staged directory: {stage}. First run python build/build-f4-run14.py')
 expected=stage/'F4-RUN14-BUILD-RESULTS.json'
 if not expected.is_file():raise SystemExit('Stage has no Run14 manifest: refusing to treat files as verified')
 manifest=json.loads(expected.read_text(encoding='utf8'))
 core={ext:gitblob((ROOT/'core'/f'nova-core.{ext}').read_bytes()) for ext in ['js','css']}
 actual_core=(core==CURRENT)
 accepted_snapshot=(manifest.get('baseline')=='github-48a7eb7-f12' and manifest.get('core_git_blobs')==CURRENT and actual_core)
 legacy_snapshot=(manifest.get('baseline')=='legacy-v3.6.2' and manifest.get('core_git_blobs')==OLD and core==OLD)
 if not accepted_snapshot and not (args.diagnostic and (legacy_snapshot or args.allow_fixture)):
  raise SystemExit(f'Current-core exact check BLOCKED: found {core}; expected {CURRENT}. Do not claim official compatibility. Use --diagnostic --allow-fixture ONLY for clearly-labelled synthetic test evidence.')
 result={'run':'F4-RUN15','status':'VERIFIED_GITHUB_CORE_QA_IN_PROGRESS' if accepted_snapshot else 'DIAGNOSTIC_ONLY_NOT_GITHUB_VALIDATION',
         'original_source_untouched':True,'github_untouched':True,'core':core,'stage_manifest':manifest.get('core_git_blobs'),
         'exact_github_core':accepted_snapshot,'mode_checks':[],'math_checks':[],'errors':[],'summary':{}}
 for id,filename in FILES.items():
  f=stage/filename
  item=manifest.get('built',{}).get(id)
  correct=item is not None and item.get('sha256')==hashlib.sha256(f.read_bytes()).hexdigest() if f.is_file() else False
  if not correct:raise SystemExit(f'{id} staged HTML does not match Run14 SHA. Refusing altered build.')
 with sync_playwright() as p:
  opts={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage']}
  if args.chromium:opts['executable_path']=args.chromium
  browser=p.chromium.launch(**opts)
  for id,filename in FILES.items():
   if args.engines and id not in args.engines:continue
   html=(stage/filename).read_text(encoding='utf8')
   for width in (380,1280):
    page=browser.new_page(viewport={'width':width,'height':960},reduced_motion='reduce')
    problems=[];page.on('pageerror',lambda e:problems.append(str(e)))
    try:
     page.set_content(html,wait_until='domcontentloaded',timeout=16000)
     if width==380:
      try:
       cases=page.evaluate(MODEL_CASES[id]);
       for m in cases: result['math_checks'].append({'engine':id,'case':m['name'],'passed':bool(m['ok'])})
      except Exception as e:result['math_checks'].append({'engine':id,'case':'model execution','passed':False,'error':str(e)[:240]})
     for mode in ('Watch','Guided','Explore','Challenge'):
      try:
       page.get_by_role('tab',name=mode,exact=True).click(force=True,timeout=3500)
       s=page.evaluate('''() => ({svg:document.querySelector('.nova-stage')?.querySelectorAll('svg').length||0,
         stage:document.querySelector('.nova-stage')?.getBoundingClientRect().height||0,
         selected:document.querySelector('[role=tab][aria-selected=true]')?.textContent||'',
         overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2,
         drag:typeof window.NOVA?.ui?.svgDrag,motion:typeof window.NOVA?.motion?.tween,
         numberLine:typeof window.NOVA?.numberLine})''')
       ok=s['svg']>=1 and s['stage']>100 and mode.lower() in s['selected'].lower() and not s['overflow'] and not problems and all(s[k]=='function' for k in ['drag','motion','numberLine'])
       result['mode_checks'].append({'engine':id,'width':width,'mode':mode,'passed':ok,'data':s,'errors':problems[:]})
      except Exception as e: result['mode_checks'].append({'engine':id,'width':width,'mode':mode,'passed':False,'error':str(e)[:240]})
    except Exception as e:result['errors'].append({'engine':id,'width':width,'error':str(e)[:300]})
    finally:page.close()
   print(id,'modes',sum(x['passed'] for x in result['mode_checks'] if x['engine']==id),'/',len([x for x in result['mode_checks'] if x['engine']==id]),flush=True)
  browser.close()
 summary=result['summary']
 for category in ('mode_checks','math_checks'):
  group=result[category];summary[category]={'passed':sum(x['passed'] for x in group),'total':len(group),'failed':sum(not x['passed'] for x in group)}
 passed=all(not x['failed'] for x in summary.values()) and not result['errors']
 result['status']=('EXACT_GITHUB_CORE_BROWSER_MATH_PASS' if passed and accepted_snapshot else 'DIAGNOSTIC_ONLY_NOT_GITHUB_VALIDATION' if passed else 'FAILED_REVIEW_REQUIRED')
 result['limitations']=['Physical pointer stress, native touchscreen, external screen-reader and integrated lesson-shell behaviour not covered here',
  'Prior F4-05 F5-11 preset remains frozen and is not rebuilt in Run14/Run15',
  'This script does not confer owner GOLD approval']
 outfile=ROOT/'review'/args.report_name;outfile.parent.mkdir(parents=True,exist_ok=True)
 outfile.write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
 print('STATUS',result['status'],'RESULTS',summary,'report:',outfile,flush=True)
 return 0 if passed and accepted_snapshot else (0 if passed and args.diagnostic else 1)

if __name__=='__main__':
 a=argparse.ArgumentParser(description=__doc__)
 a.add_argument('--stage',type=Path,help='Prebuilt staging folder (default Run14 review)')
 a.add_argument('--report-name',default='F4-RUN15-RESULTS.json',help='JSON result filename under review/')
 a.add_argument('--chromium',help='Optional executable_path for Chromium browser')
 a.add_argument('--engines',nargs='*',choices=list(FILES),help='Optional subset of engines')
 a.add_argument('--diagnostic',action='store_true',help='Explicitly allow legacy source for diagnostic checks (not release approval)')
 a.add_argument('--allow-fixture',action='store_true',help='Allow a synthetic fixture for diagnostic testing ONLY')
 args=a.parse_args()
 if '/' in args.report_name or '\\' in args.report_name or not args.report_name.endswith('.json'):
  a.error('--report-name must be a .json basename')
 sys.exit(run(args))
