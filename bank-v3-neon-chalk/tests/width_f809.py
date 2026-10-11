"""Inspect overflow and evidence containment across supported widths / modes."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-09-substitution-table.html').read_text();tests=[]
def rec(name,ok,d=''):
 tests.append({'test':name,'pass':bool(ok),'detail':str(d)[:170]})
 if not ok:print('FAIL',name,d)
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in [360,380,430,760,1280,1600]:
  p=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errs=[];p.on('pageerror',lambda e:errs.append(str(e)));p.set_content(HTML)
  for mode in ['watch','guided','explore','challenge']:
   p.locator(f'#F8-09 .nova-tab[data-m="{mode}"]').click();m=p.evaluate('''()=>{let e=document.querySelector('#F8-09 .f809-svg');let r=e.getBoundingClientRect();return {scroll:document.documentElement.scrollWidth,viewport:innerWidth,svgWidth:r.width,svgRight:r.right,svgLeft:r.left,errors:0,viewBox:e.viewBox.baseVal.width}}''')
   rec(f'{w}/{mode}/no-page-overflow',m['scroll']<=m['viewport']+1,m)
   rec(f'{w}/{mode}/svg-in-page',m['svgLeft']>=-2 and m['svgRight']<=w+2,m)
   rec(f'{w}/{mode}/maths-present',p.locator('#F8-09 .f809-svg text').count()>10)
   rec(f'{w}/{mode}/no-js-errors',not errs,errs)
  p.close()
 b.close()
obj={'component':'F8-09','passed':sum(x['pass'] for x in tests),'total':len(tests),'failed':[x for x in tests if not x['pass']],'checks':tests};(R/'tests/F8-09-width-results.json').write_text(json.dumps(obj,indent=2));print('WIDTH',obj['passed'],'/',obj['total'])
if obj['failed']:raise SystemExit(1)
