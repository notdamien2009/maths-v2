from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path('/mnt/data/f7run06-work/bank-v3-neon-chalk');html=(root/'F7/F7-06-factorising-with-tiles.html').read_text();res=[]
def ck(n,v):res.append({'name':n,'pass':bool(v)});print(('PASS ' if v else 'FAIL ')+n,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':1080},reduced_motion='no-preference');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  try:
   page.set_content(html,wait_until='load',timeout=30000);page.locator('#F7-06 button:has-text("Explore")').first.click();page.wait_for_timeout(750)
   sv=page.locator('svg.f706-svg');sv.scroll_into_view_if_needed();t=page.locator('[data-f706-slot="tray"][data-f706-type="x"]').first
   loc=page.evaluate('''()=>{const p=F706_CONFIG.presets['Y7-032'];let m=innerWidth<=720,W=m?500:1000,Bx=m?72:128,Bu=m?32:56,f=Math.min(2.8,(m?385:690)/(p.a*Bx+p.b*Bu)),xW=Bx*f,uW=Bu*f,ww=p.a*xW+p.b*uW;let z=F706_MATH.geomSlots(p,{x:(W-ww)/2,y:m?264:255,xW,uW,h:uW,step:uW});let q=z.find(s=>s.type==='x');return{x:q.x+q.w/2,y:q.y+q.h/2}}''')
   target=sv.evaluate('''(s,v)=>{const pt=s.createSVGPoint();pt.x=v.x;pt.y=v.y;const t=pt.matrixTransform(s.getScreenCTM());return {x:t.x,y:t.y}}''',loc)
   r=t.bounding_box();page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(target['x'],target['y'],steps=22);page.mouse.up();page.wait_for_timeout(260)
   ck(f'{w}-normal-pointer-placed',sv.get_attribute('data-placed')=='1')
   ck(f'{w}-normal-no-stranded',page.evaluate('NOVA.ui._drag===null'))
   ck(f'{w}-normal-no-errors',not errs)
  except Exception as e:traceback.print_exc();ck(f'{w}-fatal',False)
  finally:page.close()
 b.close()
(root/'tests/f706-normal-results.json').write_text(json.dumps(res,indent=2),'utf8')
print('RESULT',sum(x['pass'] for x in res),'/',len(res));raise SystemExit(1 if not all(x['pass'] for x in res) else 0)
