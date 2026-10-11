#!/usr/bin/env python3
"""Browser-only smoke tests for staged F4 review HTML; no writes outside review/.

Usage: python tests/f4-run14-smoke.py
Requires Python playwright and locally installed Chromium or Playwright browser.
"""
from pathlib import Path
import argparse,json,sys
try:
 from playwright.sync_api import sync_playwright
except ImportError:
 raise SystemExit('Install Playwright first: pip install playwright && python -m playwright install chromium')
R=Path(__file__).resolve().parents[1]
TABLE=['F4-01-part-whole-bar','F4-02-comparison-bar','F4-03-cuisenaire-rod-builder',
 'F4-04-multi-step-bar-model','F4-06-percentage-bar','F4-07-ratio-bar',
 'F4-08-algebra-bar','F4-09-before-and-after-bar',
 'F4-11-word-problem-highlighter','F4-12-rates-tape-diagram']
CHECK_JS='''()=>{const el=document.documentElement,s=document.querySelector('.nova-stage');
const t=document.querySelector('[role=tab][aria-selected=true]');
const box=s?.getBoundingClientRect();
return {selected:t?.textContent?.trim()||'',svg:s?.querySelectorAll('svg').length||0,
 stage_height:Math.round(box?.height||0),body_overflow:el.scrollWidth>el.clientWidth+2,
 numberLine:typeof window.NOVA?.numberLine,svgDrag:typeof window.NOVA?.ui?.svgDrag,
 motion:typeof window.NOVA?.motion?.tween};}'''

def main():
 p=argparse.ArgumentParser()
 p.add_argument('--stage',type=Path,default=R/'review/F4-RUN14-stage')
 p.add_argument('--chromium',default=None,help='optional path to locally installed Chromium')
 p.add_argument('--engines',nargs='*',default=None,help='Optional F4 IDs, e.g. --engines F4-01 F4-02')
 p.add_argument('--report-name',default='F4-RUN14-BROWSER-RESULTS.json')
 args=p.parse_args()
 stage=args.stage.resolve()
 if not (stage/'F4-01-part-whole-bar.html').exists():raise SystemExit('Stage not found: run python build/build-f4-run14.py first.')
 report={'type':'F4 Run14 browser smoke','verified':[], 'failures':[], 'checked':0,'passed':0,'scope':'mode/render only; not an exhaustive maths or physical touch audit'}
 with sync_playwright() as p:
  kw={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage']}
  if args.chromium:kw['executable_path']=args.chromium
  browser=p.chromium.launch(**kw)
  for name in [x for x in TABLE if not args.engines or x[:5] in args.engines]:
   path=stage/(name+'.html')
   for width in (380,1280):
    page=browser.new_page(viewport={'width':width,'height':950},reduced_motion='reduce')
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    try:
     page.set_content(path.read_text(encoding='utf8'),wait_until='domcontentloaded',timeout=30000)
     for mode in ('Watch','Guided','Explore','Challenge'):
      report['checked']+=1
      try:
       page.get_by_role('tab',name=mode,exact=True).click(timeout=4000,force=True)
       c=page.evaluate(CHECK_JS)
       okay=(mode.lower() in c['selected'].lower() and c['svg']>=1 and
         c['stage_height']>100 and not c['body_overflow'] and
         not errors and c['numberLine']=='function' and c['svgDrag']=='function' and c['motion']=='function')
       row={'id':name[:5],'width':width,'mode':mode,'pass':okay,'checks':c,'errors':errors[:]}
      except Exception as e:
       row={'id':name[:5],'width':width,'mode':mode,'pass':False,'error':str(e)[:350]}
      report['verified'].append(row)
      if row['pass']:report['passed']+=1
      else:report['failures'].append(row)
    except Exception as e:
     for mode in ('Watch','Guided','Explore','Challenge'):
      report['checked']+=1
      row={'id':name[:5],'width':width,'mode':mode,'pass':False,'error':str(e)[:250]}
      report['verified'].append(row);report['failures'].append(row)
    finally:page.close()
    print(name[:5],width,'current',report['passed'],'/',report['checked'],flush=True)
  browser.close()
 stage.mkdir(parents=True,exist_ok=True)
 (stage/args.report_name).write_text(json.dumps(report,indent=2)+'\n')
 print(f"RESULT {report['passed']}/{report['checked']}; failures={len(report['failures'])}")
 return 0 if not report['failures'] else 1
if __name__=='__main__':sys.exit(main())
