from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1];ht=(root/'F7/F7-08-balance-scales.html').read_text('utf8');out=[]
def ck(n,c):out.append({'test':n,'pass':bool(c)});print(('PASS ' if c else 'FAIL ')+n,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1280,'height':1120},reduced_motion='no-preference');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(ht)
 page.locator('#F7-08 button:has-text("Explore")').first.click()
 def drag(selector,x,y):
  src=page.locator(selector).first;src.scroll_into_view_if_needed();a=src.bounding_box();q=page.evaluate('''p=>{let s=document.querySelector('#F7-08 .f708-svg'),a=s.createSVGPoint();a.x=p.x;a.y=p.y;let b=a.matrixTransform(s.getScreenCTM());return [b.x,b.y]}''',{'x':x,'y':y});page.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);page.mouse.down();page.mouse.move(q[0],q[1],steps=12);page.mouse.up();page.wait_for_timeout(690)
 F=page.evaluate('''()=>F708_MATH.geometry()''');x=F['cx'];y=F['trayY']+53
 drag('#F7-08 [data-f708-token][data-side="left"][data-type="unit"]',x,y)
 ck('desktop-normal-pointer-left-to-return',page.locator('svg.f708-svg').get_attribute('data-pending').startswith('remove-left-unit'))
 ck('desktop-normal-pointer-not-stranded',page.evaluate('''()=>!NOVA.ui._drag'''))
 drag('#F7-08 [data-f708-token][data-side="right"][data-type="unit"]',x,y)
 ck('desktop-normal-paired-drag-balanced',page.locator('svg.f708-svg').get_attribute('data-equation')=='x + 2 = 6')
 t=page.locator('#F7-08 [data-f708-token][data-side="left"][data-type="unit"]').first;t.scroll_into_view_if_needed();r=t.bounding_box();page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(r['x']+15,r['y']-52,steps=8);page.mouse.up();page.wait_for_timeout(500)
 ck('desktop-normal-invalid-drop-home',page.locator('svg.f708-svg').get_attribute('data-equation')=='x + 2 = 6' and not page.evaluate('''()=>!!NOVA.ui._drag'''))
 t=page.locator('#F7-08 [data-f708-token][data-side="left"][data-type="unit"]').first;r=t.bounding_box();page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(r['x']+22,r['y']+15,steps=4);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(450)
 ck('desktop-normal-escape-recovers',page.evaluate('''()=>!NOVA.ui._drag''') and page.locator('svg.f708-svg').get_attribute('data-equation')=='x + 2 = 6')
 ck('desktop-normal-no-errors',not errors)
 page.close();b.close()
(root/'tests/f708-desktop-normal.json').write_text(json.dumps(out,indent=2),'utf8')
print('RESULT',sum(z['pass'] for z in out),'/',len(out));sys.exit(1 if not all(z['pass'] for z in out) else 0)
