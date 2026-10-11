from pathlib import Path
import json,sys
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
html=(R/'F7/F7-09-balance-negatives-unknowns.html').read_text()
rows=[]
def ck(label,val):rows.append({'name':label,'pass':bool(val)});print(('PASS' if val else 'FAIL'),label,flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  for width in (380,1280):
   for motion in ('reduce','no-preference'):
    p=b.new_page(viewport={'width':width,'height':1120},reduced_motion=motion)
    errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
    p.set_content(html,wait_until='load')
    p.get_by_text('Explore',exact=True).first.click()
    def drag(selector,x,y):
     src=p.locator(selector).first
     src.scroll_into_view_if_needed()
     a=src.bounding_box()
     q=p.evaluate('''v=>{let s=document.querySelector('#F7-08 .f708-svg'),a=s.createSVGPoint();a.x=v.x;a.y=v.y;let b=a.matrixTransform(s.getScreenCTM());return [b.x,b.y]}''',{'x':x,'y':y})
     p.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);p.mouse.down();p.mouse.move(q[0],q[1],steps=13);p.mouse.up();p.wait_for_timeout(280)
    F=p.evaluate('''()=>F708_MATH.geometry()''');x=F['cx'];y=F['trayY']+53
    # first remove equal unknowns from left / right by real pointer
    drag('[data-f708-token][data-side="left"][data-type="x"]',x,y)
    ck(f'{width}/{motion} drag left x initiates pending',p.locator('svg.f708-svg').get_attribute('data-pending').startswith('remove-left-x'))
    ck(f'{width}/{motion} lifted weight returned',not p.evaluate('''()=>!!NOVA.ui._drag'''))
    drag('[data-f708-token][data-side="right"][data-type="x"]',x,y)
    ck(f'{width}/{motion} paired x drag simplifies correctly',p.locator('svg.f708-svg').get_attribute('data-equation')=='x − 3 = 2')
    ck(f'{width}/{motion} paired beam level',abs(float(p.locator('svg.f708-svg').get_attribute('data-tilt')))<.01)
    # signed balloon has no opposite -1, an unmatched remove must return safely
    drag('[data-f708-token][data-side="left"][data-type="unit"][data-sign="-1"]',x,y)
    ck(f'{width}/{motion} unmatched balloon safely refused',p.locator('svg.f708-svg').get_attribute('data-equation')=='x − 3 = 2' and not p.locator('svg.f708-svg').get_attribute('data-pending'))
    ck(f'{width}/{motion} no dangling drag',not p.evaluate('''()=>!!NOVA.ui._drag'''))
    # keyboard first place two sign opposite units in same pan; return one pair
    p.get_by_text('Add +1/−1 left',exact=True).click()
    ck(f'{width}/{motion} zero pair no tilt',p.locator('svg.f708-svg').get_attribute('data-zero-left')=='1' and abs(float(p.locator('svg.f708-svg').get_attribute('data-tilt')))<.01)
    t=p.locator('[data-f708-token][data-zero-pair="true"]').first;t.focus();t.press('Delete')
    ck(f'{width}/{motion} zero pair keyboard cancellation',p.locator('svg.f708-svg').get_attribute('data-zero-left')=='0')
    ck(f'{width}/{motion} zero pair gesture no stranded',not p.evaluate('''()=>!!NOVA.ui._drag'''))
    # invalid drop and Escape recovery
    t=p.locator('[data-f708-token][data-side="left"][data-type="x"]').first;t.scroll_into_view_if_needed();r=t.bounding_box();p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(r['x']+15,r['y']-90,steps=8);p.mouse.up();p.wait_for_timeout(120)
    ck(f'{width}/{motion} invalid drag snaps home',not p.evaluate('''()=>!!NOVA.ui._drag''') and p.locator('svg.f708-svg').get_attribute('data-equation')=='x − 3 = 2')
    t=p.locator('[data-f708-token][data-side="left"][data-type="x"]').first;r=t.bounding_box();p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(r['x']+24,r['y']-10,steps=4);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(110)
    ck(f'{width}/{motion} Escape releases drag',not p.evaluate('''()=>!!NOVA.ui._drag'''))
    ck(f'{width}/{motion} no page errors',not errs,)
    p.close()
 finally:b.close()
res={'passed':sum(x['pass'] for x in rows),'failed':sum(not x['pass'] for x in rows),'checks':rows};(R/'tests/F7-09-DRAG-RESULTS.json').write_text(json.dumps(res,indent=2));print('TOTAL',res['passed'],'/',len(rows));sys.exit(1 if res['failed'] else 0)
