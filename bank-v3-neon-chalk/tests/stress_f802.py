from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1]; html=(R/'F8/F8-02-inverse-operations-flowchart.html').read_text(); checks=[]
def rec(n,ok,d=''):checks.append({'test':n,'passed':bool(ok),'detail':str(d)[:180]})
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (380,1280):
  p=b.new_page(viewport={'width':w,'height':980},reduced_motion='reduce');p.set_default_timeout(4500)
  p.set_content(html,wait_until='load');p.locator('#F8-03 .nova-tab[data-m="explore"]').click()
  p.locator('#F8-03 .f802-select').select_option('Y7-033');m=w<=760
  def dest(x,y):return p.evaluate('''([x,y])=>{const s=document.querySelector('#F8-03 .f802-svg'),b=s.getBoundingClientRect(),v=s.viewBox.baseVal;return{x:b.x+x/v.width*b.width,y:b.y+y/v.height*b.height}}''',[x,y])
  def drag(src,x,y,steps=2):
   elt=p.locator(src).first;elt.scroll_into_view_if_needed(); bb=elt.bounding_box(); q=dest(x,y)
   p.mouse.move(bb['x']+bb['width']*.5,bb['y']+bb['height']*.5)
   p.mouse.down();p.mouse.move(q['x'],q['y'],steps=steps);p.mouse.up();p.wait_for_timeout(160)
  first=(305,563) if m else (754,471)
  second=(135,563) if m else (355,471)
  clear=(220,967) if m else (933,636)
  bad=(15,350) if m else (15,345)
  try:
   drag('[data-inverse-card="s3"]',*first,2)
   rec(f'{w}/fast-first',p.locator('#F8-03 [data-inverse-slot="0"][data-operation="s3"]').count()==1)
   rec(f'{w}/no-strand-first',p.evaluate('!NOVA.ui._drag'))
   drag('[data-inverse-card="d2"]',*second,1)
   rec(f'{w}/fast-second',p.locator('#F8-03 [data-inverse-slot="1"][data-operation="d2"]').count()==1)
   rec(f'{w}/no-strand-second',p.evaluate('!NOVA.ui._drag'))
   rec(f'{w}/math-recovered', 'Recovered input: 6' in p.locator('#F8-03 .f802-feedback').inner_text())
   drag('[data-inverse-slot="1"]',*clear,3)
   p.wait_for_timeout(370)
   rec(f'{w}/remove-regrab',p.locator('#F8-03 [data-inverse-slot="1"]').count()==0)
   rec(f'{w}/no-strand-removed',p.evaluate('!NOVA.ui._drag'))
   drag('[data-inverse-card="d2"]',*bad,1)
   p.wait_for_timeout(420)
   rec(f'{w}/invalid-rejected',p.locator('#F8-03 [data-inverse-slot="1"]').count()==0)
   rec(f'{w}/no-strand-invalid',p.evaluate('!NOVA.ui._drag'))
   drag('[data-inverse-card="d2"]',*second,2)
   rec(f'{w}/re-place',p.locator('#F8-03 [data-inverse-slot="1"]').count()==1)
   rec(f'{w}/clean-re-place',p.evaluate('!NOVA.ui._drag'))
   p.get_by_role('button',name='Reset inverse route').click()
   rec(f'{w}/reset-recovery',p.locator('#F8-03 [data-inverse-slot]').count()==0)
  except Exception as e:rec(f'{w}/pointer-error',False,e)
  p.close()
 b.close()
report={'total':len(checks),'passed':sum(x['passed'] for x in checks),'failed':[x for x in checks if not x['passed']],'checks':checks};(R/'tests/F8-02-stress-results.json').write_text(json.dumps(report,indent=2));print('POINTER',report['passed'],'/',report['total'],'failed',len(report['failed']))
for x in report['failed']:print('FAIL',x)
