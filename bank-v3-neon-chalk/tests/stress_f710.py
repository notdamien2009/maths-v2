from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
R=Path(__file__).resolve().parents[1];s=(R/'F7/F7-10-cups-and-counters.html').read_text();log=[]
def ck(name,ok,extra=''):
 print(('PASS' if ok else 'FAIL'),name,extra,flush=True);log.append({'name':name,'passed':bool(ok),'info':str(extra)[:300]})
def drag(p,a,b,steps=9):
 b.scroll_into_view_if_needed();a.scroll_into_view_if_needed(); ab=a.bounding_box();bb=b.bounding_box();assert ab and bb
 ax=ab['x']+ab['width']/2;ay=ab['y']+ab['height']/2;bx=bb['x']+bb['width']/2;by=bb['y']+bb['height']/2
 p.mouse.move(ax,ay);p.mouse.down();p.mouse.move(bx,by,steps=steps);p.mouse.up();p.wait_for_timeout(410)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 try:
  for w in [380,1280]:
   for motion in ['reduce','no-preference']:
    p=b.new_page(viewport={'width':w,'height':950},reduced_motion=motion);errs=[];p.on('pageerror',lambda e:errs.append(str(e)));p.set_content(s,wait_until='load');p.get_by_text('Explore',exact=True).first.click()
    for n in range(2):
     token=p.locator('[data-f708-token][data-side="left"][data-type="unit"]').first
     target=p.locator('svg.f710-svg').locator('text',has_text='RETURN').first
     drag(p,token,target,steps=16)
     ck(f'{w} {motion} {n} pointer removal pending',p.locator('svg.f710-svg').get_attribute('data-pending')=='remove-left-unit-1')
     other=p.locator('[data-f708-token][data-side="right"][data-type="unit"]').first
     drag(p,other,target,steps=16)
     ck(f'{w} {motion} {n} pointer matching',p.locator('svg.f710-svg').get_attribute('data-pending')=='' and p.locator('svg.f710-svg').get_attribute('data-equation')==['2x + 1 = 9','2x = 8'][n])
    # drag RHS counter into each cup
    for k in [0,1]:
     src=p.locator('[data-f710-loose]').first
     cup=p.locator(f'[data-f710-cup="{k}"]').first
     drag(p,src,cup,steps=12)
     ck(f'{w} {motion} share to cup {k}',p.locator('svg.f710-svg').get_attribute('data-shared')==str(k+1),p.locator('svg.f710-svg').get_attribute('data-share-counts'))
    # Esc recovery while dragging
    token=p.locator('[data-f710-loose]').first;token.scroll_into_view_if_needed();q=token.bounding_box();p.mouse.move(q['x']+q['width']/2,q['y']+q['height']/2);p.mouse.down();p.mouse.move(q['x']+90,q['y']-50,steps=3);p.keyboard.press('Escape');p.mouse.up();
    ck(f'{w} {motion} Escape does not alter share',p.locator('svg.f710-svg').get_attribute('data-shared')=='2')
    ck(f'{w} {motion} browser error free',not errs,errs)
    p.close()
 finally:b.close()
(R/'tests/F7-10-DRAG-RESULTS.json').write_text(json.dumps({'passed':sum(c['passed'] for c in log),'failed':sum(not c['passed'] for c in log),'checks':log},indent=2))
print('TOTAL',sum(c['passed'] for c in log),sum(not c['passed'] for c in log))
sys.exit(1 if any(not c['passed'] for c in log) else 0)
