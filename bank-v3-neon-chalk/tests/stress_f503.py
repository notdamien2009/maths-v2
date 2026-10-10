from playwright.sync_api import sync_playwright
from pathlib import Path
import random,json
R=Path('/mnt/data/f5_premium_r3');src=(R/'F5/F5-03-area-model-fractions.html').read_text();result=[]
def chk(name,ok,extra=''):
 result.append({'name':name,'pass':bool(ok),'info':str(extra)[:80]});print(('PASS' if ok else 'FAIL'),name,extra,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (320,768):
  page=b.new_page(viewport={'width':w,'height':870},reduced_motion='no-preference');err=[];page.on('pageerror',lambda e:err.append(str(e)));page.set_content(src,wait_until='domcontentloaded',timeout=30000)
  for m in ('watch','guided','explore','challenge'):
   page.locator('#F5-03 .nova-tab[data-m="'+m+'"]').click();page.wait_for_timeout(80)
   chk(f'{w} {m} renders',page.locator('#F5-03 .am-svg').count()==1)
   if m=='explore':page.locator('#F5-03 .nova-stage').screenshot(path=str(R/f'shots/F5-03-{w}-explore.png'),timeout=30000)
  page.locator('#F5-03 .nova-tab[data-m="guided"]').click();page.evaluate('NOVA.engines["F5-03"].timeline.go(4,"test")');page.wait_for_timeout(1150)
  chk(f'{w} count-up/green overlap',page.locator('#F5-03 [data-overlap="1"]').count()==6)
  page.locator('#F5-03 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(70)
  # deterministic high-coverage interaction stress using public model functions
  for k in range(14):
   a,bv,c,d= (k*3)%5,(k%8)+1,(k*5)%7,((k+2)%8)+1
   a%=bv+1;c%=d+1
   page.evaluate('([a,b,c,d])=>NOVA_F5_03_CONFIG._explore.set(a,b,c,d)',[a,bv,c,d])
   cells=page.locator('#F5-03 [data-overlap="1"]').count()
   chk(f'{w} stress product {k+1}',cells==a*c,f'{a}/{bv}×{c}/{d} = {cells}/{bv*d}')
  # repeat keyboard at focused handle: should work across redraws
  page.evaluate('NOVA_F5_03_CONFIG._explore.set(0,4,0,4)')
  page.locator('[aria-label="Selected columns"]').focus();page.keyboard.press('ArrowRight');page.keyboard.press('ArrowRight')
  chk(f'{w} repeat keyboard focus',page.evaluate('NOVA_F5_03_CONFIG._explore.get().a')==2)
  chk(f'{w} no horizontal page overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  chk(f'{w} no browser errors',not err,err[:2])
  page.close()
 b.close()
(R/'tests/stress-results.json').write_text(json.dumps(result,indent=2))
print('TOTAL',sum(v['pass'] for v in result),'/',len(result))
