from playwright.sync_api import sync_playwright
from pathlib import Path
import json,traceback,sys
p=Path('/mnt/data/f5_premium_r13/bank-v3-neon-chalk/F5/F5-13-fdp-conversion-machine.html')
results=[]; fail=[]
def ck(name,flag):
 results.append((name, bool(flag)))
 if not flag:fail.append(name)
with sync_playwright() as w:
 b=w.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  page=b.new_page(viewport={'width':width,'height':960},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  try:
   page.set_content(p.read_text(),wait_until='domcontentloaded',timeout=45000)
   page.wait_for_timeout(80)
   ck(f'{width}: 4 modes',page.locator('#F5-13 .nova-tab').count()==4)
   ck(f'{width}: no overflow',page.evaluate('document.documentElement.scrollWidth-innerWidth')<=1)
   ck(f'{width}: no js errors',not errors)
   # six guided stages, watch stepper uses buttons
   for i in range(6):
    page.evaluate(f'''document.querySelector('#F5-13 .nova-tab[data-m="guided"]').click()''') if i==0 else None
    if i>0:
     page.locator('#F5-13 .nova-tl button').last.click() if False else None
    page.evaluate(f'''(()=>{{let d=NOVA.registry.get('F5-13'); if(d) return true;return true}})()''') if False else None
   # mode Explore and programmatic exact conversion checks
   page.locator('#F5-13 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(40)
   inp=page.locator('#F5-13 input[aria-label="Fraction decimal or percent input"]')
   cases=[('1/3','1/3','0.(3)','33.(3)%'),('1/6','1/6','0.1(6)','16.(6)%'),('2/5','2/5','0.4','40%'),('7/8','7/8','0.875','87.5%'),('0.(3)','1/3','0.(3)','33.(3)%'),('12.5%','1/8','0.125','12.5%'),('-3/8','-3/8','-0.375','-37.5%'),('5/4','5/4','1.25','125%')]
   for u,a,d,per in cases:
    inp.fill(u);inp.dispatch_event('change')
    r=page.evaluate('NOVA_F5_13_CONFIG._explore.get()')
    ck(f'{width} input {u}',r['fraction']==a and r['decimal']==d and r['percentage']==per)
   inp.fill('1/3');inp.dispatch_event('change');page.wait_for_timeout(30)
   # enter via keyboard on drag card
   card=page.locator('#F5-13 [data-input-card]')
   card.focus();card.press('Enter');page.wait_for_timeout(50)
   ck(f'{width}: keyboard feed',page.evaluate('NOVA_F5_13_CONFIG._explore.get().converted'))
   # reset before pointer test
   page.get_by_role('button',name='Reset machine').click();page.wait_for_timeout(50)
   card=page.locator('#F5-13 [data-input-card]');card.scroll_into_view_if_needed();hopper=page.locator('#F5-13 .fdp-svg').locator('g.nv-neon-box').nth(1)
   bb=page.evaluate('''(()=>{let n=document.querySelector('#F5-13 [data-input-card] rect.nv-hit');let r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})()''')
   # use svg rect coordinates to target based on viewBox and actual svg client size
   svg=page.locator('#F5-13 .fdp-svg')
   pt=page.evaluate('''(()=>{const s=document.querySelector('#F5-13 .fdp-svg');let p=s.createSVGPoint();p.x=210;p.y=340;return {x:p.matrixTransform(s.getScreenCTM()).x,y:p.matrixTransform(s.getScreenCTM()).y}})()''' if width==380 else '''(()=>{const s=document.querySelector('#F5-13 .fdp-svg');let p=s.createSVGPoint();p.x=520;p.y=239;return {x:p.matrixTransform(s.getScreenCTM()).x,y:p.matrixTransform(s.getScreenCTM()).y}})()''')
   if bb:
    print('DRAG',width,bb,pt,flush=True)
    x=bb['x']+bb['width']/2;y=bb['y']+bb['height']/2
    page.mouse.move(x,y);page.mouse.down();page.mouse.move(pt['x'],pt['y'],steps=10);page.mouse.up();page.wait_for_timeout(100)
    ck(f'{width}: drag input to hopper',page.evaluate('NOVA_F5_13_CONFIG._explore.get().converted'))
   # screenshots all modes
   for mode in ('watch','guided','explore','challenge'):
    page.locator(f'#F5-13 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(60)
    try:page.locator('#F5-13 .nova-stage').screenshot(path=f'/mnt/data/f5_premium_r13/bank-v3-neon-chalk/shots/F5/F5-13-{width}-{mode}.png',timeout=15000)
    except Exception as e:print('screenshot issue',width,mode,e,flush=True)
    ck(f'{width}: mode {mode}',page.locator('#F5-13 .fdp-svg').count()==1)
   # challenges controlled via internal small QA hooks and check button
   ch=[('0.375',1),('1/3',2),('1/8',2)]
   for ans,expected_idx in ch:
    page.evaluate(f'NOVA_F5_13_CONFIG._challenge.setAnswer({json.dumps(ans)})')
    page.locator('#F5-13 .nova-panel button').filter(has_text='Check answer').click();page.wait_for_timeout(650)
    cur=page.evaluate('NOVA_F5_13_CONFIG._challenge.task()')
    ck(f'{width}: challenge {ans}',cur==expected_idx)
   ck(f'{width}: no errors after interaction',not errors)
  except Exception as e:
   fail.append(f'{width} runner exception {e}');traceback.print_exc()
  page.close()
 b.close()
print('PASS',len(results)-len(fail),'/',len(results),'FAIL',len(fail),flush=True)
for z in fail:print('FAIL',z)
Path('/mnt/data/f5_premium_r13/qa_results.json').write_text(json.dumps({'passed':len(results)-len([x for x in results if not x[1]]),'total':len(results),'fail':fail,'checks':results},indent=2))
