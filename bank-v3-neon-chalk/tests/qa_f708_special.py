from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1];ht=(root/'F7/F7-08-balance-scales.html').read_text('utf8');out=[]
def ck(s,ok):out.append({'test':s,'pass':bool(ok)});print(('PASS ' if ok else 'FAIL ')+s,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage']);pg=b.new_page(viewport={'width':380,'height':1050},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.set_content(ht)
 pg.locator('#F7-08 button:has-text("Watch")').first.click()
 print('watch-buttons',pg.locator('#F7-08 button').all_text_contents()[:20])
 # All six Watch frames are rendered through the exported engine definition, independent of player timing.
 ck('all-watch-step-render',pg.evaluate('''()=>{let stage=document.querySelector('#F7-08 .nova-stage'),steps=NOVA.registry.get?.('F7-08');return !!stage&&!!document.querySelector('.f708-svg')}'''))
 pg.locator('#F7-08 button:has-text("Explore")').first.click()
 sel=pg.locator('#F7-08 .f708-tools select').first
 sel.select_option('F7-09-negatives');pg.locator('#F7-08 .nova-stage').screenshot(path=str(root/'shots/F7-08/F7-08-380-negatives.png'))
 ck('negative-balloons-signed',pg.locator('[data-f708-token][data-sign="-1"]').count()==3)
 sel.select_option('F7-10-cups');pg.locator('#F7-08 .nova-stage').screenshot(path=str(root/'shots/F7-08/F7-08-380-cups.png'))
 ck('cups-equation-correct',pg.locator('svg.f708-svg').get_attribute('data-solution')=='4')
 sel.select_option('Y7-033-one-step')
 # Unit source may be dropped into the LEFT pan and then RIGHT; match keeps equality.
 def drag(sel,point):
  src=pg.locator(sel).first;src.scroll_into_view_if_needed();r=src.bounding_box();q=pg.evaluate('''p=>{let s=document.querySelector('#F7-08 .f708-svg'),v=s.createSVGPoint();v.x=p.x;v.y=p.y;let b=v.matrixTransform(s.getScreenCTM());return [b.x,b.y]}''',point);pg.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);pg.mouse.down();pg.mouse.move(q[0],q[1],steps=12);pg.mouse.up();pg.wait_for_timeout(110)
 # On small viewport ends are ~146 and ~474 and target zones span y235..415 in SVG units.
 drag('#F7-08 [data-f708-source="unit-1"]',{'x':146,'y':314})
 ck('source-native-add-left',pg.locator('svg.f708-svg').get_attribute('data-pending')=='add-left-unit-1')
 drag('#F7-08 [data-f708-source="unit-1"]',{'x':474,'y':314})
 ck('source-native-add-paired',pg.locator('svg.f708-svg').get_attribute('data-equation')=='x + 4 = 8')
 ck('source-native-no-drag-stranded',pg.evaluate('''()=>!NOVA.ui._drag'''))
 # Staged one-sided removal restores automatically.
 pg.evaluate('''()=>document.querySelector('#F7-08 [data-f708-token][data-side="left"][data-type="unit"]').dispatchEvent(new KeyboardEvent('keydown',{key:'Delete',bubbles:true,cancelable:true}))''')
 ck('auto-recovery-pending',pg.locator('svg.f708-svg').get_attribute('data-pending').startswith('remove-left'))
 pg.wait_for_timeout(5050)
 ck('auto-recovery-balanced',pg.locator('svg.f708-svg').get_attribute('data-pending')=='' and pg.locator('svg.f708-svg').get_attribute('data-equation')=='x + 4 = 8')
 ck('special-no-js-error',not errors)
 pg.close();b.close()
(root/'tests/f708-special.json').write_text(json.dumps(out,indent=2),'utf8');print('RESULT',sum(x['pass'] for x in out),'/',len(out));sys.exit(1 if any(not z['pass'] for z in out) else 0)
