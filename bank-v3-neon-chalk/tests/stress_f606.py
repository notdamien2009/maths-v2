"""Repeated actual pointer-drags: choose/regrab/return/invalid/outside and keyboard."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,traceback
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-06-best-buy-comparer.html').read_text()
res={'component':'F6-06','checks':[],'failures':[]}
def ck(name,good,detail=''):
 good=bool(good);res['checks'].append({'test':name,'pass':good,'detail':str(detail)[:240]});
 if not good:res['failures'].append(name+' '+str(detail)[:240])
def drag(p,from_el,to_el,steps=6):
 from_el.scroll_into_view_if_needed(timeout=6000);a=from_el.bounding_box();b=to_el.bounding_box();assert a and b,(a,b)
 x=a['x']+a['width']/2;y=a['y']+a['height']/2;tx=b['x']+b['width']/2;ty=b['y']+b['height']/2
 p.mouse.move(x,y);p.mouse.down();p.mouse.move(tx,ty,steps=steps);p.mouse.up();p.wait_for_timeout(95)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  p=b.new_page(viewport={'width':w,'height':970},reduced_motion='reduce');p.set_default_timeout(6500);errs=[];p.on('pageerror',lambda e:errs.append(str(e)));p.set_content(html,wait_until='domcontentloaded',timeout=60000)
  p.locator('#F6-06 button[role=tab]').filter(has_text='Explore').click()
  try:
   get=lambda:p.evaluate('F606_CONFIG._explore.get()')
   svg=p.locator('#F6-06 .f606-svg');t=svg.locator('[data-best-buy-ring]')
   cardB=svg.locator('.f606-product-icon').nth(1)
   drag(p,t,cardB,steps=9)
   ck(f'{w}/drag-to-b',get()['chosen']=='B',get())
   placed=svg.locator('[data-placed="B"]');tray=svg.locator('text').filter(has_text='RETURN')
   drag(p,placed,tray,steps=7)
   ck(f'{w}/regrab-to-return',get()['chosen'] is None,get())
   for i in range(7):
    svg=p.locator('#F6-06 .f606-svg')
    drag(p,svg.locator('[data-best-buy-ring]'),svg.locator('.f606-product-icon').nth(i%2),steps=2+(i%4))
    ck(f'{w}/cycle-{i}/chosen',get()['chosen']==('A' if i%2==0 else 'B'),get())
    drag(p,svg.locator('[data-placed]'),svg.locator('text').filter(has_text='RETURN'),steps=3)
    ck(f'{w}/cycle-{i}/returned',get()['chosen'] is None,get())
   ring=svg.locator('[data-best-buy-ring]');ring.focus();ring.press('a');ck(f'{w}/keyboard-a',get()['chosen']=='A',get())
   placed=svg.locator('[data-placed="A"]');placed.focus();placed.press('Delete');ck(f'{w}/keyboard-remove',get()['chosen'] is None,get())
   ring=svg.locator('[data-best-buy-ring]');ring.focus();ring.press('e');ck(f'{w}/keyboard-equal',get()['chosen']=='equal',get())
   p.evaluate('F606_CONFIG._explore.reset()')
   # Repeat invalid drop; ring must snap home rather than strand.
   svg=p.locator('#F6-06 .f606-svg');ring=svg.locator('[data-best-buy-ring]');bbox=ring.bounding_box();svgbox=svg.bounding_box()
   p.mouse.move(bbox['x']+bbox['width']/2,bbox['y']+bbox['height']/2);p.mouse.down();p.mouse.move(svgbox['x']+svgbox['width']*.5,svgbox['y']+svgbox['height']*.5,steps=2);p.mouse.up();p.wait_for_timeout(100)
   ck(f'{w}/invalid-does-not-select',get()['chosen'] is None,get())
   ck(f'{w}/drag-state-clean',not p.evaluate('Boolean(NOVA.ui._drag)'))
   ck(f'{w}/no-script-errors',not errs,errs)
  except Exception:ck(f'{w}/exception',False,traceback.format_exc()[-1300:])
  finally:p.close()
 b.close()
res['passed']=sum(c['pass'] for c in res['checks']);res['total']=len(res['checks']);(root/'tests/f606-stress-results.json').write_text(json.dumps(res,indent=2));print('STRESS',res['passed'],'/',res['total'],res['failures'][:10])
if res['failures']:raise SystemExit(1)
