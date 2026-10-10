"""NOVA F5-09 stress/regression: real pointer, keyboard, Escape, motion and rational constraints."""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];html=(root/'F5/F5-09-divide-fractions.html').read_text();shots=root/'shots/F5'
results=[]
def ck(w,typ,label,pass_,detail=None):
 results.append({'width':w,'motion':typ,'test':label,'passed':bool(pass_),'detail':str(detail or '')[:140]});print(('PASS' if pass_ else 'FAIL'),w,typ,label,flush=True)
def drag(p,what,x,y):
 el=p.locator(f'#F5-09 [data-group^="{what}:"] .nv-hit').first;el.scroll_into_view_if_needed(timeout=3500);r=el.bounding_box();pt=p.evaluate('''v=>{let s=document.querySelector('#F5-09 .dg-svg'),q=s.createSVGPoint();q.x=v[0];q.y=v[1];let z=q.matrixTransform(s.getScreenCTM());return {x:z.x,y:z.y};}''',[x,y]);p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(pt['x'],pt['y'],steps=16);p.mouse.up();p.wait_for_timeout(650)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (320,768):
  for motion in ('reduce','no-preference'):
   p=browser.new_page(viewport={'width':w,'height':900},reduced_motion=motion);err=[];p.on('pageerror',lambda e:err.append(str(e)))
   p.set_content(html,wait_until='domcontentloaded',timeout=45000)
   p.locator('#F5-09 .nova-tab[data-m="explore"]').click();p.wait_for_timeout(120)
   ck(w,motion,'render',p.locator('#F5-09 .dg-svg').count()==1)
   p.locator('#F5-09 .nova-stage').screenshot(path=str(shots/f'F5-09-{w}-{motion}-explore.png'),timeout=10000)
   ck(w,motion,'initial model',p.evaluate('NOVA_F5_09_CONFIG._explore.get().slots===2'))
   yy=966 if w==320 else 672;xx=120 if w==320 else 200
   drag(p,'source',xx,yy);ck(w,motion,'real first drag',p.evaluate('NOVA_F5_09_CONFIG._explore.get().placed')==1)
   p.locator('[data-group^="source:"]').first.focus();p.keyboard.press('Enter');p.wait_for_timeout(160)
   ck(w,motion,'repeat keyboard placement',p.evaluate('NOVA_F5_09_CONFIG._explore.get().placed')==2)
   # regrabbing last group then dropping it in red return tray
   rx,ry=(197,1142) if w==320 else (910,824)
   drag(p,'placed',rx,ry);ck(w,motion,'regrab and return',p.evaluate('NOVA_F5_09_CONFIG._explore.get().placed')==1)
   p.locator('[data-group^="source:"]').first.scroll_into_view_if_needed();box=p.locator('[data-group^="source:"] .nv-hit').first.bounding_box();p.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);p.mouse.down();p.mouse.move(box['x']+40,box['y']+50,steps=4);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(470)
   ck(w,motion,'Escape clears capture',p.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
   ck(w,motion,'Escape preserves count',p.evaluate('NOVA_F5_09_CONFIG._explore.get().placed')==1)
   # Check exact case changes after active drag and corresponding partial/whole quotient.
   cases=[(1,2,3,4,2,3),(2,3,1,4,8,3),(5,4,1,2,5,2),(1,1,2,3,3,2),(1,2,1,4,2,1)]
   for a,b,c,d,n,den in cases:
    p.evaluate('(a)=>NOVA_F5_09_CONFIG._explore.set(...a)',[a,b,c,d]);v=p.evaluate('NOVA_F5_09_CONFIG._explore.get()');ck(w,motion,f'exact {a}/{b}÷{c}/{d}',v['quotient']==[n,den] and v['placed']==0)
   ck(w,motion,'no horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   ck(w,motion,'no stray JS errors',not err,err)
   p.close()
 browser.close()
(root/'tests/stress-f509-results.json').write_text(json.dumps(results,indent=2));print('STRESS',sum(x['passed'] for x in results),'/',len(results));sys.exit(0 if all(x['passed'] for x in results) else 1)
