import sys,json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];HTML=(ROOT/'F5/F5-11-fraction-of-an-amount.html').read_text();out=[]
def ck(w,m,key,ok):out.append({'width':w,'motion':m,'check':key,'passed':bool(ok)});print('PASS' if ok else 'FAIL',w,m,key,flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (320,768):
  for motion in ('reduce','no-preference'):
   p=b.new_page(viewport={'width':w,'height':900},reduced_motion=motion);errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
   p.set_content(HTML,wait_until='domcontentloaded',timeout=50000)
   p.locator('#F5-11 .nova-tab[data-m="explore"]').click()
   ck(w,motion,'mounted SVG',p.locator('#F5-11 .fa-svg').count()==1)
   p.evaluate('NOVA_F5_11_CONFIG._explore.set(48,1,2,[])')
   ck(w,motion,'48 exact source counters',p.locator('#F5-11 [data-source-counter]').count()==48)
   ck(w,motion,'24 whole counters in both groups',p.locator('#F5-11 [data-group-counter="0"]').count()==24 and p.locator('#F5-11 [data-group-counter="1"]').count()==24)
   p.evaluate('NOVA_F5_11_CONFIG._explore.set(10,2,3,[])')
   ck(w,motion,'partial shares represented',p.locator('#F5-11 [data-fraction-group]').count()==3)
   el=p.locator('#F5-11 [data-group="0"] .nv-hit');el.scroll_into_view_if_needed();r=el.bounding_box()
   p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(r['x']+24,r['y']+95,steps=10);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(470)
   ck(w,motion,'Escape abort returns group',p.evaluate('NOVA_F5_11_CONFIG._explore.get().selected.length')==0)
   ck(w,motion,'no stranded active drag',p.evaluate('!NOVA.ui._drag'))
   p.locator('#F5-11 [data-group="0"]').focus();p.keyboard.press('Enter')
   ck(w,motion,'keyboard selects group',p.evaluate('NOVA_F5_11_CONFIG._explore.get().selected.length')==1)
   p.locator('#F5-11 [data-group="0"]').focus();p.keyboard.press('Enter')
   ck(w,motion,'keyboard removes group',p.evaluate('NOVA_F5_11_CONFIG._explore.get().selected.length')==0)
   p.evaluate('NOVA_F5_11_CONFIG._explore.set(40,7,8,[])')
   ck(w,motion,'eight trays have 5 units each',p.locator('#F5-11 [data-group-counter]').count()==40)
   ck(w,motion,'no horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   ck(w,motion,'no JavaScript errors',not errs)
   if w==320 and motion=='reduce':p.locator('#F5-11 .nova-stage').screenshot(path=str(ROOT/'shots/F5/F5-11-320-eight-groups.png'),timeout=16000)
   p.close()
 b.close()
(ROOT/'tests/stress-f511-results.json').write_text(json.dumps(out,indent=2));print('TOTAL',sum(x['passed'] for x in out),'/',len(out));sys.exit(0 if all(x['passed'] for x in out) else 1)
