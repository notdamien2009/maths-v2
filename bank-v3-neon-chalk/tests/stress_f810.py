from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];rows=[]
with sync_playwright() as P:
 b=P.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  pg=b.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce'); pg.set_content((R/'F8/F8-10-simultaneous-equations.html').read_text(),wait_until='commit')
  pg.locator('#F8-10 [data-m="explore"]').click();mobile=width<=760
  def ok(v,label):rows.append({'case':f'{width}/{label}','pass':bool(v)});print(rows[-1] if not v else '',end='',flush=True)
  def pixel(x,y):return pg.locator('.f810-svg').evaluate('(svg,pt)=>{let p=svg.createSVGPoint();p.x=pt.x;p.y=pt.y;let q=p.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y}}',{'x':x,'y':y})
  def drag(a,bb,steps=2):
   p0=pixel(*a);p1=pixel(*bb);pg.mouse.move(p0['x'],p0['y']);pg.mouse.down();pg.mouse.move(p1['x'],p1['y'],steps=steps);pg.mouse.up()
  # Invalid drop springs the marker back. Fast one-step move.
  pg.locator('[data-marker]').scroll_into_view_if_needed();start=(83,950) if mobile else (74,702)
  drag(start,(20,110),1);ok(not pg.evaluate('!!NOVA.ui._drag'),'marker-invalid-drop-clean')
  ok('DRAG RING' in pg.locator('.f810-svg').text_content(),'marker-returned-to-dock')
  # Move onto (2,3), then back to the red tray.
  target=(49+(2+5)*361/10,125+(7-3)*320/12) if mobile else (67+(2+5)*617/10,136+(7-3)*482/12)
  drag(start,target,1);ok(not pg.evaluate('!!NOVA.ui._drag'),'marker-fast-drag-clean')
  ok('DRAG RING' not in pg.locator('.f810-svg').text_content(),'marker-snapped-into-plot')
  pg.locator('[data-marker]').scroll_into_view_if_needed()
  drag(target,((49+361-105+49),(125+320+20)) if mobile else ((67+617-111+53),(136+482+20)),4)
  pg.wait_for_timeout(380)
  ok(not pg.evaluate('!!NOVA.ui._drag'),'marker-return-drop-clean')
  ok('DRAG RING' in pg.locator('.f810-svg').text_content(),'marker-removed')
  # Keyboard ring reset and keyboard multiplier remove.
  pg.locator('[data-marker]').press('ArrowRight');ok('DRAG RING' not in pg.locator('.f810-svg').text_content(),'marker-keyboard-move')
  pg.locator('[data-marker]').press('Delete');ok('DRAG RING' in pg.locator('.f810-svg').text_content(),'marker-keyboard-return')
  pg.locator('[data-multiplier="+1"]').press('Enter');ok(pg.locator('[data-multiplier="+1"]').count()==0,'multiplier-keyboard-place')
  pg.locator('[data-equation-slot="A"]').press('Delete');ok(pg.locator('[data-multiplier="+1"]').count()==1,'multiplier-keyboard-return')
  # Fast place and re-grab from equation A onto the return zone.
  el=pg.locator('[data-multiplier="+1"]');el.scroll_into_view_if_needed();bb=el.bounding_box();st=(bb['x']+bb['width']/2,bb['y']+bb['height']/2)
  targetEl=pg.locator('[data-equation-slot="A"]');bb=targetEl.bounding_box();to=(bb['x']+bb['width']/2,bb['y']+bb['height']/2)
  pg.mouse.move(*st);pg.mouse.down();pg.mouse.move(*to,steps=1);pg.mouse.up()
  ok(not pg.evaluate('!!NOVA.ui._drag'),'multiplier-fast-drop-clean')
  ok(pg.locator('[data-multiplier="+1"]').count()==0,'multiplier-drop-attached')
  pg.locator('[data-equation-slot="A"]').press('Delete');ok(pg.locator('[data-multiplier="+1"]').count()==1,'multiplier-regrab-return')
  pg.close()
 b.close()
obj={'total':len(rows),'passed':sum(x['pass'] for x in rows),'failures':[x for x in rows if not x['pass']],'checks':rows}
(R/'tests/F8-10-stress-results.json').write_text(json.dumps(obj,indent=2));print('STRESS',obj['passed'],'/',obj['total'],'FAIL',obj['failures'][:3])
assert obj['passed']==obj['total']
