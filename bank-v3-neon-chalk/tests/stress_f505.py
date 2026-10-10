from pathlib import Path
import json,sys
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];html=(root/'F5/F5-05-equivalent-fraction-multiplier.html').read_text();out=root/'tests';out.mkdir(exist_ok=True)
results=[]
def ok(w,scenario,result,detail=''):
 results.append({'width':w,'check':scenario,'passed':bool(result),'detail':str(detail)[:150]});print('PASS' if result else 'FAIL',w,scenario,str(detail)[:80],flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (320,380,768,1280):
  pg=b.new_page(viewport={'width':width,'height':900},reduced_motion='no-preference');errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.set_content(html,wait_until='domcontentloaded',timeout=30000)
  pg.locator('#F5-05 .nova-tab[data-m="guided"]').click()
  pg.evaluate('NOVA.engines["F5-05"].timeline.go(2,"stress")');pg.wait_for_timeout(70)
  early=pg.locator('#F5-05 [data-original-cover]').count()
  ok(width,'animated original-size covers present',early==2,early)
  pg.wait_for_timeout(920)
  late=pg.locator('#F5-05 [data-original-cover]').count()
  ok(width,'tiles fully subdivide after animation',late==0,late)
  pg.locator('#F5-05 .nova-tab[data-m="explore"]').click()
  pg.evaluate('NOVA_F5_05_CONFIG._explore.set(2,3,2)')
  for k in [3,4,2,3,4,2]:
   pg.evaluate('(k)=>NOVA_F5_05_CONFIG._explore.setFactor(k,"stress")',k)
   pg.wait_for_timeout(95)
   got=pg.evaluate('NOVA_F5_05_CONFIG._explore.get()')
   ok(width,'rapid redraw factor '+str(k),got['k']==k and pg.locator('#F5-05 .eq-svg').count()==1,got)
  pg.wait_for_timeout(750)
  ok(width,'no leftover animation tiles',pg.locator('#F5-05 [data-original-cover]').count()==0)
  ok(width,'no horizontal page overflow',pg.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  ok(width,'no stranded active drag',pg.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
  ok(width,'no page errors',len(errs)==0,errs)
  # Confirm visual at the boundaries.
  if width in (320,768):pg.locator('#F5-05 .nova-stage').screenshot(path=str(root/'shots/F5'/f'F5-05-{width}-explore.png'))
  pg.close()
  # ensure reduced motion shows final state straight away, no transient covers
  rm=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');rm.set_content(html,wait_until='domcontentloaded',timeout=30000);rm.locator('#F5-05 .nova-tab[data-m="guided"]').click();rm.evaluate('NOVA.engines["F5-05"].timeline.go(2,"stress")')
  ok(width,'reduced motion renders completed split immediately',rm.locator('#F5-05 [data-original-cover]').count()==0)
  rm.close()
 b.close()
(out/'stress-f505-results.json').write_text(json.dumps(results,indent=2))
print('STRESS TOTAL',sum(x['passed'] for x in results),'/',len(results),flush=True)
sys.exit(0 if all(x['passed'] for x in results) else 1)
