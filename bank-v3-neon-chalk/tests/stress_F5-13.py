from playwright.sync_api import sync_playwright
from pathlib import Path
import json
p=Path('/mnt/data/f5_premium_r13/bank-v3-neon-chalk/F5/F5-13-fdp-conversion-machine.html')
checks=[];errors=[]
def ck(n,t):checks.append([n,bool(t)])
with sync_playwright() as w:
 b=w.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (320,768):
  for motion in ('reduce','no-preference'):
   page=b.new_page(viewport={'width':width,'height':900},reduced_motion=motion)
   perr=[];page.on('pageerror',lambda e:perr.append(str(e)))
   page.set_content(p.read_text(),wait_until='domcontentloaded');page.wait_for_timeout(120)
   ck(f'{width}:{motion}:svg',page.locator('#F5-13 .fdp-svg').count()==1)
   ck(f'{width}:{motion}:overflow',page.evaluate('document.documentElement.scrollWidth-innerWidth')<=1)
   page.locator('#F5-13 .nova-tab[data-m="explore"]').click()
   checksamples=['0.(3)','-0.1(6)','12.5%','1/7','0','-3/8']
   ip=page.locator('#F5-13 input[aria-label="Fraction decimal or percent input"]')
   for v in checksamples:
    ip.fill(v);ip.dispatch_event('change')
    val=page.evaluate('NOVA_F5_13_CONFIG._explore.get()')
    ck(f'{width}:{motion}:parse:{v}',isinstance(val['fraction'],str) and len(val['decimal'])>0)
   ip.fill('1/3');ip.dispatch_event('change')
   card=page.locator('#F5-13 [data-input-card]');card.scroll_into_view_if_needed()
   pos=page.evaluate('''(()=>{let n=document.querySelector('#F5-13 [data-input-card] rect.nv-hit');let r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()''')
   # invalid drop (same start plus small delta not inside hopper)
   page.mouse.move(pos['x'],pos['y']);page.mouse.down();page.mouse.move(pos['x']+20,pos['y']+5,steps=5);page.mouse.up();page.wait_for_timeout(450 if motion=='no-preference' else 70)
   ck(f'{width}:{motion}:invalid drop rejected',not page.evaluate('NOVA_F5_13_CONFIG._explore.get().converted'))
   # escape mid drag
   card=page.locator('#F5-13 [data-input-card]');card.scroll_into_view_if_needed()
   pos=page.evaluate('''(()=>{let n=document.querySelector('#F5-13 [data-input-card] rect.nv-hit');let r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()''')
   page.mouse.move(pos['x'],pos['y']);page.mouse.down();page.mouse.move(pos['x']+20,pos['y']+15,steps=5);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(40)
   ck(f'{width}:{motion}:escape release',not page.evaluate('!!NOVA.ui._drag'))
   ck(f'{width}:{motion}:still unconverted',not page.evaluate('NOVA_F5_13_CONFIG._explore.get().converted'))
   ck(f'{width}:{motion}:javascript',not perr)
   page.close()
 b.close()
print('stress:',sum(x[1] for x in checks),'/',len(checks))
for n,ok in checks:
 if not ok:print('FAILED',n)
Path('/mnt/data/f5_premium_r13/stress_results.json').write_text(json.dumps({'pass':sum(x[1] for x in checks),'total':len(checks),'checks':checks},indent=2))
