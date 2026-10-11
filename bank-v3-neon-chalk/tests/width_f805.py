#!/usr/bin/env python3
"""Actual layout checks at additional breakpoints, including three-operation equation."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];html=(R/'F8/F8-05-both-sides-equation-solver.html').read_text();checks=[]
def rec(n,v,detail=''):checks.append({'test':n,'passed':bool(v),'detail':str(detail)[:150]})
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (430,760,1024,1920):
  p=b.new_page(viewport={'width':w,'height':975},reduced_motion='reduce');err=[];p.on('pageerror',lambda e:err.append(str(e)));p.set_content(html)
  for mode in ('guided','explore','challenge'):
   p.locator(f'#F8-05 .nova-tab[data-m="{mode}"]').click()
   if mode=='explore':p.locator('.f805-select').select_option('Y8-014')
   s=p.locator('.f805-svg'); bb=s.bounding_box();rec(f'{w}/{mode}/stage-width',bb['width']<=w+1,bb)
   rec(f'{w}/{mode}/no-horizontal-overflow',p.evaluate('document.documentElement.scrollWidth<=window.innerWidth+3'))
   rec(f'{w}/{mode}/maths-correct',s.get_attribute('data-maths-correct')=='true')
   if mode=='explore':rec(f'{w}/{mode}/four-equation-lines',s.locator('[data-working-line]').count()==4)
  rec(f'{w}/no-page-errors',not err,err)
  p.close()
 b.close()
report={'total':len(checks),'passed':sum(x['passed'] for x in checks),'failed':[x for x in checks if not x['passed']],'checks':checks};(R/'tests/F8-05-width-results.json').write_text(json.dumps(report,indent=2));print('WIDTH',report['passed'],'/',report['total']);[print('FAIL',x) for x in report['failed']]
assert not report['failed']
