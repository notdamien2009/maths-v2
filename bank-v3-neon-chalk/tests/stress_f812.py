from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1]
result=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':940},reduced_motion='reduce');errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((R/'F8/F8-12-quadratic-solve-routes.html').read_text(),wait_until='commit')
  page.locator('#F8-12 [data-m="explore"]').click()
  def c(label,val):
   result.append({'test':f'{w}/{label}','pass':bool(val)})
   if not val:print('FAIL',w,label,flush=True)
  def svgpt(x,y):
   return page.locator('.f812-svg').evaluate('(svg,p)=>{const m=svg.getScreenCTM(),z=svg.createSVGPoint();z.x=p.x;z.y=p.y;const r=z.matrixTransform(m);return {x:r.x,y:r.y}}',{'x':x,'y':y})
  def coords(index):
   return page.locator('.f812-svg').evaluate('(svg,i)=>{const g=svg.querySelector(`[data-ring="${i}"]`),circle=g.querySelector("circle");if(circle)return {x:+circle.getAttribute("cx"),y:+circle.getAttribute("cy")};return {x:0,y:0}}',str(index))
  # First ring comes from return tray; drop at root negative two.
  page.locator('[data-ring="0"]').scroll_into_view_if_needed()
  a=coords(0);D=page.evaluate('F812_TEST.draw?null:null')
  # Reconstruct matching core plot coordinates from rendered chart label locations (the graph uses [−5,5]).
  mobile=w<=760; px=(60 if mobile else 636);py=(600 if mobile else 204);pw=343 if mobile else 421;ph=397 if mobile else 354
  # y-axis location uses the NOVA plot actual converter, derive its pixels by finding x-axis tick label y=0? It may differ due padding.
  target=page.locator('.f812-svg').evaluate('''svg=>{let plots=svg.querySelectorAll('text');const txt=[...plots].find(e=>e.textContent==='0' && e.getAttribute('x'));return txt?{x:Number(txt.getAttribute('x')),y:Number(txt.getAttribute('y'))-16}:null}''')
  # Known calculation using formula N.neonPlot validated browser plot API manually.
  pl=page.evaluate('''()=>{const s=F812_TEST.draw(document.createElement('div'),{mode:'explore',preset:'Y8-031-A',state:F812_TEST.state()});return {x:s.plot.X(-2),y:s.plot.Y(0),x0:s.plot.X(0),xmin:s.plot.X(-5)}}''')
  start=svgpt(a['x'],a['y']);end=svgpt(pl['x'],pl['y'])
  page.mouse.move(start['x'],start['y']);page.mouse.down();page.mouse.move(end['x'],end['y'],steps=15);page.mouse.up()
  z=coords(0);c('drag placed near root',abs(z['x']-pl['x'])<5 and abs(z['y']-pl['y'])<5)
  c('drag state released',not page.evaluate('!!NOVA.ui._drag'))
  page.locator('.f812-svg').screenshot(path=str(R/f'shots/F8-12-{w}-pointer-after.png'))
  # regrab and move second ring to +2
  page.locator('[data-ring="1"]').scroll_into_view_if_needed()
  a=coords(1);bpt=svgpt(a['x'],a['y']);b2=svgpt(pl['x0']+(pl['x0']-pl['x']),pl['y'])
  page.mouse.move(bpt['x'],bpt['y']);page.mouse.down();page.mouse.move(b2['x'],b2['y'],steps=18);page.mouse.up()
  z=coords(1);c('second ring drag placed',abs(z['x']-(pl['x0']+(pl['x0']-pl['x'])))<5 and abs(z['y']-pl['y'])<5)
  c('second drag state released',not page.evaluate('!!NOVA.ui._drag'))
  # Regrab and move ring + half-unit, then keyboard remove/reset
  page.locator('[data-ring="0"]').scroll_into_view_if_needed()
  a=coords(0);aa=svgpt(a['x'],a['y']);bb=svgpt(pl['x']+((pl['x0']-pl['xmin'])/5)*.5,pl['y'])
  page.mouse.move(aa['x'],aa['y']);page.mouse.down();page.mouse.move(bb['x'],bb['y'],steps=15);page.mouse.up()
  z=coords(0);c('regrab changes position',z['x']>a['x']+3)
  c('regrab drag state released',not page.evaluate('!!NOVA.ui._drag'))
  page.locator('[data-ring="0"]').press('Delete')
  c('remove redraws ring',page.locator('[data-ring="0"]').count()==1)
  c('keyboard after mouse works',not page.evaluate('!!NOVA.ui._drag'))
  c('no JS errors',not errors)
  page.close()
 b.close()
summary={'passed':sum(x['pass'] for x in result),'total':len(result),'failed':[x for x in result if not x['pass']],'checks':result}
(R/'tests/F8-12-stress-results.json').write_text(json.dumps(summary,indent=2))
print('STRESS',summary['passed'],'/',summary['total'],'FAIL',summary['failed'][:8],flush=True)
assert not summary['failed']
