from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parent.parent
checks=[]
def point(pg,x,y):return pg.locator('.f315-svg').evaluate('''(el,p)=>{const m=el.getScreenCTM();return {x:m.a*p.x+m.c*p.y+m.e,y:m.b*p.x+m.d*p.y+m.f}}''',{'x':x,'y':y})
def drag(pg,s,d,fast=False):
 pg.mouse.move(s['x'],s['y']);pg.mouse.down();
 if fast:
  pg.mouse.move(d['x']-14,d['y']+18,steps=1);pg.mouse.move(d['x']+5,d['y']-4,steps=1)
 else:pg.mouse.move(d['x'],d['y'],steps=10)
 pg.mouse.move(d['x'],d['y'],steps=1);pg.mouse.up();pg.wait_for_timeout(500)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in [380,1280]:
  pg=b.new_page(viewport={'width':w,'height':1550},reduced_motion='no-preference')
  errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content((R/'F3/F3-15-surd-and-exact-value-builder.html').read_text());pg.locator('#F3-15 [data-m=challenge]').click()
  pg.locator('#F3-15 .nova-stage').scroll_into_view_if_needed()
  pg.wait_for_timeout(250)
  # Wrong factor 9 should not be accepted.
  drag(pg,point(pg,52+332+155,855+60),point(pg,805,240),True)
  checks.append({'width':w,'name':'wrong factor returned','ok':pg.locator('#F3-15 [data-factor="36"]').count()==1 and pg.locator('#F3-15 .f315-svg').locator('text').all_text_contents().count('Square factor')>0})
  # Fast cursor jump on correct factor.
  drag(pg,point(pg,205,915),point(pg,805,246),True)
  checks.append({'width':w,'name':'correct factor drag','ok':pg.locator('#F3-15 [data-answer]').count()==3})
  if pg.locator('#F3-15 [data-answer]').count()!=3: print('panel',pg.locator('#F3-15 .nova-panel').inner_text());continue
  # Source answer card 6 root 2 lives at x 52..362, y 855..985
  drag(pg,point(pg,210,917),point(pg,805,708),True)
  checks.append({'width':w,'name':'correct exact-card drag','ok':pg.locator('#F3-15 [data-placed-answer="6:2"]').count()==1})
  # Drag placed answer back to red remove tray; resets current proof.
  if pg.locator('#F3-15 [data-placed-answer="6:2"]').count():
   drag(pg,point(pg,810,704),point(pg,880,1096),True)
   pg.wait_for_timeout(300)
   checks.append({'width':w,'name':'drag back to Remove','ok':pg.locator('#F3-15 [data-factor="36"]').count()==1})
  # Start a fast drag, then Escape. Should leave no active F0 transaction.
  start=point(pg,200,920);far=point(pg,505,600)
  pg.mouse.move(start['x'],start['y']);pg.mouse.down();pg.mouse.move(far['x'],far['y'],steps=1);pg.keyboard.press('Escape');pg.mouse.up();pg.wait_for_timeout(500)
  checks.append({'width':w,'name':'Escape cancels drag','ok':pg.evaluate('NOVA.ui._drag === null')})
  checks.append({'width':w,'name':'no runtime errors','ok':not errors,'errors':errors})
  pg.close()
 b.close()
(R/'tests/DRAG-NORMAL-RESULTS.json').write_text(json.dumps({'assertions':len(checks),'passed':sum(x['ok'] for x in checks),'results':checks},indent=2))
print(json.dumps({'assertions':len(checks),'passed':sum(x['ok'] for x in checks),'results':checks},indent=2))
