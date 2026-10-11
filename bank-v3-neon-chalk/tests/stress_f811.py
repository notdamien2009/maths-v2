from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];out=[]
def record(ok,name):out.append({'case':name,'pass':bool(ok)});print('FAIL',name,flush=True) if not ok else None
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  p=b.new_page(viewport={'width':width,'height':980},reduced_motion='reduce');errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
  p.set_content((R/'F8/F8-11-inequality-solver.html').read_text(),wait_until='commit')
  p.locator('#F8-11 [data-m="explore"]').click()
  def toClient(x,y):return p.locator('.f811-svg').evaluate('''(svg,t)=>{let q=svg.createSVGPoint();q.x=t.x;q.y=t.y;let n=q.matrixTransform(svg.getScreenCTM());return {x:n.x,y:n.y}}''',{'x':x,'y':y})
  def move(ax,ay,bx,by,n=1):
   start=toClient(ax,ay);end=toClient(bx,by)
   p.mouse.move(start['x'],start['y']);p.mouse.down();p.mouse.move(end['x'],end['y'],steps=n);p.mouse.up();p.wait_for_timeout(30)
  p.locator('[data-boundary="A"]').scroll_into_view_if_needed()
  s=p.locator('.f811-svg').evaluate('(e)=>({w:e.viewBox.baseVal.width,h:e.viewBox.baseVal.height})')
  y=501 if width<=760 else 494
  trayY=y+99;bx=88 if width<=760 else 124
  x0=46 if width<=760 else 93;L=s['w']-2*x0
  def on(v):return x0+(v+8)*L/16
  # Invalid fast pointer: piece should spring home, no drag state remains.
  move(bx,trayY,12,30)
  record(not p.evaluate('!!NOVA.ui._drag'),f'{width}/invalid-drop-recovered')
  record(p.locator('[data-boundary="A"]').count()==1,f'{width}/invalid-marker-present')
  # Fast one-frame drag to valid NOVA core number line at 4.
  p.locator('[data-boundary="A"]').scroll_into_view_if_needed()
  move(bx,trayY,on(4),y,1)
  record(not p.evaluate('!!NOVA.ui._drag'),f'{width}/fast-drop-clear')
  xy=p.locator('[data-boundary="A"]').evaluate('(g)=>{let c=g.querySelector("circle");return {x:+c.getAttribute("cx"),y:+c.getAttribute("cy")}}')
  record(abs(xy['x']-on(4))<15 and abs(xy['y']-y)<2,f'{width}/boundary-snapped-on-four')
  # Return via keyboard, then use repeat keyboard positioning.
  p.locator('[data-boundary="A"]').press('Delete')
  new=p.locator('[data-boundary="A"]').evaluate('(g)=>+g.querySelector("circle").getAttribute("cy")')
  record(abs(new-trayY)<2,f'{width}/marker-returned-to-tray')
  p.locator('[data-boundary="A"]').press('ArrowRight')
  nx=p.locator('[data-boundary="A"]').evaluate('(g)=>+g.querySelector("circle").getAttribute("cy")')
  record(abs(nx-y)<2,f'{width}/keyboard-moving-boundary')
  p.locator('[data-boundary="A"]').press('Escape')
  record(p.locator('[data-boundary="A"]').count()==1 and not p.evaluate('!!NOVA.ui._drag'),f'{width}/escape-return-clean')
  # Real pointer drag of ray chip into direction socket.
  p.locator('[data-ray="left"]').scroll_into_view_if_needed()
  # for default 3-row version bottomY mobile685 / desktop 678
  bottomY=685 if width<=760 else 678
  ax=107 if width<=760 else 322;py=bottomY+42
  move(ax,py+30,ax,bottomY+27,n=1)
  record(not p.evaluate('!!NOVA.ui._drag'),f'{width}/ray-pointer-clean')
  # Pure keyboard direction activation and recovery.
  p.locator('[data-ray="left"]').press('Enter')
  record(p.locator('[data-ray="left"]').get_attribute('aria-pressed')=='true',f'{width}/ray-keyboard-select')
  p.locator('[data-ray="left"]').press('Delete')
  record(p.locator('[data-ray="left"]').get_attribute('aria-pressed')=='false',f'{width}/ray-keyboard-remove')
  record(not errs,f'{width}/no-pageerrors')
  p.close()
 b.close()
rep={'total':len(out),'passed':sum(z['pass'] for z in out),'failed':[z for z in out if not z['pass']],'checks':out};(R/'tests/F8-11-stress-results.json').write_text(json.dumps(rep,indent=2));print('STRESS',rep['passed'],'/',rep['total'],'failed',rep['failed'][:8]);assert not rep['failed']
