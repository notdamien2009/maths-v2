import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];html=(ROOT/'F5/F5-10-mixed-improper-converter.html').read_text();out=[]
def ck(w,m,desc,value):out.append(dict(width=w,motion=m,test=desc,passed=bool(value)));print('PASS' if value else 'FAIL',w,m,desc,flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (320,768):
  for motion in ('reduce','no-preference'):
   p=b.new_page(viewport={'width':w,'height':1000},reduced_motion=motion);errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.set_content(html,wait_until='domcontentloaded',timeout=40000)
   p.locator('#F5-10 .nova-tab[data-m="explore"]').click()
   ck(w,motion,'mounted scene',p.locator('#F5-10 .mx-svg').count()==1)
   p.evaluate('NOVA_F5_10_CONFIG._explore.set(13,4,1,13)')
   ck(w,motion,'four-whole slot geometry',p.locator('#F5-10 .mx-svg [data-whole]').count()==3)
   ck(w,motion,'fourth slot available',p.evaluate('NOVA_F5_10_CONFIG._explore.get().remainder')==1)
   p.evaluate('NOVA_F5_10_CONFIG._explore.breakWhole("keyboard")')
   ck(w,motion,'break returns denominator pieces',p.evaluate('NOVA_F5_10_CONFIG._explore.get().p')==9)
   p.evaluate('NOVA_F5_10_CONFIG._explore.set(7,3,1,0)')
   x=p.locator('#F5-10 [data-piece="source"] .nv-hit');x.scroll_into_view_if_needed();bb=x.bounding_box()
   p.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);p.mouse.down();p.mouse.move(bb['x']+25,bb['y']+80,steps=9);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(480)
   ck(w,motion,'Escape cancels active drag',p.evaluate('NOVA_F5_10_CONFIG._explore.get().p')==0 and p.evaluate('!NOVA.ui._drag'))
   for i in range(3):p.evaluate('NOVA_F5_10_CONFIG._explore.add("keyboard")')
   ck(w,motion,'repeated place fuses one whole',p.locator('#F5-10 .mx-svg [data-whole="0"]').count()==1)
   p.locator('#F5-10 [data-piece="whole"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(70)
   ck(w,motion,'keyboard break',p.evaluate('NOVA_F5_10_CONFIG._explore.get().p')==0)
   p.evaluate('NOVA_F5_10_CONFIG._explore.set(7,3,-1,7)')
   ck(w,motion,'negative fraction stage',p.locator('#F5-10 .mx-svg').text_content().find('−')>=0)
   ck(w,motion,'no horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   ck(w,motion,'no stranded active drag',p.evaluate('!NOVA.ui._drag'))
   ck(w,motion,'no runtime errors',len(errors)==0)
   if w==320 and motion=='reduce':p.locator('#F5-10 .nova-stage').screenshot(path=str(ROOT/'shots/F5/F5-10-320-negative.png'))
   p.close()
 b.close()
(ROOT/'tests/stress-f510-results.json').write_text(json.dumps(out,indent=2));print('RESULT',sum(x['passed'] for x in out),'/',len(out));sys.exit(0 if all(x['passed'] for x in out) else 1)
